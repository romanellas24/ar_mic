/* Main initializer served from public/js: initializes modules */
document.addEventListener("DOMContentLoaded", function () {
  if (window.MarkerVideoController && typeof window.MarkerVideoController.init === "function") {
    window.MarkerVideoController.init();
  }

  if (window.UIControls && typeof window.UIControls.init === "function") {
    window.UIControls.init();
  }
});