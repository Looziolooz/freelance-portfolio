/* Vesper interactions, all vanilla so they run inside the sandboxed iframe.
   1. Word pull-up: split each .pull heading into per-word spans (preserving the
      per-segment styling) and stagger them in when the heading scrolls into view.
   2. Fade-up: hero side elements ease in on load.
   3. Card entrance: .card-anim elements stagger via a CSS transition-delay once
      they intersect.
   4. Scroll-linked reveal: every character of .reveal-text fades 0.2 -> 1 based on
      the heading's position within the iframe scroll, a progressive read-along. */
(function () {
  /* ---------- 1. Word pull-up ---------- */
  function splitPull(heading) {
    var stagger = parseFloat(heading.getAttribute('data-stagger') || '0.08');
    var words = [];

    function wrapInto(seg) {
      var cls = seg.getAttribute('class') || '';
      var parts = seg.textContent.split(/(\s+)/);
      var frag = document.createDocumentFragment();
      parts.forEach(function (p) {
        if (p === '') return;
        if (/^\s+$/.test(p)) {
          var sp = document.createElement('span');
          sp.className = 'pull-space';
          frag.appendChild(sp);
          return;
        }
        var w = document.createElement('span');
        w.className = 'pull-word' + (cls ? ' ' + cls : '');
        w.textContent = p;
        frag.appendChild(w);
        words.push(w);
      });
      seg.textContent = '';
      seg.appendChild(frag);
    }

    var segments = heading.querySelectorAll('span');
    if (segments.length) {
      segments.forEach(function (seg) {
        // A word that is already wrapped (the hero "Vesper") is collected as-is.
        // Re-wrapping it would nest a revealed .pull-word inside one that stays at
        // opacity 0, hiding the word entirely.
        if (seg.classList.contains('pull-word')) { words.push(seg); return; }
        wrapInto(seg);
        var gap = document.createElement('span');
        gap.className = 'pull-space';
        seg.parentNode.insertBefore(gap, seg.nextSibling);
      });
    } else {
      wrapInto(heading);
    }

    var fired = false;
    function reveal() {
      if (fired) return;
      fired = true;
      words.forEach(function (w, i) {
        w.style.transitionDelay = (i * stagger) + 's';
        w.classList.add('in');
      });
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { reveal(); io.disconnect(); } });
    }, { threshold: 0.2 });
    io.observe(heading);

    // A heading already in view at load (the hero) may never trigger the observer,
    // because nothing scrolls it across the threshold. Reveal it straight away.
    var r = heading.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    if (r.top < vh * 0.85 && r.bottom > 0) { reveal(); io.disconnect(); }
  }
  document.querySelectorAll('.pull').forEach(splitPull);

  /* ---------- 2. Fade-up on load ---------- */
  requestAnimationFrame(function () {
    document.querySelectorAll('.fade-up').forEach(function (el) { el.classList.add('in'); });
  });

  /* ---------- 3. Staggered card entrance ---------- */
  var cardIO = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); cardIO.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
  document.querySelectorAll('.card-anim').forEach(function (c) { cardIO.observe(c); });

  /* ---------- 4. Scroll-linked character reveal ---------- */
  var revealEl = document.querySelector('.reveal-text');
  if (revealEl) {
    var text = revealEl.textContent;
    revealEl.textContent = '';
    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var ch = text[i];
      if (ch === ' ') {
        revealEl.appendChild(document.createTextNode(' '));
        continue;
      }
      var s = document.createElement('span');
      s.className = 'reveal-char';
      s.textContent = ch;
      revealEl.appendChild(s);
      chars.push(s);
    }
    var total = chars.length;

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

    function updateReveal() {
      var rect = revealEl.getBoundingClientRect();
      var vh = window.innerHeight || document.documentElement.clientHeight;
      // progress: 0 when the block's top sits at 80% of viewport, 1 when its
      // bottom passes 20% of viewport. Mirrors the original useScroll offsets.
      var start = vh * 0.8;
      var end = vh * 0.2;
      var travel = (rect.height + (start - end));
      var progress = clamp((start - rect.top) / travel);

      for (var j = 0; j < total; j++) {
        var charProgress = j / total;
        var lo = charProgress - 0.1;
        var hi = charProgress + 0.05;
        var local = clamp((progress - lo) / (hi - lo));
        chars[j].style.opacity = (0.2 + local * 0.8).toFixed(3);
      }
    }
    updateReveal();
    window.addEventListener('scroll', updateReveal, { passive: true });
    window.addEventListener('resize', updateReveal);
  }
})();
