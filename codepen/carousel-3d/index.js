/* Carousel 3D controller. Moves a flex track with translateX so one square slide
   fills the stage at a time; the active slide gets the .is-active class (flat +
   large, others scaled + tilted via CSS). The active image parallax-shifts toward
   the cursor by writing --x/--y. Prev/next wrap around, and the deck auto-advances
   every ~4s so the non-interactive preview keeps moving; hovering pauses it. */
(function () {
  var stage = document.querySelector('.carousel-stage');
  var track = document.querySelector('.carousel-track');
  var slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  var prevBtn = document.querySelector('.ctrl-prev');
  var nextBtn = document.querySelector('.ctrl-next');
  if (!stage || !track || !slides.length) return;

  var index = 0;
  var count = slides.length;
  var AUTOPLAY_MS = 4000;
  var timer = null;
  var paused = false;

  function render() {
    track.style.transform = 'translateX(' + (-index * 100) + '%)';
    for (var i = 0; i < count; i++) {
      slides[i].classList.toggle('is-active', i === index);
    }
    // Reset parallax on whichever slide just became active.
    var activeImg = slides[index].querySelector('.slide-img');
    if (activeImg) {
      activeImg.style.setProperty('--x', '0px');
      activeImg.style.setProperty('--y', '0px');
    }
  }

  function go(to) {
    index = (to % count + count) % count;
    render();
  }
  function next() { go(index + 1); }
  function prev() { go(index - 1); }

  if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });
  if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });

  // Cursor parallax on the active slide: offset from the stage centre, fed to CSS
  // which divides by 30, so the active image drifts gently toward the pointer.
  stage.addEventListener('mousemove', function (e) {
    var rect = stage.getBoundingClientRect();
    var dx = e.clientX - (rect.left + rect.width / 2);
    var dy = e.clientY - (rect.top + rect.height / 2);
    var img = slides[index].querySelector('.slide-img');
    if (img) {
      img.style.setProperty('--x', dx + 'px');
      img.style.setProperty('--y', dy + 'px');
    }
  });
  stage.addEventListener('mouseleave', function () {
    var img = slides[index].querySelector('.slide-img');
    if (img) {
      img.style.setProperty('--x', '0px');
      img.style.setProperty('--y', '0px');
    }
  });

  // Autoplay — pause on hover anywhere in the component, resume on leave.
  function tick() { if (!paused) next(); }
  function start() { stop(); timer = setInterval(tick, AUTOPLAY_MS); }
  function stop() { if (timer) { clearInterval(timer); timer = null; } }
  function restart() { start(); }

  var root = document.querySelector('.carousel-3d');
  if (root) {
    root.addEventListener('mouseenter', function () { paused = true; });
    root.addEventListener('mouseleave', function () { paused = false; });
  }

  render();
  start();
})();
