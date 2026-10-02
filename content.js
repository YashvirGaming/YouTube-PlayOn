(function () {
  'use strict';

  let lastDismissedTime = 0;
  const COOLDOWN_MS = 5000; // Cooldown to prevent spamming the same dialog

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
    return !!el && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0);
  }

  function findClickTarget(dialog) {
    const confirmHost = dialog.querySelector('#confirm-button, #submit-button');
    if (confirmHost) {
      const innerBtn = confirmHost.querySelector('button');
      if (isVisible(innerBtn)) return innerBtn;
      if (isVisible(confirmHost)) return confirmHost;
    }
    
    const ariaYes = dialog.querySelector('button[aria-label="Yes"], paper-button#button');
    if (isVisible(ariaYes)) return ariaYes;

    const buttons = dialog.querySelectorAll('button');
    for (const btn of buttons) {
      const text = (btn.textContent || '').trim().toLowerCase();
      if (text.includes('yes') || text.includes('continue') || text.includes('play')) {
        if (isVisible(btn)) return btn;
      }
    }

    return null;
  }

  function simulateClick(element) {
    if (!element) return;
    const events = ['pointerdown', 'mousedown', 'pointerup', 'mouseup', 'click'];
    events.forEach((eventType) => {
      const event = new MouseEvent(eventType, {
        view: window,
        bubbles: true,
        cancelable: true,
        buttons: 1,
        clientX: element.getBoundingClientRect().x || 10,
        clientY: element.getBoundingClientRect().y || 10
      });
      element.dispatchEvent(event);
    });
  }

  function checkAndDismiss() {
    isEnabled((enabled) => {
      if (!enabled) return;

      const now = Date.now();
      if (now - lastDismissedTime < COOLDOWN_MS) return;

      const dialogs = document.querySelectorAll('yt-confirm-dialog-renderer, tp-yt-paper-dialog, ytd-popup-container');

      dialogs.forEach((dialog) => {
        if (!isVisible(dialog)) return;

        const text = dialog.textContent || '';
        if (!text.includes('Continue watching')) return;

        const target = findClickTarget(dialog);
        if (target) {
          lastDismissedTime = Date.now();
          simulateClick(target);
          console.log('[YouTube PlayOn] Successfully bypassed and dismissed idle prompt. By Yashvir Gaming.');
          incrementDismissCount();
        }
      });
    });
  }

  // Optimized target observer to prevent high CPU usage on whole-page mutations
  const targetNode = document.body || document.documentElement;
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        shouldCheck = true;
        break;
      }
    }
    if (shouldCheck) {
      checkAndDismiss();
    }
  });

  observer.observe(targetNode, { childList: true, subtree: false });

  // Fallback ticker loop
  setInterval(checkAndDismiss, 2000);
  checkAndDismiss();
})();