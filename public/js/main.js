/* Main initializer served from public/js: initializes modules */
document.addEventListener("DOMContentLoaded", function () {
  // Swap WebM sources with MP4 on iOS where WebM alpha is unsupported
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent);

  if (isIOS) {
    const warning = document.createElement("div");
    warning.textContent =
      "Esperienza iOS non ancora supportata: ci stiamo lavorando.";
    warning.setAttribute(
      "style",
      [
        "position:fixed",
        "inset:0",
        "background:rgba(0,0,0,0.75)",
        "color:#fff",
        "display:flex",
        "align-items:center",
        "justify-content:center",
        "font-family:sans-serif",
        "font-size:18px",
        "text-align:center",
        "padding:24px",
        "z-index:999999",
      ].join(";")
    );
    document.body.appendChild(warning);
  }

  if (window.MarkerVideoController) window.MarkerVideoController.init();

  if (window.UIControls) window.UIControls.init();
});
