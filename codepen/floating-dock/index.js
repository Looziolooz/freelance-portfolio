/* Floating Dock — vanilla port of the Aceternity FloatingDock magnify mechanic.
   In React the original maps a `mouseX` motion value through a distance->size
   useTransform and smooths it with useSpring. Here we replicate that frame by
   frame: each icon's target width follows a bump curve of |iconCenterX - mouseX|,
   and a per-icon spring (critically-ish damped) eases the current width toward it.

   Because the gallery card is non-interactive, an auto-demo sweeps a virtual
   cursor x back and forth across the dock so the magnify ripple plays on its own.
   A real pointer over the dock takes over instantly; on pointer-leave the
   auto-demo resumes. */
(function () {
  var BASE = 40;      // resting icon box (px) — matches --dock-base
  var MAX = 80;       // magnified icon box (px) — matches --dock-max
  var RANGE = 150;    // distance (px) over which the bump falls off
  var STIFF = 0.16;   // spring stiffness (lerp toward velocity target)
  var DAMP = 0.72;    // velocity damping

  var dock = document.querySelector('.dock');
  if (!dock) return;
  var items = Array.prototype.slice.call(dock.querySelectorAll('.dock-item'));
  if (!items.length) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Per-icon physics state.
  var state = items.map(function () {
    return { w: BASE, v: 0, target: BASE };
  });

  var pointerX = null;     // real cursor x (null when pointer is away)
  var demoX = 0;           // virtual cursor x for the auto-demo
  var demoDir = 1;
  var demoActive = !reduce;

  // distance -> size bump: full MAX at the icon, easing to BASE past RANGE.
  function sizeFor(centerX, cursorX) {
    var d = Math.abs(centerX - cursorX);
    if (d >= RANGE) return BASE;
    // smooth cosine falloff (0 at edge, 1 at center) — mirrors the spring feel
    var t = 1 - d / RANGE;
    var bump = (1 - Math.cos(t * Math.PI)) / 2; // ease-in-out 0..1
    return BASE + (MAX - BASE) * bump;
  }

  function dockBounds() {
    return dock.getBoundingClientRect();
  }

  // Pointer takes priority; otherwise the demo cursor drives the magnify.
  dock.addEventListener('mousemove', function (e) {
    pointerX = e.clientX;
    demoActive = false;
  });
  dock.addEventListener('mouseleave', function () {
    pointerX = null;
    if (!reduce) demoActive = true;
  });

  function step() {
    var rect = dockBounds();

    // Advance the auto-demo cursor across the dock width (with padding overshoot
    // so the ripple fully decays at each end before turning around).
    if (demoActive) {
      // overshoot past RANGE so the ripple fully decays (every icon back to BASE)
      // before the cursor turns around, giving a clean back-and-forth loop.
      var pad = RANGE + 20;
      var min = rect.left - pad;
      var max = rect.right + pad;
      if (demoX < min) demoX = min;
      var speed = (rect.width + pad * 2) / 170; // ~2.8s per sweep at 60fps
      demoX += demoDir * speed;
      if (demoX >= max) { demoX = max; demoDir = -1; }
      else if (demoX <= min) { demoX = min; demoDir = 1; }
    }

    var cursorX = pointerX !== null ? pointerX : demoX;
    var focal = -1, focalSize = BASE + 1;

    for (var i = 0; i < items.length; i++) {
      var b = items[i].getBoundingClientRect();
      var centerX = b.left + b.width / 2;
      var target = reduce ? BASE : sizeFor(centerX, cursorX);
      var s = state[i];

      if (reduce) {
        s.w = BASE;
      } else {
        // spring: pull velocity toward (target - w), damp, integrate
        s.v += (target - s.w) * STIFF;
        s.v *= DAMP;
        s.w += s.v;
      }

      items[i].style.width = s.w.toFixed(2) + 'px';
      items[i].style.height = s.w.toFixed(2) + 'px';

      // track the most-magnified icon to surface its tooltip + gold accent
      if (s.w > focalSize) { focalSize = s.w; focal = i; }
    }

    // Only show the tooltip when an icon is meaningfully magnified.
    var threshold = BASE + (MAX - BASE) * 0.35;
    for (var j = 0; j < items.length; j++) {
      var on = j === focal && focalSize > threshold;
      items[j].classList.toggle('show-tip', on);
      items[j].classList.toggle('is-near', on);
    }

    requestAnimationFrame(step);
  }
  // seed the demo cursor at the left edge before the first frame
  demoX = dockBounds().left;
  requestAnimationFrame(step);

  /* ---------- Mobile collapsed variant ---------- */
  var trigger = document.querySelector('.dock-mobile-trigger');
  var mobileItems = document.querySelector('.dock-mobile-items');
  if (trigger && mobileItems) {
    trigger.addEventListener('click', function () {
      var open = mobileItems.getAttribute('data-open') === 'true';
      mobileItems.setAttribute('data-open', String(!open));
      trigger.setAttribute('aria-expanded', String(!open));
    });
  }
})();
