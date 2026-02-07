(function (window) {
  window.SubtitleController = {
    init: function () {

      let subtitlesDatabase = {};
      fetch("../media/subtitles/subtitles_db.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Impossibile caricare i sottotitoli: " + response.statusText,
            );
          }
          return response.json();
        })
        .then((data) => {
          subtitlesDatabase = data;
          console.log(
            "Sottotitoli caricati con successo:",
            Object.keys(data).length,
            "video trovati.",
          );
        })
        .catch((err) => {
          console.error("Errore caricamento sottotitoli:", err);
        });

      const subBtn = document.getElementById("sub-btn");
      const overlay = document.getElementById("subtitle-overlay");
      let areSubtitlesEnabled = true; // Attivi di default per testare

      if (subBtn) {
        subBtn.addEventListener("click", () => {
          areSubtitlesEnabled = !areSubtitlesEnabled;
          subBtn.classList.toggle("active", areSubtitlesEnabled);
          console.log("areSubtitlesEnabled", areSubtitlesEnabled)
          if (!areSubtitlesEnabled) overlay.innerText = "";
        });
      }

      // --- IL MOTORE DI SINCRONIZZAZIONE ---
      setInterval(() => {
        if (!areSubtitlesEnabled) {
          overlay.style.display = "none";
          return;
        }

        // 1. Trova quale video sta suonando
        const allVideos = document.querySelectorAll("video");
        let activeVideo = null;

        for (let video of allVideos) {
          if (!video.paused && !video.ended && video.currentTime > 0 && video.getAttribute("id")!="arjs-video") {
            activeVideo = video;
            break;
          }
        }

        // 2. Se nessun video suona, nascondi i sottotitoli
        if (!activeVideo) {
          overlay.innerText = "";
          overlay.style.display = "none";
          return;
        }

        // 3. Recupera i sottotitoli per questo video specifico
        const videoID = activeVideo.getAttribute("id");
        console.log(videoID)
        const tracks = subtitlesDatabase[videoID];

        if (!tracks) {
          // Nessun sottotitolo trovato per questo video
          overlay.innerText = "";
          return;
        }

        // 4. Trova la frase giusta per il tempo corrente
        const currentTime = activeVideo.currentTime;
        const currentSubtitle = tracks.find(
          (sub) => currentTime >= sub.start && currentTime <= sub.end,
        );
        console.log(currentSubtitle);

        // 5. Aggiorna l'Overlay
        if (currentSubtitle) {
          console.log(currentSubtitle.text);
          overlay.innerText = currentSubtitle.text;
          overlay.style.display = "block";
          overlay.classList.add("visible"); // Usa la classe CSS che hai creato
        } else {
          overlay.innerText = "";
          overlay.style.display = "none"; // Nascondi il box nero se non c'è testo
        }
      }, 100); // Check ogni 100ms (10 volte al secondo), molto leggero per la CPU
    },
  };
})(window);
