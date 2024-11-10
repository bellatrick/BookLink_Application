
// Store for managing auth state
let authState = {
    isAuthenticated: false,
    accessToken: null,
    expiresAt: null
  };

  // Check if there's a valid token in storage when the extension loads
  chrome.storage.local.get(['accessToken', 'expiresAt'], function(result) {

    if (result.accessToken && result.expiresAt) {

      const now = new Date().getTime();
      if (now < result.expiresAt) {
        authState.isAuthenticated = true;
        authState.accessToken = result.accessToken;
        authState.expiresAt = result.expiresAt;
      }
    }
  });

// Auth0 configuration
const {AUTH0_DOMAIN,AUTH0_CLIENT_ID,AUTH0_AUDIENCE,SERVER_URL}= process.env
const auth0Config = {
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    responseType: 'token id_token',
    scope: 'openid profile email',
    redirectUri: chrome.identity.getRedirectURL(),
    audience:AUTH0_AUDIENCE,

  };
  function getRandomBytes(length = 16) {
    const randomBytes = new Uint8Array(length);
    crypto.getRandomValues(randomBytes);
    return randomBytes;
  }

  function buf2Base64(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
  }
  async function sha256(message) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return buf2Base64(hashBuffer); // Optionally, return the hash as Base64 if needed
  }

  function getParameterByName(name, url = window.location.href) {

    name = name.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[?&]' + name + '=([^&#]*)', 'i');
    const results = regex.exec(url);

    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  }


  // Function to handle Auth0 login
  async function handleAuth0Login() {
    try {
      // Launch the auth flow using chrome.identity
      const redirectUrl = chrome.identity.getRedirectURL()

      const inputBytes = getRandomBytes()
      const verifier = buf2Base64(inputBytes)

      const shaHash = await sha256(verifier)
      const codeChallenge = buf2Base64(shaHash)

      let options = {
        client_id: AUTH0_CLIENT_ID,
        redirect_uri: redirectUrl,
        response_type: "code",
        audience:AUTH0_AUDIENCE,
        scope: "openid",
        code_challenge: codeChallenge,
        code_challenge_method: "S256"
      }

      let resultUrl = await new Promise((resolve, reject) => {
        let queryString = new URLSearchParams(options).toString()
         let url = `https://dev-4urv5z4cg40u4n3k.us.auth0.com/authorize?${queryString}`
        chrome.identity.launchWebAuthFlow(
          {
            url,
            interactive: true
          },
          (callbackUrl) => {
            resolve(callbackUrl)
          }
        )
      })

      if (resultUrl) {
        const code = getParameterByName("code", resultUrl)


        const body = JSON.stringify({
          redirect_uri: redirectUrl,
          grant_type: "authorization_code",
          client_id: AUTH0_CLIENT_ID,
          code_verifier: verifier,
          code: code
        })

        const response = await fetch(
          `https://dev-4urv5z4cg40u4n3k.us.auth0.com/oauth/token`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: body
          }
        )

        if (!response.ok) {
          throw new Error("Network response was not ok")
        }

        const result = await response.json()
        console.log("result", result)

      // Calculate token expiration
      const expiresAt = new Date().getTime() + (result.expires_in * 1000);

      // Update auth state
      authState = {
        isAuthenticated: true,
        accessToken: result.access_token,
        expiresAt
      };

      // Store auth state
      await chrome.storage.local.set({
        accessToken: result.access_token,
        expiresAt
      });

      return { success: true };
    }
  } catch (error) {
    console.error('Auth error:', error);
    return { error: error.message };
  }}

  // Function to handle silent auth (token refresh)
  async function handleSilentAuth() {
    try {
        const redirectUrl = chrome.identity.getRedirectURL()

        const inputBytes = getRandomBytes()
        const verifier = buf2Base64(inputBytes)

        const shaHash = await sha256(verifier)
        const codeChallenge = buf2Base64(shaHash)

        let options = {
            client_id:AUTH0_CLIENT_ID,
            redirect_uri: redirectUrl,
            response_type: "code",
            audience: "https://dev-4urv5z4cg40u4n3k.us.auth0.com/api/v2/",
            scope: "openid",
            code_challenge: codeChallenge,
            code_challenge_method: "S256"
        }

        let resultUrl = await new Promise((resolve, reject) => {
          let queryString = new URLSearchParams(options).toString()
          let url = `https://dev-4urv5z4cg40u4n3k.us.auth0.com/authorize?${queryString}`

          chrome.identity.launchWebAuthFlow(
            {
              url,
              interactive: true
            },
            (callbackUrl) => {
              resolve(callbackUrl)
            }
          )
        })

        if (resultUrl) {
          const code = getParameterByName("code", resultUrl)


          const body = JSON.stringify({
            redirect_uri: redirectUrl,
            grant_type: "authorization_code",
            client_id: AUTH0_CLIENT_ID,
            code_verifier: verifier,
            code: code
          })

          const response = await fetch(
            `https://dev-4urv5z4cg40u4n3k.us.auth0.com/oauth/token`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: body
            }
          )

          if (!response.ok) {
            throw new Error("Network response was not ok")
          }

          const result = await response.json()


         // Calculate token expiration
         const expiresAt = new Date().getTime() + (result.expiresIn * 1000);

         // Update auth state
         authState = {
           isAuthenticated: true,
           accessToken: result.accessToken,
           expiresAt: expiresAt
         };
         chrome.runtime.sendMessage({ type: 'GET_AUTH_STATE' });


         // Store auth state
         await chrome.storage.local.set({
           accessToken: result.accessToken,
           expiresAt: expiresAt
         });


      return { success: true };
    }
  }catch (error) {
    console.error('Silent auth error:', error);
    return { error: error.message };
  }}

  // Function to check if token needs refresh
  async function checkAndRefreshToken() {
    if (authState.expiresAt) {
      const now = new Date().getTime();
      const timeUntilExpiry = authState.expiresAt - now;

      // If token expires in less than 5 minutes, try to refresh it
      if (timeUntilExpiry < 300000) { // 5 minutes in milliseconds
        try {
          const result = await handleSilentAuth();
          if (!result.success) {
            // If silent auth fails, clear auth state
            chrome.runtime.sendMessage({ type: 'AUTH_EXPIRED' });
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          chrome.runtime.sendMessage({ type: 'AUTH_EXPIRED' });
        }
      }
    }
  }

  // Check token status every minute
  setInterval(checkAndRefreshToken, 60000);


  // Listen for messages from other parts of the extension
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.type) {
      case 'GET_AUTH_STATE':
        sendResponse({
          isAuthenticated: authState.isAuthenticated,
          accessToken: authState.accessToken
        });
        break;

        case 'LOGIN':
            handleAuth0Login()
              .then(response => sendResponse(response))
              .catch(error => sendResponse({ error: error.message }));
            return true;

          case 'SILENT_LOGIN':
            handleSilentAuth()
              .then(response => sendResponse(response))
              .catch(error => sendResponse({ error: error.message }));
            return true;

      case 'SET_AUTH_STATE':
        authState = {
          isAuthenticated: true,
          accessToken: request.accessToken,
          expiresAt: request.expiresAt
        };
        // Store auth state in chrome.storage
        chrome.storage.local.set({
          accessToken: request.accessToken,
          expiresAt: request.expiresAt
        });
        sendResponse({ success: true });
        break;

      case 'LOGOUT':
        authState = {
          isAuthenticated: false,
          accessToken: null,
          expiresAt: null
        };
        // Clear stored auth state
        chrome.storage.local.remove(['accessToken', 'expiresAt']);
        sendResponse({ success: true });
        break;

      case 'CREATE_BOOKMARK':
        if (!authState.isAuthenticated) {
          sendResponse({ error: 'Not authenticated' });
          return;
        }
        createBookmark(request.url, authState.accessToken)
          .then(response => sendResponse({ success: true, data: response }))
          .catch(error => sendResponse({ error: error.message }));
        return true; // Will send response asynchronously

      case 'GET_SUGGESTED_TAGS':
        if (!authState.isAuthenticated) {
          sendResponse({ error: 'Not authenticated' });
          return;
        }
        getSuggestedTags(request.url, authState.accessToken)
          .then(response => sendResponse({ success: true, data: response }))
          .catch(error => sendResponse({ error: error.message }));
        return true; // Will send response asynchronously
    }
  });

  // Function to create a bookmark
  async function createBookmark(url, token) {
    try {
      const response = await fetch(`${SERVER_URL}/api/bookmarks/with-tags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url })
      });

      if (!response.ok) {
        throw new Error('Failed to create bookmark');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating bookmark:', error);
      throw error;
    }
  }

  // Listen for installation or update of the extension
  chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
      // Handle first-time installation
      chrome.storage.local.clear(); // Clear any existing data
    }
  });

  // Handle auth token expiration
  function checkTokenExpiration() {
    if (authState.expiresAt) {
      const now = new Date().getTime();
      if (now >= authState.expiresAt) {
        // Token has expired, clear auth state
        authState = {
          isAuthenticated: false,
          accessToken: null,
          expiresAt: null
        };
        chrome.storage.local.remove(['accessToken', 'expiresAt']);

        // Notify any open popup or content scripts
        chrome.runtime.sendMessage({
          type: 'AUTH_EXPIRED'
        });
      }
    }
  }

  // Check token expiration periodically
  setInterval(checkTokenExpiration, 60000); // Check every minute

  // Handle extension update
  chrome.runtime.onUpdateAvailable.addListener((details) => {
    chrome.runtime.reload();
  });

  // Listen for web app auth events (if using chrome.storage for sharing auth state)
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local') {
      if (changes.accessToken) {
        authState.accessToken = changes.accessToken.newValue;
        authState.isAuthenticated = !!changes.accessToken.newValue;
      }
      if (changes.expiresAt) {
        authState.expiresAt = changes.expiresAt.newValue;
      }
    }
  });