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

  function isVisible(el) {
    return !!el && el.offsetParent !== null;
  }

  function findClickTarget(dialog) {
    const confirmHost = dialog.querySelector('#confirm-button');
    if (confirmHost) {
      const innerBtn = confirmHost.querySelector('button');
      if (isVisible(innerBtn)) return innerBtn;
      if (isVisible(confirmHost)) return confirmHost;
    }
    const ariaYes = dialog.querySelector('button[aria-label="Yes"]');
    if (isVisible(ariaYes)) return ariaYes;
    return null;
  }

  function checkAndDismiss() {
    isEnabled((enabled) => {
      if (!enabled) return;

      const dialogs = document.querySelectorAll('yt-confirm-dialog-renderer, tp-yt-paper-dialog');

      dialogs.forEach((dialog) => {
        if (!isVisible(dialog)) return;

        const text = dialog.textContent || '';
        if (!text.includes('Continue watching')) return;

        const target = findClickTarget(dialog);
        if (target) {
          target.click();
          console.log('[YouTube PlayOn] Prompt dismissed. By Yashvir Gaming.');
          incrementDismissCount();
        }
      });
    });
  }

  // DOM MutationObserver for instant detection
  const observer = new MutationObserver(() => {
    checkAndDismiss();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  checkAndDismiss();
  setInterval(checkAndDismiss, 1500);
})();