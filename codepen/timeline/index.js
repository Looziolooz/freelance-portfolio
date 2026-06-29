/* Timeline — vanilla port of the Aceternity scroll mechanic.
   The original uses motion/react: useScroll({ target, offset:["start 10%","end 50%"] })
   gives scrollYProgress 0..1, then heightTransform = useTransform(p,[0,1],[0,railHeight])
   and opacityTransform = useTransform(p,[0,0.1],[0,1]) drive a gradient fill inside a
   masked rail. The iframe scrolls internally, so here we read THIS window's scroll and
   compute the same progress from the rail's position, mapping it to fill height + opacity.
   No motion library; just getBoundingClientRect + requestAnimationFrame. */
(function () {
  var win = window;

  var container = document.querySelector('[data-timeline]');
  var rail = document.querySelector('[data-rail]');
  var fill = document.querySelector('[data-rail-fill]');
  if (!container || !rail || !fill) return;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function update() {
    var vh = win.innerHeight;
    var rect = rail.getBoundingClientRect();
    var railHeight = rect.height;

    /* Reproduce offset ["start 10%", "end 50%"]:
       progress 0 when the rail's TOP reaches 10% down the viewport (0.10 * vh),
       progress 1 when the rail's BOTTOM reaches 50% down the viewport (0.50 * vh).
       Express both ends in terms of how far we've scrolled the rail upward. */
    var startScrolled = 0.10 * vh - rect.top;          // distance past the "start 10%" line
    var totalTravel = railHeight - (0.50 * vh - 0.10 * vh); // span from start-line to end-line
    if (totalTravel <= 0) totalTravel = railHeight || 1;

    var p = clamp(startScrolled / totalTravel);

    /* heightTransform: p -> [0, railHeight] (the fill tracks the whole rail). */
    fill.style.height = (p * railHeight).toFixed(1) + 'px';
    /* opacityTransform: p in [0, 0.1] -> [0, 1], then held at 1. */
    fill.style.opacity = clamp(p / 0.1).toFixed(3);
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    win.requestAnimationFrame(function () { update(); ticking = false; });
  }

  win.addEventListener('scroll', onScroll, { passive: true });
  win.addEventListener('resize', onScroll);

  /* Images change layout height as they load; recompute when they do. */
  Array.prototype.forEach.call(document.querySelectorAll('.tl-img'), function (img) {
    if (img.complete) return;
    img.addEventListener('load', onScroll);
    img.addEventListener('error', onScroll);
  });

  update();
})();
