/* Vanilla port of the React EncryptedText effect, built for the looping preview.
   Same math as the original: real characters reveal left to right, one every
   revealDelayMs; every unrevealed (non-space) glyph re-randomises from the
   charset each flipDelayMs. Spaces are preserved. Encrypted glyphs get the muted
   class, revealed glyphs the ink class. The original fires once on scroll-into-
   view; here we re-scramble and re-run every ~5s so the card teaser animates on
   its own. requestAnimationFrame-driven, no dependencies. */
(function () {
  var TEXT = 'Trasformiamo le idee in siti che vendono.';
  var CHARSET =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?';
  var REVEAL_DELAY_MS = 55; // ms between revealing each real char
  var FLIP_DELAY_MS = 50;   // ms between gibberish flips
  var LOOP_PAUSE_MS = 1600; // hold the fully-revealed line before re-scrambling

  var host = document.querySelector('.enc-text');
  if (!host) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function randomChar() {
    return CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }

  function gibberishPreservingSpaces(original) {
    var out = '';
    for (var i = 0; i < original.length; i += 1) {
      out += original[i] === ' ' ? ' ' : randomChar();
    }
    return out;
  }

  // Build one <span> per character once; we only swap text + class per frame.
  var spans = [];
  host.textContent = '';
  for (var i = 0; i < TEXT.length; i += 1) {
    var s = document.createElement('span');
    s.className = 'enc-muted';
    host.appendChild(s);
    spans.push(s);
  }

  // Reduced motion: just render the real text, no animation.
  if (reduceMotion) {
    for (var j = 0; j < TEXT.length; j += 1) {
      spans[j].textContent = TEXT[j];
      spans[j].className = 'enc-ink';
    }
    return;
  }

  var total = TEXT.length;
  var scramble = gibberishPreservingSpaces(TEXT).split('');
  var startTime = 0;
  var lastFlip = 0;
  var rafId = null;

  function render(revealCount) {
    for (var k = 0; k < total; k += 1) {
      var revealed = k < revealCount;
      if (revealed) {
        if (spans[k].className !== 'enc-ink') spans[k].className = 'enc-ink';
        if (spans[k].textContent !== TEXT[k]) spans[k].textContent = TEXT[k];
      } else {
        if (spans[k].className !== 'enc-muted') spans[k].className = 'enc-muted';
        var ch = TEXT[k] === ' ' ? ' ' : scramble[k];
        if (spans[k].textContent !== ch) spans[k].textContent = ch;
      }
    }
  }

  function update(now) {
    var elapsed = now - startTime;
    var revealCount = Math.min(total, Math.floor(elapsed / Math.max(1, REVEAL_DELAY_MS)));

    if (now - lastFlip >= Math.max(0, FLIP_DELAY_MS)) {
      for (var index = 0; index < total; index += 1) {
        if (index >= revealCount) {
          scramble[index] = TEXT[index] !== ' ' ? randomChar() : ' ';
        }
      }
      lastFlip = now;
    }

    render(revealCount);

    if (revealCount >= total) {
      // Fully revealed: hold, then re-scramble and run again.
      rafId = window.setTimeout(start, LOOP_PAUSE_MS);
      return;
    }
    rafId = requestAnimationFrame(update);
  }

  function start() {
    scramble = gibberishPreservingSpaces(TEXT).split('');
    startTime = performance.now();
    lastFlip = startTime;
    render(0);
    rafId = requestAnimationFrame(update);
  }

  start();
})();
