document.addEventListener('DOMContentLoaded', function() {
  const createBookmarkBtn = document.getElementById('createBookmark');
  const loginBtn = document.getElementById('login');
  const logoutBtn = document.getElementById('logout');

  // Check auth state when popup opens
  chrome.runtime.sendMessage({ type: 'GET_AUTH_STATE' }, function(response) {
    console.log(response.isAuthenticated,"auth")
    updateUI(response.isAuthenticated);
  });

  createBookmarkBtn.addEventListener('click', function() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const currentUrl = tabs[0].url;
      console.log(currentUrl)

      chrome.runtime.sendMessage(
        {
          type: 'CREATE_BOOKMARK',
          url: currentUrl
        },
        function(response) {
          if (response.error) {
            showError(response.error);
          } else {
            console.log('Bookmark added')
            showSuccess('Bookmark created successfully!');
          }
        }
      );
    });
  });

  loginBtn.addEventListener('click', function() {
    // Redirect to Auth0 login
    chrome.runtime.sendMessage({ type: 'LOGIN' },function(response) {
      if (response.success) {
        updateUI(true);
      }
    });
  });

  logoutBtn.addEventListener('click', function() {
    chrome.runtime.sendMessage({ type: 'LOGOUT' }, function(response) {
      if (response.success) {
        updateUI(false);
      }
    });
  });

  function updateUI(isAuthenticated) {
    if (isAuthenticated) {
      createBookmarkBtn.style.display = 'block';
      loginBtn.style.display = 'none';
      logoutBtn.style.display = 'block';
    } else {
      createBookmarkBtn.style.display = 'none';
      loginBtn.style.display = 'block';
      logoutBtn.style.display = 'none';
    }
  }

  function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => {
      errorDiv.style.display = 'none';
    }, 3000);
  }

  function showSuccess(message) {
    const successDiv = document.getElementById('success');
    successDiv.textContent = message;
    successDiv.style.display = 'block';
    setTimeout(() => {
      successDiv.style.display = 'none';
    }, 3000);
  }
});