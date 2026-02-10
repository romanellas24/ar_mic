(function (window) {
  window.UIControls = {
    init: function () {
      const changeLanguageBtn = document.getElementById("change-len-btn");
      const openBtn = document.getElementById("open_tutorial");
      const closeBtn = document.getElementById("close");
      const unmuteBtn = document.getElementById("unmute-btn");
      const subBtn = document.getElementById("sub-btn");
      const backdrop = document.getElementById("backdrop");
      const fullscreenBtn = document.getElementById("clean-fullscreen-btn");
      const tutorial_dialog = document.getElementById("tutorial_list");
      const tutorial_list = tutorial_dialog.querySelectorAll("li");
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
      let currentLanguage = "ITA"; // the current one, not the one showed on the button :\
      let isClean = false;
      let isAudioEnabled = false;

      if (!isIOS) {
        isAudioEnabled = true;
        unmuteBtn.textContent = "Disattiva Audio";
      }

      // Text for tutorial
      const textIT = [
        "Alza il volume del telefono e acconsenti all'accesso della webcam.",
        "Inquadra gli ideogrammi presenti nelle vetrine e rimani fermo.",
        'Puoi cambiare la lingua tramite il pulsante in alto a sinistra e attivare i sottotitoli tramite il pulsante "CC".',
        "Per una migliore esperienza, accedi al sito tramite il browser Chrome.",
        'Per gli utenti iOS, il video partirà senza audio. Clicca il tasto "attiva audio" per abilitarlo.'
      ];
      const textEN = [
        "Turn up your phone's volume and allow camera access.",
        "Point the camera at the ideograms in the showcases and stay still.",
        'You can change the language using the button at the top left and activate subtitles with the "CC" button',
        "For a better experience, access the website via Chroma browser.", 
        'For iOS users, the video will start without audio. Push the button "activate audio" to ebable it.'
      ];

      function enterFullscreen(element = document.documentElement) {
        if (element.requestFullscreen) element.requestFullscreen();
        else if (element.webkitRequestFullscreen)
          element.webkitRequestFullscreen();
      }

      function exitFullscreen() {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
      }

      function changeContentLanguage() {
        if (isAudioEnabled)
          unmuteBtn.textContent =
            currentLanguage === "ITA" ? "Disattiva Audio" : "Mute Audio";
        else
          unmuteBtn.textContent =
            currentLanguage === "ITA" ? "Attiva Audio" : "Unmute Audio";
      }

      // Change language event
      if (changeLanguageBtn) {
        changeLanguageBtn.addEventListener("click", () => {
          changeLanguageBtn.innerText = currentLanguage;
          currentLanguage = currentLanguage === "ITA" ? "ENG" : "ITA";
          window.dispatchEvent(
            new CustomEvent("languageChanged", {
              detail: { language: currentLanguage },
            }),
          );
          const source = currentLanguage === "ITA" ? textIT : textEN;
          tutorial_list.forEach((li, i) => {
            li.textContent = source[i];
          });
          changeContentLanguage();
        });
      }

      // Fullscreen event
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
            // Switch to close (X) icon
            document.getElementById("fullscreen-icon").innerHTML =
              '<path d="M18 6L6 18M6 6l12 12"/>';
            enterFullscreen();
          } else {
            elementsToHide.forEach(
              (el) => el && el.classList.remove("hidden-ui"),
            );
            // Switch to expand icon
            document.getElementById("fullscreen-icon").innerHTML =
              '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
            exitFullscreen();
          }
        });
      }

      // Tutorial event
      if (openBtn && backdrop)
        openBtn.onclick = () => (backdrop.style.display = "flex");
      if (closeBtn && backdrop)
        closeBtn.onclick = () => (backdrop.style.display = "none");
      if (backdrop)
        backdrop.onclick = (e) => {
          if (e.target === backdrop) backdrop.style.display = "none";
        };

      // Audio lock and unlock
      if (unmuteBtn) {
        unmuteBtn.style.display = "block";
        unmuteBtn.addEventListener("click", () => {
          isAudioEnabled = !isAudioEnabled;
          window.dispatchEvent(
            new CustomEvent("muteBtnPressed", { detail: { isAudioEnabled } }),
          );
          changeContentLanguage();
        });
      }

      // Subtitle event
      if (subBtn) {
        const strike = document.getElementById("sub-btn-strike");
        subBtn.addEventListener("click", () => {
          const areSubtitlesEnabled = !subBtn.classList.toggle("off");
          if (strike) strike.classList.toggle("visible", areSubtitlesEnabled);
          window.dispatchEvent(
            new CustomEvent("subtitleToggle", { detail: areSubtitlesEnabled }),
          );
        });
      }
    },
  };
})(window);