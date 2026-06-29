/* Clickable video player. The clip autoplays muted + looped so it moves inside
   the non-interactive gallery card; the first click turns the sound on, and
   every click after that toggles play / pause. */
(function () {
  var card = document.getElementById('vs-card');
  var video = document.getElementById('vs-video');
  var soundLabel = document.getElementById('vs-sound-label');
  var cap = document.getElementById('vs-cap');
  if (!card || !video) return;

  function syncState() {
    if (video.paused) {
      card.classList.add('is-paused');
    } else {
      card.classList.remove('is-paused');
    }
    if (video.muted) {
      cap.textContent = 'Clicca il video per avviarlo e attivare l’audio';
    } else if (video.paused) {
      cap.textContent = 'Clicca per riprendere';
    } else {
      cap.textContent = 'Clicca per mettere in pausa';
    }
  }

  function safePlay() {
    var p = video.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  card.addEventListener('click', function () {
    // First interaction: unmute (autoplay was forced muted) and keep playing.
    if (video.muted) {
      video.muted = false;
      card.classList.remove('is-muted');
      if (soundLabel) soundLabel.textContent = 'Audio attivo';
      if (video.paused) safePlay();
      syncState();
      return;
    }
    // After that: toggle play / pause.
    if (video.paused) {
      safePlay();
    } else {
      video.pause();
    }
    syncState();
  });

  video.addEventListener('play', syncState);
  video.addEventListener('pause', syncState);
  video.addEventListener('playing', syncState);

  // Kick off the muted autoplay (some browsers need an explicit call) and paint
  // the initial state.
  safePlay();
  syncState();
})();
