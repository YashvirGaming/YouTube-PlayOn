const selectors = [
  'yt-confirm-dialog-renderer #confirm-button',
  'tp-yt-paper-dialog #confirm-button',
  'yt-button-renderer[dialog-action="confirm"]',
  '.yt-core-button--primary[aria-label="Yes"]'
];

function autoClickContinue() {
  for (let selector of selectors) {
    const confirmButton = document.querySelector(selector);
    if (confirmButton && confirmButton.offsetParent !== null) {
      confirmButton.click();
      console.log('[YouTube PlayOn] Automatically clicked "Continue watching".');
      return;
    }
  }
}

const observer = new MutationObserver(autoClickContinue);
observer.observe(document.body, {
  childList: true,
  subtree: true
});

setInterval(autoClickContinue, 3000);
