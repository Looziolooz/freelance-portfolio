/* DottedGlowBackground — vanilla port.
   Una griglia di puntini su <canvas>: ogni riga è sfalsata (offset metà gap su
   quelle dispari). Ogni puntino ha fase e velocità proprie e pulsa l'alpha con
   un'onda triangolare; quando è luminoso "accende" lo shadowBlur nel colore
   glow. Gestisce DPR + resize, rispetta un'opacità globale e una dissolvenza
   radiale opzionale (qui delegata alla mask CSS sul canvas). */
(function () {
  var canvas = document.querySelector('.dg-canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');

  // ---- Props (i default rispecchiano il componente React) ----
  var GAP = 22;            // distanza tra i puntini (px CSS)
  var RADIUS = 1.6;        // raggio del puntino (px CSS)
  var OPACITY = 0.85;      // opacità globale del layer
  var SPEED_MIN = 0.4;     // velocità minima di pulsazione
  var SPEED_MAX = 1.1;     // velocità massima
  var SPEED_SCALE = 0.0014;// fattore tempo→fase
  var GLOW_BLUR = 7;       // shadowBlur quando il puntino è acceso

  // Colori letti dalle CSS var (con fallback ai literal del brand).
  function cssVar(name, fallback) {
    var v = getComputedStyle(document.documentElement)
      .getPropertyValue(name).trim();
    return v || fallback;
  }
  var COLOR = cssVar('--dg-dot', '#6b6256');   // ink-muted
  var GLOW = cssVar('--dg-glow', '#c8972e');   // ochre-gold

  var dpr = Math.max(1, window.devicePixelRatio || 1);
  var dots = [];
  var cssW = 0, cssH = 0;

  // Costruisce la griglia: righe dispari sfalsate di mezzo gap.
  function buildGrid() {
    dots = [];
    var row = 0;
    for (var y = GAP; y < cssH - GAP * 0.5; y += GAP) {
      var offset = (row % 2 === 1) ? GAP / 2 : 0;
      for (var x = GAP + offset; x < cssW - GAP * 0.5; x += GAP) {
        dots.push({
          x: x,
          y: y,
          phase: Math.random() * Math.PI * 2,
          speed: SPEED_MIN + Math.random() * (SPEED_MAX - SPEED_MIN)
        });
      }
      row++;
    }
  }

  function resize() {
    var rect = canvas.getBoundingClientRect();
    cssW = Math.max(1, rect.width);
    cssH = Math.max(1, rect.height);
    dpr = Math.max(1, window.devicePixelRatio || 1);
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); // disegno in coordinate CSS
    buildGrid();
  }

  // Onda triangolare 0→1→0 su una fase normalizzata.
  function triangle(p) {
    var t = p - Math.floor(p);          // 0..1
    return t < 0.5 ? t * 2 : 2 - t * 2; // sale poi scende
  }

  function frame(now) {
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.globalAlpha = OPACITY;
    ctx.fillStyle = COLOR;

    var t = now * SPEED_SCALE;
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      // fase propria del puntino → alpha triangolare 0.12..1
      var w = triangle(d.phase + t * d.speed);
      var a = 0.12 + w * 0.88;

      ctx.globalAlpha = OPACITY * a;
      // "Accende" il bagliore solo quando il puntino è luminoso.
      if (w > 0.6) {
        ctx.shadowBlur = GLOW_BLUR * w;
        ctx.shadowColor = GLOW;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(d.x, d.y, RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }

  var reduce = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  resize();
  window.addEventListener('resize', resize);

  if (reduce) {
    // Stato statico: un singolo frame senza animazione.
    ctx.globalAlpha = OPACITY * 0.55;
    ctx.fillStyle = COLOR;
    for (var j = 0; j < dots.length; j++) {
      ctx.beginPath();
      ctx.arc(dots[j].x, dots[j].y, RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  } else {
    requestAnimationFrame(frame);
  }
})();
