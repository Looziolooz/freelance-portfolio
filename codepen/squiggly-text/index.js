/* SquigglyText (vanilla port).
   The React original builds `steps` SVG filters per word (feTurbulence with an
   increasing seed + feDisplacementMap whose `scale` alternates per the tuple),
   then via motion's useTime maps elapsed time → which filter is active:
       filters[floor(t / stepDuration) % filters.length]
   and applies it as the element's CSS `filter`. The wobble runs continuously,
   so it's perfect for an idle card preview (no interaction needed).

   Here we do the same with one shared <defs> and a single requestAnimationFrame
   loop driving every [data-squiggle] word. Per-word config comes from data-attrs:
     data-step  -> stepDuration in ms (default 80)
     data-scale -> "6,9" tuple (alternates per step) or "5" scalar (default "6,8")
   plus the fixed defaults from the source: steps 5, baseFrequency 0.02, numOctaves 3. */
(function () {
  var STEPS = 5;
  var BASE_FREQUENCY = 0.02;
  var NUM_OCTAVES = 3;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var defs = document.querySelector('.sq-defs defs');
  var words = Array.prototype.slice.call(
    document.querySelectorAll('[data-squiggle]')
  );
  if (!defs || !words.length) return;

  var SVGNS = 'http://www.w3.org/2000/svg';

  function parseScale(raw) {
    // "6,9" -> [6, 9] ; "5" -> 5 ; missing -> [6, 8]
    if (!raw) return [6, 8];
    var parts = raw.split(',').map(function (n) { return parseFloat(n.trim()); });
    parts = parts.filter(function (n) { return !isNaN(n); });
    if (parts.length === 0) return [6, 8];
    return parts.length === 1 ? parts[0] : parts;
  }

  function scaleAt(scale, i) {
    return Array.isArray(scale) ? scale[i % scale.length] : scale;
  }

  // Build the per-word filter set in the shared <defs> and remember the
  // url(#id) strings so the loop can swap between them cheaply.
  var entries = words.map(function (el, w) {
    var step = parseFloat(el.getAttribute('data-step'));
    if (isNaN(step)) step = 80;
    var scale = parseScale(el.getAttribute('data-scale'));

    var urls = [];
    for (var i = 0; i < STEPS; i++) {
      var id = 'squiggly-' + w + '-' + i;

      var filter = document.createElementNS(SVGNS, 'filter');
      filter.setAttribute('id', id);

      var turb = document.createElementNS(SVGNS, 'feTurbulence');
      turb.setAttribute('baseFrequency', BASE_FREQUENCY);
      turb.setAttribute('numOctaves', NUM_OCTAVES);
      turb.setAttribute('result', 'noise');
      turb.setAttribute('seed', i);

      var disp = document.createElementNS(SVGNS, 'feDisplacementMap');
      disp.setAttribute('in', 'SourceGraphic');
      disp.setAttribute('in2', 'noise');
      disp.setAttribute('scale', scaleAt(scale, i));

      filter.appendChild(turb);
      filter.appendChild(disp);
      defs.appendChild(filter);

      urls.push('url(#' + id + ')');
    }

    return { el: el, urls: urls, step: step };
  });

  // Under reduced motion, paint the first (calmest) filter once and stop.
  if (reduceMotion) {
    entries.forEach(function (e) { e.el.style.filter = e.urls[0]; });
    return;
  }

  var lastIndex = entries.map(function () { return -1; });
  var start = null;

  function frame(now) {
    if (start === null) start = now;
    var t = now - start;
    for (var i = 0; i < entries.length; i++) {
      var e = entries[i];
      var idx = Math.floor(t / e.step) % e.urls.length;
      if (idx !== lastIndex[i]) {
        e.el.style.filter = e.urls[idx];
        lastIndex[i] = idx;
      }
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
