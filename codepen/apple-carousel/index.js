/* Apple Cards Carousel — vanilla port of the Aceternity component.
   - Round arrows scroll the row by one card width.
   - Clicking a card opens a centered modal (blurred backdrop, category + title +
     rich Italian copy); Escape, the close button, the backdrop and an outside
     click all close it.
   - Since the gallery thumbnail is non-interactive, the row drifts slowly on a
     loop so the component visibly moves; the drift pauses on hover / pointer /
     when the modal is open, and resumes after a short idle. */
(function () {
  var viewport = document.querySelector('.ac-viewport');
  var track = document.getElementById('acTrack');
  var prev = document.getElementById('acPrev');
  var next = document.getElementById('acNext');
  var cards = Array.prototype.slice.call(document.querySelectorAll('.ac-card'));
  if (!viewport || !track || !cards.length) return;

  var modal = document.getElementById('acModal');
  var modalCard = document.getElementById('acModalCard');
  var modalCat = document.getElementById('acModalCat');
  var modalTitle = document.getElementById('acModalTitle');
  var modalBody = document.getElementById('acModalBody');
  var btnClose = document.getElementById('acClose');
  var backdrop = document.getElementById('acBackdrop');

  // Modal content, one short Italian paragraph per service.
  var CONTENT = [
    {
      cat: 'Siti & E-commerce',
      title: 'Siti che vendono, non solo belli.',
      body: 'Un sito curato fa una bella impressione, ma è la vendita che paga le bollette. Partiamo da come si muove chi ti visita: dove clicca, dove si ferma, dove abbandona il carrello. Poi costruiamo pagine veloci, chiare e fatte per portare la persona dal "sto guardando" al "ho comprato", senza passaggi inutili.'
    },
    {
      cat: 'Visibilità',
      title: 'Farti trovare quando ti cercano.',
      body: 'Le persone ti cercano già, su Google e sulle mappe, nel momento in cui hanno bisogno di te. Il punto è esserci quando succede. Lavoriamo su quello che cercano davvero i tuoi clienti, sistemiamo la scheda Google, i testi e le recensioni, così quando digitano il tuo servizio nella tua zona sei tu a comparire, non il concorrente.'
    },
    {
      cat: 'Automazioni',
      title: 'Il lavoro ripetitivo, fatto da solo.',
      body: 'Preventivi copiati a mano, mail uguali ripetute dieci volte, dati spostati da un foglio all\'altro: ore che spariscono ogni settimana. Colleghiamo gli strumenti che usi già e lasciamo che il lavoro ripetitivo si faccia da solo, in silenzio e senza errori. Tu ti tieni le decisioni, la macchina si prende le scocciature.'
    },
    {
      cat: 'AI',
      title: 'Un assistente che risponde ai clienti.',
      body: 'Un assistente addestrato sulla tua attività risponde alle domande di sempre a qualsiasi ora: prezzi, orari, disponibilità, come prenotare. I clienti hanno una risposta subito, anche quando tu hai chiuso, e a te arrivano solo le richieste che valgono davvero il tuo tempo. Niente abbonamenti costosi: lo costruiamo per costare quanto meno possibile.'
    },
    {
      cat: 'Social',
      title: 'Contenuti che fanno parlare di te.',
      body: 'Non servono mille post: serve qualche contenuto giusto, con una voce che è la tua e non quella di tutti. Definiamo poche idee solide, un ritmo che riesci a mantenere e un modo di raccontare il tuo lavoro che resta in testa. Meno rincorsa all\'algoritmo, più persone che si ricordano di te quando devono scegliere.'
    }
  ];

  /* ---------- Arrows ---------- */
  function cardStep() {
    var first = cards[0];
    var styles = window.getComputedStyle(track);
    var gap = parseFloat(styles.columnGap || styles.gap || '18') || 18;
    return first.getBoundingClientRect().width + gap;
  }

  function syncArrows() {
    var max = viewport.scrollWidth - viewport.clientWidth - 2;
    prev.disabled = viewport.scrollLeft <= 2;
    next.disabled = viewport.scrollLeft >= max;
  }

  prev.addEventListener('click', function () {
    pauseDrift();
    viewport.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  });
  next.addEventListener('click', function () {
    pauseDrift();
    viewport.scrollBy({ left: cardStep(), behavior: 'smooth' });
  });
  viewport.addEventListener('scroll', syncArrows, { passive: true });
  window.addEventListener('resize', syncArrows);

  /* ---------- Modal ---------- */
  var lastFocused = null;

  function openModal(i) {
    var c = CONTENT[i];
    if (!c) return;
    pauseDrift(true);
    lastFocused = document.activeElement;
    modalCat.textContent = c.cat;
    modalTitle.textContent = c.title;
    modalBody.innerHTML = '<p>' + c.body + '</p>';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (btnClose && typeof btnClose.focus === 'function') btnClose.focus();
  }

  function closeModal() {
    if (!modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    resumeDriftSoon();
  }

  cards.forEach(function (card, i) {
    card.addEventListener('click', function () { openModal(i); });
  });

  btnClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);
  // outside-click: anything in the overlay that isn't the modal card closes it
  modal.addEventListener('click', function (e) {
    if (!modalCard.contains(e.target)) closeModal();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) closeModal();
  });

  /* ---------- Auto-scroll drift (gallery motion) ---------- */
  // The drift is time-based (px per second) rather than per-frame, so the row
  // glides at a steady pace regardless of frame rate. It pauses on hover / wheel
  // / pointer / when the modal is open, and resumes after a short idle.
  var drift = true;
  var idleTimer = null;
  var dir = 1;
  var SPEED = 26;        // px per second
  var acc = 0;           // sub-pixel accumulator so slow speeds still advance
  var lastT = 0;

  function pauseDrift() {
    drift = false;
    if (idleTimer) { clearTimeout(idleTimer); idleTimer = null; }
  }
  function resumeDriftSoon() {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { drift = true; }, 2600);
  }

  viewport.addEventListener('pointerdown', function () { pauseDrift(); resumeDriftSoon(); });
  viewport.addEventListener('wheel', function () { pauseDrift(); resumeDriftSoon(); }, { passive: true });
  viewport.addEventListener('mouseenter', pauseDrift);
  viewport.addEventListener('mouseleave', resumeDriftSoon);

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function advance(dt) {
    if (!drift || reduce) return;
    var max = viewport.scrollWidth - viewport.clientWidth;
    if (max <= 4) return;
    acc += (SPEED * dt) / 1000 * dir;
    var step = acc | 0; // integer part
    if (step !== 0) {
      acc -= step;
      viewport.scrollLeft += step;
      if (viewport.scrollLeft >= max - 1) { dir = -1; acc = 0; }
      else if (viewport.scrollLeft <= 1) { dir = 1; acc = 0; }
    }
  }

  function tick(now) {
    if (!lastT) lastT = now;
    var dt = now - lastT;
    lastT = now;
    if (dt > 0 && dt < 200) advance(dt); // ignore long gaps (tab was hidden)
    else lastT = now;
    requestAnimationFrame(tick);
  }

  // RAF drives the drift; a low-frequency interval keeps it alive if RAF is
  // throttled (e.g. the preview iframe loses focus), so the row always moves.
  var lastInterval = Date.now();
  setInterval(function () {
    var now = Date.now();
    var dt = now - lastInterval;
    lastInterval = now;
    if (document.hidden) return;
    if (dt > 0 && dt < 1000) advance(dt);
  }, 120);

  syncArrows();
  requestAnimationFrame(tick);
})();
