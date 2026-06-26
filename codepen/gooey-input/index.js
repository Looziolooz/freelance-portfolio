/* Vanilla port of the React GooeyInput interaction, built for the looping
   preview. Real behaviour first: clicking the pill (or focusing the input)
   opens it; blurring an empty input collapses it. On top of that, because the
   gallery card is non-interactive, an auto-demo loop runs every ~4s: expand the
   pill, type a short Italian word character by character, hold, then collapse,
   on repeat. Any genuine user interaction pauses the demo so the manual focus on
   the detail page always wins. No dependencies. */
(function () {
  var merge = document.getElementById('gooMerge');
  var pill = document.getElementById('gooPill');
  var input = document.getElementById('gooInput');
  if (!merge || !pill || !input) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DEMO_WORD = 'logo nuovo';
  var TYPE_MS = 110;        // ms between typed characters
  var OPEN_HOLD_MS = 1400;  // hold after the word is typed
  var COLLAPSE_HOLD_MS = 1600; // pause while collapsed before the next loop
  var OPEN_SETTLE_MS = 520;  // let the width/bubble transition finish before typing

  var demoActive = true;
  var timers = [];

  function clearTimers() {
    for (var i = 0; i < timers.length; i += 1) clearTimeout(timers[i]);
    timers = [];
  }

  function open() {
    merge.classList.add('is-open');
  }
  function close() {
    merge.classList.remove('is-open');
  }

  // ---- Real interaction (works on the detail page) ----
  function stopDemo() {
    if (!demoActive) return;
    demoActive = false;
    clearTimers();
    // Reset whatever the demo had typed so the real field starts clean.
    input.value = '';
  }

  pill.addEventListener('click', function () {
    stopDemo();
    open();
    input.focus();
  });
  input.addEventListener('focus', function () {
    stopDemo();
    open();
  });
  input.addEventListener('blur', function () {
    if (!input.value) close();
  });
  // First genuine keystroke also kills the demo (defensive).
  input.addEventListener('keydown', stopDemo);

  // ---- Auto-demo loop ----
  function typeWord(word, done) {
    var i = 0;
    function step() {
      if (!demoActive) return;
      input.value = word.slice(0, i);
      i += 1;
      if (i <= word.length) {
        timers.push(setTimeout(step, TYPE_MS));
      } else {
        done();
      }
    }
    step();
  }

  function runCycle() {
    if (!demoActive) return;
    open();
    timers.push(setTimeout(function () {
      if (!demoActive) return;
      typeWord(DEMO_WORD, function () {
        if (!demoActive) return;
        timers.push(setTimeout(function () {
          if (!demoActive) return;
          input.value = '';
          close();
          timers.push(setTimeout(runCycle, COLLAPSE_HOLD_MS));
        }, OPEN_HOLD_MS));
      });
    }, OPEN_SETTLE_MS));
  }

  if (!reduceMotion) {
    // Small initial delay so the parchment frame settles before the first expand.
    timers.push(setTimeout(runCycle, 900));
  }
})();
