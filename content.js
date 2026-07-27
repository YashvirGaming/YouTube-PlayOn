(function () {
  'use strict';

  function isEnabled(callback) {
    chrome.storage.local.get({ enabled: true }, (result) => {
      callback(result.enabled);
    });
  }

  function incrementDismissCount() {
    chrome.storage.local.get({ dismissCount: 0 }, (result) => {
      const updated = result.dismissCount + 1;
      chrome.storage.local.set({ dismissCount: updated });
    });
  }

  function checkAndDismiss() {
    isEnabled((enabled) => {
      if (!enabled) return;

      const confirmButtons = document.querySelectorAll(
        'yt-confirm-dialog-renderer #confirm-button, #confirm-button.yt-confirm-dialog-renderer'
      );

      confirmButtons.forEach((btn) => {
        if (btn && btn.offsetParent !== null) {
          btn.click();
          console.log('[YouTube PlayOn] By Yashvir Gaming.');
          incrementDismissCount();
        }
      });
    });
  }

  // DOM MutationObserver for instant detection
  const observer = new MutationObserver(() => {
    checkAndDismiss();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  setInterval(checkAndDismiss, 2000);
})();