/* Atlas, vanilla port of the Framer-Motion interactions:
   1) Magnet: hero centerpiece eases toward the cursor while it is near.
   2) Dual marquee: two rows translate in opposite directions on scroll.
   3) Char-by-char reveal: paragraph letters lift from 0.2 -> 1 opacity on scroll.
   4) Sticky-stacking cards: each card scales down as later cards stack over it.
   The iframe scrolls internally, so we listen to this window's scroll. */
(function () {
  var win = window;

  function init() {

  /* ---------- 1. Magnet centerpiece ---------- */
  (function magnet() {
    var el = document.querySelector('[data-magnet]');
    if (!el) return;
    var PAD = 150, STRENGTH = 3;
    var tx = 0, ty = 0, cx = 0, cy = 0, active = false;

    win.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var midX = r.left + r.width / 2;
      var midY = r.top + r.height / 2;
      var dx = e.clientX - midX;
      var dy = e.clientY - midY;
      var near = Math.abs(dx) < r.width / 2 + PAD && Math.abs(dy) < r.height / 2 + PAD;
      if (near) {
        active = true;
        tx = dx / STRENGTH;
        ty = dy / STRENGTH;
        el.style.transition = 'transform 0.3s ease-out';
      } else if (active) {
        active = false;
        tx = 0; ty = 0;
        el.style.transition = 'transform 0.6s ease-in-out';
      }
    }, { passive: true });

    function tick() {
      cx += (tx - cx) * 0.18;
      cy += (ty - cy) * 0.18;
      el.style.transform = 'translate3d(' + cx.toFixed(2) + 'px,' + cy.toFixed(2) + 'px,0)';
      requestAnimationFrame(tick);
    }
    tick();
  })();

  /* ---------- 2. Dual scroll marquee ---------- */
  (function marquee() {
    var section = document.querySelector('[data-marquee]');
    if (!section) return;
    var row1 = section.querySelector('[data-row="1"]');
    var row2 = section.querySelector('[data-row="2"]');

    var gifs = [
      'hero-space-voyage-preview-eECLH3Yc','hero-codenest-preview-Cgppc2qV',
      'hero-vex-ventures-preview-BczMFIiw','hero-stellar-ai-v2-preview-DjvxjG3C',
      'hero-asme-preview-B_nGDnTP','hero-transform-data-preview-Cx5OU29N',
      'hero-vitara-preview-Cjz2QYyU','hero-terra-preview-BFjrCr7T',
      'hero-skyelite-preview-DHaZIgUv','hero-aethera-preview-DknSlcTa',
      'hero-designpro-preview-D8c5_een','hero-stellar-ai-preview-D3HL6bw1',
      'hero-xportfolio-preview-D4A8maiC','hero-orbit-web3-preview-BXt4OttD',
      'hero-nexora-preview-cx5HmUgo','hero-evr-ventures-preview-DZxeVFEX',
      'hero-planet-orbit-preview-DWAP8Z1P','hero-new-era-preview-CocuDUm9',
      'hero-wealth-preview-B70idl_u','hero-luminex-preview-CxOP7ce6',
      'hero-celestia-preview-0yO3jXO8'
    ].map(function (s) { return 'https://motionsites.ai/assets/' + s + '.gif'; });

    var setA = gifs.slice(0, 11);
    var setB = gifs.slice(11);

    function fill(row, list) {
      var html = '';
      // triple for seamless travel
      for (var t = 0; t < 3; t++) {
        for (var i = 0; i < list.length; i++) {
          html += '<img class="marquee-tile" loading="lazy" src="' + list[i] + '" alt="">';
        }
      }
      row.innerHTML = html;
    }
    fill(row1, setA);
    fill(row2, setB);

    function onScroll() {
      var rect = section.getBoundingClientRect();
      var sectionTop = rect.top + win.scrollY;
      var offset = (win.scrollY - sectionTop + win.innerHeight) * 0.3;
      row1.style.transform = 'translateX(' + (offset - 200) + 'px)';
      row2.style.transform = 'translateX(' + (-(offset - 200)) + 'px)';
    }
    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('resize', onScroll);
    onScroll();
  })();

  /* ---------- 3. Char-by-char scroll reveal ---------- */
  (function reveal() {
    var p = document.querySelector('[data-reveal]');
    if (!p) return;
    var text = p.textContent;
    p.textContent = '';
    var spans = [];
    for (var i = 0; i < text.length; i++) {
      var s = document.createElement('span');
      s.className = 'ch';
      s.textContent = text[i];
      s.style.opacity = '0.2';
      if (text[i] === ' ') s.style.whiteSpace = 'pre';
      p.appendChild(s);
      spans.push(s);
    }

    function update() {
      var rect = p.getBoundingClientRect();
      var vh = win.innerHeight;
      // progress 0 when paragraph top hits 80% of viewport, 1 when bottom passes 20%
      var start = vh * 0.8;
      var end = vh * 0.2;
      var prog = (start - rect.top) / (start - end + rect.height);
      prog = Math.max(0, Math.min(1, prog));
      var lit = prog * spans.length;
      for (var i = 0; i < spans.length; i++) {
        var o = lit - i;
        o = o < 0 ? 0 : o > 1 ? 1 : o;
        spans[i].style.opacity = (0.2 + 0.8 * o).toFixed(3);
      }
    }
    win.addEventListener('scroll', update, { passive: true });
    win.addEventListener('resize', update);
    update();
  })();

  /* ---------- 4. Sticky-stacking card scale ---------- */
  (function cards() {
    var wraps = Array.prototype.slice.call(document.querySelectorAll('.card-wrap'));
    if (!wraps.length) return;
    var total = wraps.length;
    wraps.forEach(function (w, i) {
      w.style.top = (96 + i * 28) + 'px';
      if (win.innerWidth >= 768) w.style.top = (128 + i * 28) + 'px';
    });

    function update() {
      var vh = win.innerHeight;
      for (var i = 0; i < total; i++) {
        var card = wraps[i].querySelector('.card');
        var targetScale = 1 - (total - 1 - i) * 0.03;
        // scale interpolates from 1 (card pinned) down to targetScale as the next
        // card scrolls up and stacks on top.
        var next = wraps[i + 1];
        var prog = 0;
        if (next) {
          var nr = next.getBoundingClientRect();
          // 0 while next card is far below, 1 once it reaches the pin line
          prog = 1 - Math.max(0, Math.min(1, (nr.top - (i < 1 ? 96 : 128)) / vh));
        }
        var scale = 1 + (targetScale - 1) * prog;
        card.style.transform = 'scale(' + scale.toFixed(4) + ')';
      }
    }
    win.addEventListener('scroll', update, { passive: true });
    win.addEventListener('resize', update);
    update();
  })();

  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
