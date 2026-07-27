// Array of possible selectors YouTube might use for the 'Yes / Continue' button
const selectors = [
  'yt-confirm-dialog-renderer #confirm-button', // Classic modal
  'tp-yt-paper-dialog #confirm-button',         // Legacy material modal
  'yt-button-renderer[dialog-action="confirm"]',// Generic dialog confirm
  '.yt-core-button--primary[aria-label="Yes"]'  // Newer core button UI
];

function autoClickContinue() {
  for (let selector of selectors) {
    const confirmButton = document.querySelector(selector);
    // Check if the button exists and is currently visible on the screen
    if (confirmButton && confirmButton.offsetParent !== null) {
      confirmButton.click();
      console.log('[NeverPause] Automatically clicked "Continue watching".');
      return; // Exit loop after clicking
    }
  }
}

// Watch the DOM for changes to catch the popup instantly
const observer = new MutationObserver(autoClickContinue);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Fallback safety check every 3 seconds
setInterval(autoClickContinue, 3000);
