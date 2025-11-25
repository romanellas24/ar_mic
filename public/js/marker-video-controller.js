/* Marker / Video controller (served from public/js)
   - Pauses all videos on scene load
   - Plays the video associated to a marker when markerFound
   - Pauses the video when markerLost
*/
(function (window) {
  window.MarkerVideoController = {
    init: function () {
      const scene = document.querySelector("a-scene");
      const videos = document.querySelectorAll("video");
      const markers = document.querySelectorAll("a-marker");

      if (!scene) return;

      scene.addEventListener("loaded", () => {
        videos.forEach((v) => v.pause());
      });

      markers.forEach((marker) => {
        const plane = marker.querySelector("a-plane");
        if (!plane) return;

        const src = plane.getAttribute("src");
        const video = document.querySelector(src);

        marker.addEventListener("markerFound", () => {
          videos.forEach((v) => v.pause());
          if (video && video.paused) video.play();
          console.log("marker found, playing: ", video);
        });

        marker.addEventListener("markerLost", () => {
          if (video && !video.paused) video.pause();
        });
      });
    },
  };
})(window);
