/* Draggable photo cards — vanilla port of the Aceternity "DraggableCard".
   The harness wraps this in DOMContentLoaded, so we run immediately.

   Each card rests at the board centre + its data-x/data-y scatter offset with a
   slight base rotation. A single rAF loop drives every card:

   - IDLE: a gentle per-card sine drift (bob + sway) so the non-interactive
     gallery teaser shows life on its own.
   - DRAG (pointer events): the card follows the pointer; a tilt is derived from
     pointer velocity AND offset-from-grab so it leans into the motion
     (rotateX/rotateY), and a glare highlight tracks the grab point.
   - RELEASE: velocity carries the card a touch further (inertia), then a spring
     pulls it back to its resting scatter spot, tilt and glare easing to rest.

   No external libs: this mirrors motion's useMotionValue/useSpring/useVelocity
   with a hand-rolled critically-damped spring. */
(function () {
  var board = document.querySelector('.board');
  if (!board) return;

  var cards = Array.prototype.slice.call(board.querySelectorAll('.drag-card'));
  if (!cards.length) return;

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Spring + feel constants.
  var STIFFNESS = 0.12;   // pull strength toward rest
  var DAMPING = 0.78;     // velocity retention per frame
  var TILT_MAX = 18;      // deg cap on drag tilt
  var VEL_TILT = 0.55;    // deg per px/frame of pointer velocity
  var POS_TILT = 0.05;    // deg per px of offset-from-grab
  var HOVER_SCALE = 1.02;
  var GRAB_SCALE = 1.04;

  var state = cards.map(function (el, i) {
    return {
      el: el,
      img: el.querySelector('img'),
      glare: el.querySelector('.card-glare'),
      // resting scatter offset from board centre
      restX: parseFloat(el.getAttribute('data-x')) || 0,
      restY: parseFloat(el.getAttribute('data-y')) || 0,
      restRot: parseFloat(el.getAttribute('data-rot')) || 0,
      // live position (offset from centre) + velocity
      x: parseFloat(el.getAttribute('data-x')) || 0,
      y: parseFloat(el.getAttribute('data-y')) || 0,
      vx: 0, vy: 0,
      // smoothed render values
      rotX: 0, rotY: 0, rotZ: parseFloat(el.getAttribute('data-rot')) || 0,
      scale: 1,
      grabbed: false, hovered: false,
      // grab bookkeeping
      pointerId: null, grabDX: 0, grabDY: 0,
      lastPX: 0, lastPY: 0, pvx: 0, pvy: 0,
      phase: i * 1.7 // desync the idle drift
    };
  });

  // ---------- Hover scale ----------
  state.forEach(function (s) {
    s.el.addEventListener('pointerenter', function () { s.hovered = true; });
    s.el.addEventListener('pointerleave', function () { s.hovered = false; });
  });

  // ---------- Drag (pointer events) ----------
  state.forEach(function (s) {
    s.el.addEventListener('pointerdown', function (e) {
      s.grabbed = true;
      s.pointerId = e.pointerId;
      s.el.classList.add('is-grabbed');
      // bring the grabbed card above the rest
      bringToFront(s);
      // remember where on the card we grabbed (offset from its current centre)
      var r = s.el.getBoundingClientRect();
      s.grabDX = e.clientX - (r.left + r.width / 2);
      s.grabDY = e.clientY - (r.top + r.height / 2);
      s.lastPX = e.clientX;
      s.lastPY = e.clientY;
      s.pvx = 0; s.pvy = 0;
      s.vx = 0; s.vy = 0;
      try { s.el.setPointerCapture(e.pointerId); } catch (err) {}
      e.preventDefault();
    });

    s.el.addEventListener('pointermove', function (e) {
      if (!s.grabbed || e.pointerId !== s.pointerId) return;
      // pointer velocity (px/frame-ish)
      s.pvx = e.clientX - s.lastPX;
      s.pvy = e.clientY - s.lastPY;
      s.lastPX = e.clientX;
      s.lastPY = e.clientY;
      // desired card-centre offset from board centre
      var bc = boardCentre();
      s.x = (e.clientX - s.grabDX) - bc.x;
      s.y = (e.clientY - s.grabDY) - bc.y;
      // glare follows the grab point across the card
      if (s.glare) {
        var r = s.el.getBoundingClientRect();
        var gx = ((e.clientX - r.left) / r.width) * 100;
        var gy = ((e.clientY - r.top) / r.height) * 100;
        s.glare.style.setProperty('--gx', gx.toFixed(1) + '%');
        s.glare.style.setProperty('--gy', gy.toFixed(1) + '%');
      }
    });

    function release(e) {
      if (e && e.pointerId !== s.pointerId) return;
      if (!s.grabbed) return;
      s.grabbed = false;
      s.pointerId = null;
      s.el.classList.remove('is-grabbed');
      // hand off pointer velocity as launch inertia
      s.vx = s.pvx;
      s.vy = s.pvy;
    }
    s.el.addEventListener('pointerup', release);
    s.el.addEventListener('pointercancel', release);
  });

  function boardCentre() {
    var r = board.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  }

  var topZ = 40;
  function bringToFront(s) {
    topZ += 1;
    s.el.style.zIndex = String(topZ);
  }

  // ---------- The loop ----------
  var t = 0;
  function frame() {
    t += 1;

    for (var i = 0; i < state.length; i++) {
      var s = state[i];
      var targetRotX, targetRotY, targetRotZ, targetScale;

      if (s.grabbed) {
        // tilt leans into pointer velocity + offset from grab point
        targetRotY = clamp(s.pvx * VEL_TILT + (s.grabDX * POS_TILT), -TILT_MAX, TILT_MAX);
        targetRotX = clamp(-s.pvy * VEL_TILT - (s.grabDY * POS_TILT), -TILT_MAX, TILT_MAX);
        targetRotZ = clamp(s.pvx * 0.12, -8, 8);
        targetScale = GRAB_SCALE;
        // decay the measured pointer velocity so a held-still card settles flat
        s.pvx *= 0.8;
        s.pvy *= 0.8;
      } else {
        // spring the position back to the resting scatter spot
        var ax = (s.restX - s.x) * STIFFNESS;
        var ay = (s.restY - s.y) * STIFFNESS;
        s.vx = (s.vx + ax) * DAMPING;
        s.vy = (s.vy + ay) * DAMPING;
        s.x += s.vx;
        s.y += s.vy;

        // idle drift: gentle bob + sway when at rest and untouched
        var driftX = 0, driftY = 0, driftR = 0;
        if (!reduce) {
          var settled = Math.abs(s.x - s.restX) < 1.5 && Math.abs(s.y - s.restY) < 1.5;
          var amp = settled ? 1 : 0; // only drift once it has sprung home
          driftY = Math.sin(t * 0.012 + s.phase) * 4 * amp;
          driftX = Math.cos(t * 0.009 + s.phase) * 2.5 * amp;
          driftR = Math.sin(t * 0.010 + s.phase) * 1.2 * amp;
          s._driftX = driftX; s._driftY = driftY;
        }

        targetRotX = 0;
        targetRotY = 0;
        targetRotZ = s.restRot + driftR;
        targetScale = s.hovered ? HOVER_SCALE : 1;
      }

      // ease the render values toward their targets (motion smoothing)
      s.rotX += (targetRotX - s.rotX) * 0.18;
      s.rotY += (targetRotY - s.rotY) * 0.18;
      s.rotZ += (targetRotZ - s.rotZ) * 0.18;
      s.scale += (targetScale - s.scale) * 0.18;

      var dx = s.x + (s.grabbed ? 0 : (s._driftX || 0));
      var dy = s.y + (s.grabbed ? 0 : (s._driftY || 0));

      s.el.style.transform =
        'translate(-50%, -50%)' +
        ' translate(' + dx.toFixed(2) + 'px,' + dy.toFixed(2) + 'px)' +
        ' rotateX(' + s.rotX.toFixed(2) + 'deg)' +
        ' rotateY(' + s.rotY.toFixed(2) + 'deg)' +
        ' rotateZ(' + s.rotZ.toFixed(2) + 'deg)' +
        ' scale(' + s.scale.toFixed(3) + ')';
    }

    requestAnimationFrame(frame);
  }

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  // place each card immediately, then animate
  requestAnimationFrame(frame);
})();
