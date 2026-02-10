document.addEventListener("DOMContentLoaded", function () {
  const isIOS =
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  // IOS stuff (mp4 + chroma)
  if (isIOS) {
    // Add muted attribute to all videos on iOS
    const allVideos = document.querySelectorAll("video");
    allVideos.forEach((video) => {
      video.muted = true;
      video.setAttribute("muted", "");
    });

    // Swap all WebM videos to MP4 versions with chroma key
    const videos = document.querySelectorAll(
      'video[id$="-video-ita"], video[id$="-video-eng"]',
    );

    videos.forEach((video) => {
      const currentSrc = video.getAttribute("src");
      if (currentSrc && currentSrc.includes(".webm")) {
        const mp4Src = currentSrc.replace(".webm", ".mp4");
        video.setAttribute("src", mp4Src);
      }
    });

    // Update all planes to use chromakey material
    const planes = document.querySelectorAll("a-plane");
    planes.forEach((plane) => {
      const currentMaterial = plane.getAttribute("material") || "";
      plane.setAttribute(
        "material",
        `${currentMaterial}; 
        shader: chromakey; 
        color: 0.133 1 0.027; 
        tolerance: 0.40; 
        smoothness: 0.40;`,
      );
    });
  }

  if (window.MarkerVideoController) {
    window.MarkerVideoController.init();
  }

  if (window.UIControls) {
    window.UIControls.init();
  }

  // Hide loading spinner when scene is ready
  const scene = document.querySelector("a-scene");
  const overlay = document.getElementById("loading-overlay");
  if (scene && overlay) {
    const hide = () => {
      overlay.classList.add("fade-out");
      overlay.addEventListener("transitionend", () => overlay.remove());
    };
    if (scene.hasLoaded) {
      hide();
    } else {
      scene.addEventListener("loaded", hide);
    }
  }
});