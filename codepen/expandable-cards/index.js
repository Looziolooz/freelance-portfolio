/* Expandable cards — vanilla port of the Aceternity "Expandable Card" (list
   variant). Clicking a row opens a centered modal that GROWS out of that exact
   row (a FLIP-style shared-layout move: measure the row, place the modal there,
   then animate it to its resting centered size). Close via the X button, the
   Escape key, or an outside-click on the dimmed backdrop.

   The gallery iframe is non-interactive, so an AUTO-OPEN loop opens one card,
   holds it, closes it, and moves to the next — the teaser shows the effect on
   its own. Any real user interaction cancels the loop for good. */
(function () {
  var stage = document.querySelector('.stage');
  if (!stage) return;

  var cards = Array.prototype.slice.call(document.querySelectorAll('.card'));
  var backdrop = document.querySelector('.backdrop');
  var modalLayer = document.querySelector('.modal-layer');
  var modal = document.querySelector('.modal');
  var modalImg = document.querySelector('.modal-img');
  var modalTitle = document.querySelector('.modal-title');
  var modalSubtitle = document.querySelector('.modal-subtitle');
  var modalCta = document.querySelector('.modal-cta');
  var modalDesc = document.querySelector('.modal-desc');
  var closeBtn = document.querySelector('.modal-close');
  if (!modal) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var activeCard = null;     // the row currently expanded
  var isOpen = false;
  var animating = false;

  // ---------- Open: FLIP grow from the clicked row ----------
  function open(card) {
    if (isOpen || animating) return;
    activeCard = card;

    // Fill the modal from the row's data-* fields.
    modalImg.src = card.getAttribute('data-img') || '';
    modalImg.alt = card.getAttribute('data-title') || '';
    modalTitle.textContent = card.getAttribute('data-title') || '';
    modalSubtitle.textContent = card.getAttribute('data-subtitle') || '';
    modalCta.textContent = card.getAttribute('data-cta') || 'Scopri';
    modalDesc.textContent = card.getAttribute('data-desc') || '';

    var row = card.querySelector('.card-row') || card;
    var from = row.getBoundingClientRect();

    // Reveal the modal layer + backdrop, hide the source row, then measure the
    // modal's resting box so we can map FROM the row TO that box.
    backdrop.classList.add('is-open');
    modalLayer.setAttribute('aria-hidden', 'false');
    card.classList.add('is-active');

    // Reset any prior transform so getBoundingClientRect is the true rest box.
    modal.style.transition = 'none';
    modal.style.transform = 'none';
    modal.style.opacity = '1';
    var to = modal.getBoundingClientRect();

    // Map the modal onto the row (FLIP: invert).
    var sx = from.width / to.width;
    var sy = from.height / to.height;
    var dx = (from.left + from.width / 2) - (to.left + to.width / 2);
    var dy = (from.top + from.height / 2) - (to.top + to.height / 2);

    modal.style.transformOrigin = 'center center';
    modal.style.opacity = '0';
    modal.style.transform =
      'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';

    isOpen = true;
    document.addEventListener('keydown', onKeydown);

    if (reduce) {
      modal.style.transform = 'none';
      modal.style.opacity = '1';
      return;
    }

    animating = true;
    // Next frame: release to the resting box (play).
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        modal.style.transition =
          'transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.24s ease';
        modal.style.transform = 'translate(0,0) scale(1,1)';
        modal.style.opacity = '1';
        window.setTimeout(function () { animating = false; }, 440);
      });
    });
  }

  // ---------- Close: shrink back toward the source row ----------
  function close() {
    if (!isOpen || animating) return;
    var card = activeCard;

    function finish() {
      backdrop.classList.remove('is-open');
      modalLayer.setAttribute('aria-hidden', 'true');
      if (card) card.classList.remove('is-active');
      modal.style.transition = 'none';
      modal.style.transform = 'none';
      modal.style.opacity = '0';
      isOpen = false;
      activeCard = null;
      document.removeEventListener('keydown', onKeydown);
    }

    if (reduce || !card) { finish(); return; }

    var row = card.querySelector('.card-row') || card;
    var to = row.getBoundingClientRect();
    var from = modal.getBoundingClientRect();
    var sx = to.width / from.width;
    var sy = to.height / from.height;
    var dx = (to.left + to.width / 2) - (from.left + from.width / 2);
    var dy = (to.top + to.height / 2) - (from.top + from.height / 2);

    animating = true;
    modal.style.transition =
      'transform 0.34s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease';
    modal.style.transform =
      'translate(' + dx + 'px,' + dy + 'px) scale(' + sx + ',' + sy + ')';
    modal.style.opacity = '0';
    window.setTimeout(function () { animating = false; finish(); }, 340);
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) { stopAuto(); close(); }
  }

  // ---------- Wiring ----------
  cards.forEach(function (card) {
    card.addEventListener('click', function () { stopAuto(); open(card); });
  });
  closeBtn.addEventListener('click', function () { stopAuto(); close(); });
  // Outside-click: clicking the dimmed backdrop closes (the modal itself is on
  // a higher layer and stops the event from reaching here).
  backdrop.addEventListener('click', function () { stopAuto(); close(); });
  modalLayer.addEventListener('click', function (e) {
    if (e.target === modalLayer) { stopAuto(); close(); }
  });

  // ---------- Auto-open teaser loop (for the non-interactive gallery) ----------
  var autoStopped = false;
  var timers = [];

  function clearTimers() {
    timers.forEach(function (t) { clearTimeout(t); });
    timers = [];
  }

  function stopAuto() {
    autoStopped = true;
    clearTimers();
  }

  function autoStep(i) {
    if (autoStopped) return;
    var idx = i % cards.length;
    open(cards[idx]);
    timers.push(window.setTimeout(function () {
      if (autoStopped) return;
      close();
      timers.push(window.setTimeout(function () {
        autoStep(i + 1);
      }, 1100)); // gap before the next card opens
    }, 2400));   // how long each card stays open
  }

  // A real pointer entering the stage hands control to the user.
  stage.addEventListener('mouseenter', stopAuto, { once: true });
  stage.addEventListener('touchstart', stopAuto, { once: true, passive: true });

  if (!reduce) {
    timers.push(window.setTimeout(function () { autoStep(0); }, 1200));
  }
})();
