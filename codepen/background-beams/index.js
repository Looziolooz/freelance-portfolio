/* Background Beams With Collision — vanilla port. Several thin gradient beams
   fall from above the viewport at staggered x positions and speeds. A single
   requestAnimationFrame loop advances each beam; when its head reaches the floor
   line it spawns a burst of ~20 gold particles plus a glow at the impact point,
   then the beam resets above the top with a fresh random x, speed and delay and
   falls again. Mirrors the Aceternity component's collision + explosion loop. */
(function () {
  var field = document.querySelector('.beams-field');
  var stage = document.querySelector('.beams-stage');
  if (!field || !stage) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var BEAM_COUNT = 7;       // how many beams fall at once
  var BEAM_H = 144;         // beam height in px (matches .beam height: 9rem)
  var SPARKS = 20;          // particles per explosion

  var W = stage.clientWidth;
  var H = stage.clientHeight;

  window.addEventListener('resize', function () {
    W = stage.clientWidth;
    H = stage.clientHeight;
  });

  function rand(min, max) { return min + Math.random() * (max - min); }

  // Reset a beam to a fresh random column, speed and a head start above the top.
  function reset(b) {
    b.x = rand(0.04, 0.96);                 // horizontal position, 0..1 of width
    b.speed = rand(140, 320);               // px per second
    b.y = -BEAM_H - rand(0, H * 0.9);       // start above the top, staggered
    b.boomed = false;
    b.el.style.left = (b.x * 100) + '%';
    b.el.style.opacity = rand(0.55, 1).toFixed(2);
  }

  // Build the beams.
  var beams = [];
  for (var i = 0; i < BEAM_COUNT; i++) {
    var el = document.createElement('div');
    el.className = 'beam';
    field.appendChild(el);
    var b = { el: el, x: 0, y: 0, speed: 0, boomed: false };
    reset(b);
    // spread the initial fall so they don't all land together
    b.y = -BEAM_H - rand(0, H * 1.6);
    beams.push(b);
  }

  // Spawn an explosion: a glow + SPARKS particles that fly outward, then clean up.
  function explode(xPercent) {
    var boom = document.createElement('div');
    boom.className = 'boom';
    boom.style.left = xPercent + '%';
    boom.style.bottom = '0px';

    var glow = document.createElement('div');
    glow.className = 'boom-glow';
    boom.appendChild(glow);

    for (var s = 0; s < SPARKS; s++) {
      var spark = document.createElement('span');
      spark.className = 'spark';
      var ang = rand(-Math.PI, 0);          // fan upward and outward from impact
      var dist = rand(28, 88);
      var dx = Math.cos(ang) * dist;
      var dy = Math.sin(ang) * dist;        // negative -> flies up
      spark.style.setProperty('--dx', dx.toFixed(1) + 'px');
      spark.style.setProperty('--dy', dy.toFixed(1) + 'px');
      spark.style.animationDelay = rand(0, 40).toFixed(0) + 'ms';
      boom.appendChild(spark);
    }

    stage.appendChild(boom);
    setTimeout(function () { boom.remove(); }, 1000);
  }

  if (reduce) {
    // Static fallback: park the beams mid-stage, no motion.
    beams.forEach(function (b) {
      b.el.style.transform = 'translateY(' + (H * 0.4) + 'px)';
    });
    return;
  }

  var last = performance.now();
  function loop(now) {
    var dt = Math.min((now - last) / 1000, 0.05); // clamp big gaps (tab switches)
    last = now;

    for (var j = 0; j < beams.length; j++) {
      var b = beams[j];
      b.y += b.speed * dt;

      // Collision: the head of the beam (its bottom edge) reaches the floor.
      var headY = b.y + BEAM_H;
      if (!b.boomed && headY >= H) {
        b.boomed = true;
        explode(b.x * 100);
        reset(b);
        continue;
      }
      b.el.style.transform = 'translateY(' + b.y + 'px)';
    }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
