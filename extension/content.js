// content.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getPageUrl") {
      sendResponse({ url: window.location.href });
    }
  });
