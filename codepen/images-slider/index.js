/* Vanilla port of the Aceternity ImagesSlider runtime. The React version uses
   motion/react AnimatePresence to mount one <motion.img> per index with a pop-in
   on enter and a slide-up on exit; here we preload every photo first, build all
   slides once, then drive the same transition by toggling CSS animation classes.
   Autoplay advances every ~4.5s so the non-interactive preview card animates on
   its own. ArrowLeft / ArrowRight also change slides. */
(function () {
  var IMAGES = [
    // Architecture / interiors / landscape, full-bleed, verified Unsplash.
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=85&fm=webp',
    'https://images.unsplash.com/photo-1494526585095-c41746248156?w=1600&q=85&fm=webp',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=85&fm=webp',
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1600&q=85&fm=webp'
  ];
  var INTERVAL = 4500;   // autoplay cadence
  var EXIT_MS = 1000;    // must match slideUpExit duration in index.css

  var stage = document.querySelector('[data-slider-stage]');
  if (!stage) return;

  var slides = [];
  var current = 0;
  var timer = null;
  var animating = false;

  function preload() {
    var jobs = IMAGES.map(function (src) {
      return new Promise(function (resolve) {
        var img = new Image();
        img.onload = function () { resolve(src); };
        img.onerror = function () { resolve(src); }; // never block the gallery
        img.src = src;
      });
    });
    return Promise.all(jobs);
  }

  function build(loaded) {
    loaded.forEach(function (src, i) {
      var img = document.createElement('img');
      img.className = 'slide';
      img.src = src;
      img.alt = '';
      img.setAttribute('draggable', 'false');
      stage.appendChild(img);
      slides.push(img);
    });
    if (!slides.length) return;
    slides[0].classList.add('is-active');
  }

  function go(nextIndex) {
    if (animating || slides.length < 2) return;
    var from = slides[current];
    var to = slides[nextIndex];

    animating = true;

    // Outgoing slide slides up (-150%); incoming pops in from scale 0 / rotateX 45.
    from.classList.remove('is-active');
    from.classList.add('is-exiting');

    to.classList.remove('is-active');
    // reset any prior end-state, then trigger the pop-in
    to.classList.remove('is-exiting');
    void to.offsetWidth; // reflow so the animation restarts cleanly
    to.classList.add('is-entering');

    window.setTimeout(function () {
      from.classList.remove('is-exiting');
      to.classList.remove('is-entering');
      to.classList.add('is-active');
      current = nextIndex;
      animating = false;
    }, EXIT_MS);
  }

  function next() { go((current + 1) % slides.length); }
  function prev() { go((current - 1 + slides.length) % slides.length); }

  function start() {
    stop();
    timer = window.setInterval(next, INTERVAL);
  }
  function stop() {
    if (timer) { window.clearInterval(timer); timer = null; }
  }

  function onKey(e) {
    if (e.key === 'ArrowRight') { next(); start(); }
    else if (e.key === 'ArrowLeft') { prev(); start(); }
  }

  preload().then(function (loaded) {
    build(loaded);
    if (slides.length > 1) start();
    window.addEventListener('keydown', onKey);
    // Pause while a pointer rests on the card; resume on leave.
    var root = document.querySelector('.slider');
    if (root) {
      root.addEventListener('mouseenter', stop);
      root.addEventListener('mouseleave', start);
    }
  });
})();
