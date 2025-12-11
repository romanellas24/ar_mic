/* Main initializer served from public/js: initializes modules */
document.addEventListener("DOMContentLoaded", function () {
  // Swap WebM sources with MP4 on iOS where WebM alpha is unsupported
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    document
      .querySelectorAll('video[id$="-video-ita"], video[id$="-video-eng"]')
      .forEach((video) => {
        const src = video.getAttribute("src") || "";
        if (src.toLowerCase().endsWith(".webm")) {
          const mp4Src = src.replace(/\.webm($|\?)/i, ".mp4$1");
          video.setAttribute("src", mp4Src);
        }
      });
    const chromaKeyMaterial = "shader: chromakey; color: 0 0 0";
    document.querySelectorAll("a-plane").forEach((plane) => {
      plane.setAttribute("material", chromaKeyMaterial);
    });
  }

  if (window.MarkerVideoController)
    window.MarkerVideoController.init();

  if (window.UIControls) 
    window.UIControls.init();
});
