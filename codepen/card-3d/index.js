/* 3D tilt card — vanilla port of the React CardContainer/CardItem behaviour.
   The harness wraps this in DOMContentLoaded, so we run immediately.

   On hover: the container rotates with the cursor exactly like the original
     x = (clientX - left - width/2) / 25
     y = (clientY - top - height/2) / 25
     transform = rotateY(x) rotateX(y)
   and each .card-item lifts to its data-tz translateZ.

   Without a cursor (the gallery iframe is non-interactive): a gentle sine
   AUTO-TILT loop oscillates rotateX/rotateY and floats the items on their Z,
   so the teaser shows depth on its own. Real mousemove overrides the loop
   while hovering; mouseleave hands control back to the auto loop. */
(function () {
  var container = document.querySelector('.card-container');
  if (!container) return;

  var items = Array.prototype.slice.call(document.querySelectorAll('.card-item'));
  var hovering = false;

  function setItems(factor) {
    // factor 0 = flat, 1 = fully lifted to each item's translateZ.
    for (var i = 0; i < items.length; i++) {
      var tz = parseFloat(items[i].getAttribute('data-tz')) || 0;
      items[i].style.transform = 'translateZ(' + (tz * factor).toFixed(2) + 'px)';
    }
  }

  // ---------- Real cursor tilt (overrides the auto loop) ----------
  container.addEventListener('mouseenter', function () {
    hovering = true;
    setItems(1);
  });

  container.addEventListener('mousemove', function (e) {
    var r = container.getBoundingClientRect();
    var x = (e.clientX - r.left - r.width / 2) / 25;
    var y = (e.clientY - r.top - r.height / 2) / 25;
    container.style.transform = 'rotateY(' + x + 'deg) rotateX(' + y + 'deg)';
  });

  container.addEventListener('mouseleave', function () {
    hovering = false;
    container.style.transform = 'rotateY(0deg) rotateX(0deg)';
    setItems(0);
  });

  // ---------- Auto-tilt teaser loop (when no cursor) ----------
  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var start = null;
  function loop(ts) {
    if (start === null) start = ts;
    if (!hovering) {
      var t = (ts - start) / 1000;
      // Slow, subtle oscillation — a card breathing in 3D.
      var ry = Math.sin(t * 0.7) * 7;          // deg, left/right sway
      var rx = Math.cos(t * 0.55) * 5;         // deg, up/down nod
      container.style.transform =
        'rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg)';
      // Items float between ~35% and ~100% of their translateZ.
      var lift = 0.68 + Math.sin(t * 0.9) * 0.32;
      setItems(lift);
    }
    requestAnimationFrame(loop);
  }

  if (!reduce) {
    requestAnimationFrame(loop);
  }
})();
