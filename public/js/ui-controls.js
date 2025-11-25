/* UI controls served from public/js */
(function (window) {
  window.UIControls = {
    init: function () {
      const changeLanguageBtn = document.getElementById("change-len-btn");
      let language = "ITA";

      if (changeLanguageBtn) {
        changeLanguageBtn.addEventListener("click", () => {
          if (language == "ENG") {
            changeLanguageBtn.innerHTML = "ENG";
            language = "ITA";
          } else {
            changeLanguageBtn.innerHTML = "ITA";
            language = "ENG";
          }
        });
      }

      function enterFullscreen(element = document.documentElement) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        }
      }

      function exitFullscreen() {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }

      const fullscreenBtn = document.getElementById("clean-fullscreen-btn");
      let isClean = false;

      if (fullscreenBtn) {
        fullscreenBtn.addEventListener("click", () => {
          isClean = !isClean;

          const elementsToHide = [
            document.getElementById("controls"),
            document.getElementById("loading"),
            changeLanguageBtn,
          ];

          if (isClean) {
            elementsToHide.forEach((el) => el && el.classList.add("hidden-ui"));
            fullscreenBtn.textContent = "✕"; // exit icon
            enterFullscreen();
          } else {
            elementsToHide.forEach((el) => el && el.classList.remove("hidden-ui"));
            fullscreenBtn.textContent = "⛶"; // enter fullscreen icon
            enterFullscreen();
          }
        });
      }

      const openBtn = document.getElementById("open_tutorial");
      const closeBtn = document.getElementById("close");
      const backdrop = document.getElementById("backdrop");

      if (openBtn && backdrop) openBtn.onclick = () => (backdrop.style.display = "flex");
      if (closeBtn && backdrop) closeBtn.onclick = () => (backdrop.style.display = "none");

      if (backdrop)
        backdrop.onclick = (e) => {
          if (e.target === backdrop) backdrop.style.display = "none";
        };
    },
  };
})(window);
