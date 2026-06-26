/* MacbookScroll — vanilla port of the Aceternity scroll component.
   The iframe scrolls internally, so we read THIS window's scroll. As the tall
   [data-scene] section travels under the pinned stage we compute progress 0..1
   and map it to: lid rotateX(-28deg -> 0deg) + a gentle screen scale-up, and the
   title translating up while it fades out. A representative key grid is generated
   so the deck reads unmistakably as a MacBook. */
(function () {
  var win = window;

  function build() {
    /* ---------- 1. Generate a clean, representative key grid ---------- */
    var kb = document.querySelector('[data-keyboard]');
    if (kb && !kb.childElementCount) {
      // counts per row; 'wide' = a stretched key (tab/caps/shift/enter),
      // a single 'space' row sits at the bottom.
      var rows = [
        { keys: 14 },                 // number row
        { keys: 14, lead: 'wide' },   // qwerty (tab)
        { keys: 13, lead: 'wide', tail: 'wide' }, // home (caps + enter)
        { keys: 12, lead: 'wide', tail: 'wide' }, // shift row
        { space: true }               // bottom: ctrl/alt + spacebar + arrows
      ];
      rows.forEach(function (r) {
        var row = document.createElement('div');
        row.className = 'mbs-krow';
        if (r.space) {
          [1, 1, 1].forEach(function () { row.appendChild(key()); });
          row.appendChild(key('is-space'));
          [1, 1, 1].forEach(function () { row.appendChild(key()); });
        } else {
          if (r.lead) row.appendChild(key('is-wide'));
          for (var i = 0; i < r.keys; i++) row.appendChild(key());
          if (r.tail) row.appendChild(key('is-wide'));
        }
        kb.appendChild(row);
      });
    }

    function key(extra) {
      var k = document.createElement('span');
      k.className = 'mbs-key' + (extra ? ' ' + extra : '');
      return k;
    }

    /* ---------- 2. Scroll-driven open animation ---------- */
    var scene = document.querySelector('[data-scene]');
    var lid = document.querySelector('[data-lid]');
    var screen = document.querySelector('[data-screen]');
    var title = document.querySelector('[data-title]');
    var hint = document.querySelector('[data-hint]');
    if (!scene || !lid) return;

    var START_ROT = -28;   // degrees, closed/tilted
    var END_ROT = 0;       // degrees, fully open

    function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
    // easeOutCubic for a weighted, hardware feel
    function ease(t) { return 1 - Math.pow(1 - t, 3); }

    function update() {
      var rect = scene.getBoundingClientRect();
      var vh = win.innerHeight;
      // travel = the scrollable overshoot of the section past the viewport.
      var travel = rect.height - vh;
      var raw = travel > 0 ? (-rect.top) / travel : 0;
      var p = clamp(raw);
      // Front-load the opening so the lid is flat well before the section ends.
      var op = clamp(p / 0.72);
      var e = ease(op);

      var rot = START_ROT + (END_ROT - START_ROT) * e;
      var scale = 1 + 0.035 * e;    // screen grows slightly as it opens
      lid.style.transform = 'rotateX(' + rot.toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';

      if (screen) {
        // brighten the panel as it faces the viewer
        screen.style.filter = 'brightness(' + (0.74 + 0.26 * e).toFixed(3) + ')';
      }

      if (title) {
        // title rises and fades out over the first ~55% of the open
        var tp = clamp(op / 0.55);
        title.style.transform = 'translateY(' + (-60 * tp).toFixed(1) + 'px)';
        title.style.opacity = (1 - tp).toFixed(3);
      }

      if (hint) hint.style.opacity = (1 - clamp(p * 4)).toFixed(3);
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      win.requestAnimationFrame(function () { update(); ticking = false; });
    }

    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('resize', onScroll);
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
