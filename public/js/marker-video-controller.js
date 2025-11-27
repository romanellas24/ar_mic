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
      let currentLanguage = "ITA";

      if (!scene) return;

      scene.addEventListener("loaded", () => {
        videos.forEach((v) => v.pause());
      });

      document
        .getElementById("change-len-btn")
        .addEventListener("click", () => {
          currentLanguage = currentLanguage === "ITA" ? "ENG" : "ITA";
          document.getElementById("change-len-btn").innerText = currentLanguage;
        });

      markers.forEach((marker) => {
        const plane = marker.querySelector("a-plane");
        const videoID = plane.getAttribute("src");
        const video = document.querySelector(videoID);
        const audioITA = document.getElementById(
          video.id.replace("-video", "_audio_ita")
        );
        const audioENG = document.getElementById(
          video.id.replace("-video", "_audio_eng")
        );
        let activeAudio = audioITA;

        marker.addEventListener("markerFound", () => {
          videos.forEach((v) => v.pause());
          document.querySelectorAll("audio").forEach((a) => a.pause());
          activeAudio = currentLanguage == "ITA" ? audioITA : audioENG;
          activeAudio.currentTime = video.currentTime;
          if (video && video.paused) {
            video.play();
            activeAudio.play();
          }

        });

        marker.addEventListener("markerLost", () => {
          if (video && !video.paused) {
            video.pause();
            activeAudio.pause();
          }
        });
      });
    },
  };
})(window);
