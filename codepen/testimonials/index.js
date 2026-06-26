/* AnimatedTestimonials — vanilla port of the Aceternity component.

   - LEFT: a stack of portraits. The active photo springs to the front (full
     scale, z on top); every inactive photo gets a small, stable random tilt
     and sits scaled-down behind it. Switching cards re-springs the stack.
   - RIGHT: name + role swap, and the quote is revealed word by word with a
     blur-in (each word un-blurs in sequence).
   - prev / next round buttons step the carousel; autoplay advances every 5s
     and pauses while the pointer is over the block.

   The harness wraps this in DOMContentLoaded, so we run immediately. */
(function () {
  var root = document.querySelector('.testi');
  if (!root) return;

  var dataEl = root.querySelector('.testi-data');
  var photos = Array.prototype.slice.call(root.querySelectorAll('.photo'));
  var nameEl = root.querySelector('.testi-name');
  var roleEl = root.querySelector('.testi-role');
  var quoteEl = root.querySelector('.testi-quote');
  var prevBtn = root.querySelector('.ctrl.prev');
  var nextBtn = root.querySelector('.ctrl.next');

  var data = [];
  try { data = JSON.parse(dataEl.textContent); } catch (e) { return; }
  if (!data.length) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var active = 0;
  var AUTOPLAY_MS = 5000;
  var timer = null;
  var wordTimers = [];

  // A fixed small random rotation per inactive card so the stack looks hand
  // placed but never reshuffles on every render (computed once).
  var tilts = photos.map(function () {
    return Math.floor(Math.random() * 21) - 10; // -10deg .. +10deg
  });

  // ---------- Image stack ----------
  function layoutStack() {
    photos.forEach(function (fig, i) {
      var isActive = i === active;
      fig.classList.toggle('is-active', isActive);
      if (isActive) {
        fig.style.transform = 'scale(1) rotateZ(0deg) translateZ(0px)';
        fig.style.opacity = '1';
        fig.style.zIndex = '40';
      } else {
        // Push back, shrink, and apply the card's stable tilt.
        fig.style.transform =
          'scale(0.94) rotateZ(' + tilts[i] + 'deg) translateZ(-60px)';
        fig.style.opacity = '0.7';
        fig.style.zIndex = '1';
      }
    });
  }

  // ---------- Quote word-by-word blur-in ----------
  function clearWordTimers() {
    for (var i = 0; i < wordTimers.length; i++) clearTimeout(wordTimers[i]);
    wordTimers = [];
  }

  function renderQuote(text) {
    clearWordTimers();
    quoteEl.textContent = '';
    var words = text.split(' ');
    var spans = [];
    words.forEach(function (word, i) {
      var span = document.createElement('span');
      span.className = 'w';
      span.textContent = word;
      quoteEl.appendChild(span);
      // Keep the spaces between words as real text nodes.
      if (i < words.length - 1) quoteEl.appendChild(document.createTextNode(' '));
      spans.push(span);
    });

    if (reduce) {
      spans.forEach(function (s) { s.classList.add('in'); });
      return;
    }
    // Stagger the blur-in (~22ms per word, like the original's per-word delay).
    spans.forEach(function (s, i) {
      var t = setTimeout(function () { s.classList.add('in'); }, 60 + i * 22);
      wordTimers.push(t);
    });
  }

  // ---------- Render a step ----------
  function render() {
    var item = data[active];
    layoutStack();
    nameEl.textContent = item.name;
    roleEl.textContent = item.role;
    renderQuote(item.quote);
  }

  function go(next) {
    active = (next % data.length + data.length) % data.length;
    render();
  }

  // ---------- Autoplay ----------
  function start() {
    if (reduce) return;
    stop();
    timer = setInterval(function () { go(active + 1); }, AUTOPLAY_MS);
  }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }

  // ---------- Controls ----------
  prevBtn.addEventListener('click', function () { go(active - 1); start(); });
  nextBtn.addEventListener('click', function () { go(active + 1); start(); });

  // Pause autoplay while hovering the block (resumes on leave).
  root.addEventListener('mouseenter', stop);
  root.addEventListener('mouseleave', start);

  // Clicking a stacked photo brings it to the front.
  photos.forEach(function (fig, i) {
    fig.style.cursor = 'pointer';
    fig.addEventListener('click', function () { go(i); start(); });
  });

  render();
  start();
})();
