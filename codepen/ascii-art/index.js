/* Vanilla port of the React AsciiArt component, built for the looping preview.
   Same idea as the original: load an image (crossOrigin "anonymous" so we can
   read its pixels), sample it into a low-res grid of `RESOLUTION` columns and
   rows = cols * 0.55, map each cell's average brightness to a glyph from the
   ramp, then draw the glyphs on a <canvas>. The original supports several
   animationStyles; here we run a "typewriter" reveal (glyphs appear in reading
   order) and loop it every ~6s so the card teaser animates on its own. Ink
   glyphs on a parchment fill, single colour, no dependencies. */
(function () {
  var SRC =
    'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=1280&q=85&fm=webp';
  var RESOLUTION = 110;                 // grid columns
  var ROW_RATIO = 0.55;                 // rows = cols * 0.55 (cells are taller than wide)
  var CHARSET = ' .,:;i1tfLCG08@';      // dark -> light ramp (light bg, dark ink)
  var INK = '#26221d';                  // glyph colour
  var PAPER = '#efe9dc';                // canvas background
  var REVEAL_MS = 1500;                 // duration of the typewriter sweep
  var HOLD_MS = 3200;                   // hold the finished frame before looping
  var SUPERSAMPLE = 2;                  // draw at 2x for crisp glyphs on hi-dpi

  var canvas = document.querySelector('.ascii-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- grid geometry -------------------------------------------------------
  var cols = RESOLUTION;
  var rows = Math.max(1, Math.round(cols * ROW_RATIO));
  var grid = null;        // Array(rows*cols) of glyph indices into CHARSET
  var cellW = 0;          // px per cell (canvas space)
  var cellH = 0;
  var revealOrder = [];   // flat cell indices in reveal order (reading order)

  function sizeCanvas() {
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(1, Math.round(rect.width * SUPERSAMPLE));
    var h = Math.max(1, Math.round(rect.height * SUPERSAMPLE));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    cellW = canvas.width / cols;
    cellH = canvas.height / rows;
  }

  // ---- sample the image into a brightness grid -----------------------------
  function buildGrid(img) {
    // Offscreen canvas at grid resolution, cover-fit so the subject fills the frame.
    var off = document.createElement('canvas');
    off.width = cols;
    off.height = rows;
    var octx = off.getContext('2d');

    var ar = img.width / img.height;
    var targetAr = cols / rows;
    var sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (ar > targetAr) {
      // image wider than grid -> crop sides
      sw = img.height * targetAr;
      sx = (img.width - sw) / 2;
    } else {
      // image taller than grid -> crop top/bottom
      sh = img.width / targetAr;
      sy = (img.height - sh) / 2;
    }
    octx.drawImage(img, sx, sy, sw, sh, 0, 0, cols, rows);

    var data;
    try {
      data = octx.getImageData(0, 0, cols, rows).data;
    } catch (e) {
      // Tainted canvas (shouldn't happen with Unsplash CORS): bail gracefully.
      console.error('[ascii] cannot read pixels:', e);
      return;
    }

    grid = new Array(cols * rows);
    var last = CHARSET.length - 1;
    for (var i = 0; i < cols * rows; i += 1) {
      var r = data[i * 4];
      var g = data[i * 4 + 1];
      var b = data[i * 4 + 2];
      // Rec. 601 luma, 0..1
      var lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      // Brighter pixel -> denser glyph (so highlights read as ink on paper).
      grid[i] = Math.round(lum * last);
    }

    // Reveal order = reading order (left->right, top->bottom): the typewriter.
    revealOrder = new Array(cols * rows);
    for (var k = 0; k < revealOrder.length; k += 1) revealOrder[k] = k;
  }

  // ---- draw the grid up to `count` revealed cells --------------------------
  function draw(count) {
    if (!grid) return;
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = INK;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    var fontPx = Math.max(1, cellH * 1.08);
    ctx.font = fontPx + "px 'Courier New', ui-monospace, monospace";

    var limit = Math.min(count, revealOrder.length);
    for (var n = 0; n < limit; n += 1) {
      var idx = revealOrder[n];
      var ch = CHARSET.charAt(grid[idx]);
      if (ch === ' ') continue;
      var col = idx % cols;
      var row = (idx - col) / cols;
      var x = col * cellW + cellW / 2;
      var y = row * cellH + cellH / 2;
      ctx.fillText(ch, x, y);
    }
  }

  // ---- typewriter reveal loop ----------------------------------------------
  var rafId = null;
  var timerId = null;

  function runReveal() {
    var startTime = performance.now();
    var total = revealOrder.length;

    function step(now) {
      var t = Math.min(1, (now - startTime) / REVEAL_MS);
      // easeOutCubic for a soft settle at the end of the sweep
      var eased = 1 - Math.pow(1 - t, 3);
      draw(Math.floor(eased * total));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      } else {
        draw(total);
        timerId = window.setTimeout(runReveal, HOLD_MS); // loop the teaser
      }
    }
    rafId = requestAnimationFrame(step);
  }

  function start(img) {
    sizeCanvas();
    buildGrid(img);
    if (!grid) return;
    if (reduceMotion) {
      draw(revealOrder.length); // static full render, no animation
      return;
    }
    runReveal();
  }

  // Re-sample + redraw on resize so the grid stays crisp.
  var resizeQueued = false;
  var loadedImg = null;
  window.addEventListener('resize', function () {
    if (!loadedImg || resizeQueued) return;
    resizeQueued = true;
    window.requestAnimationFrame(function () {
      resizeQueued = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (timerId) clearTimeout(timerId);
      sizeCanvas();
      buildGrid(loadedImg);
      if (!grid) return;
      if (reduceMotion) { draw(revealOrder.length); return; }
      runReveal();
    });
  });

  // ---- load the image ------------------------------------------------------
  var img = new Image();
  img.crossOrigin = 'anonymous'; // required to read pixels from Unsplash
  img.onload = function () {
    loadedImg = img;
    start(img);
  };
  img.onerror = function () {
    console.error('[ascii] image failed to load:', SRC);
  };
  img.src = SRC;
})();
