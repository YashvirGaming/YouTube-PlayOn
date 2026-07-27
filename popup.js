document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const statusIndicator = document.getElementById("statusIndicator");
  const statusText = document.getElementById("statusText");
  const statsCounter = document.getElementById("statsCounter");
  const resetBtn = document.getElementById("resetBtn");

  // Load saved extension settings and stats
  chrome.storage.local.get({ enabled: true, dismissCount: 0 }, (data) => {
    toggleSwitch.checked = data.enabled;
    statsCounter.textContent = data.dismissCount;
    updateUI(data.enabled);
  });

  // Handle toggle switch change
  toggleSwitch.addEventListener("change", () => {
    const isEnabled = toggleSwitch.checked;
    chrome.storage.local.set({ enabled: isEnabled });
    updateUI(isEnabled);
  });

  // Handle Reset Stats button
  resetBtn.addEventListener("click", () => {
    chrome.storage.local.set({ dismissCount: 0 }, () => {
      statsCounter.textContent = "0";
    });
  });

  // Listen for real-time counter updates from content script
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === "local" && changes.dismissCount) {
      statsCounter.textContent = changes.dismissCount.newValue;
    }
  });

  function updateUI(isEnabled) {
    if (isEnabled) {
      statusIndicator.className = "status-indicator active";
      statusText.textContent = "Active";
    } else {
      statusIndicator.className = "status-indicator disabled";
      statusText.textContent = "Disabled";
    }
  }
});