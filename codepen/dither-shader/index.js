/* DitherShader (anteprima vanilla)
   Carica una foto Unsplash con crossOrigin="anonymous" (CORS permissivo, quindi
   il canvas resta leggibile), la ridisegna a bassa risoluzione su una griglia,
   converte ogni cella in luminanza, applica una matrice di Bayer 8x8 come soglia
   ordinata e mappa il risultato in duotono ink -> parchment. Il canvas è poi
   scalato in CSS con image-rendering:pixelated, così i pixel restano nitidi.
   Stesso algoritmo del componente React descritto nel prompt, ma senza React. */
(function () {
  var SRC = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1280&q=85&fm=webp';

  // Props del componente, fissati qui per il poster on-brand.
  var GRID_SIZE = 3;                 // lato del pixel logico (px sorgente per cella)
  var INVERT = false;
  var THRESHOLD = 0;                 // bias -255..255 sulla soglia Bayer
  var BRIGHTNESS = 6;               // -255..255
  var CONTRAST = 18;               // -255..255
  var PRIMARY = hexToRgb('#26221d');  // ink   -> zone scure
  var SECONDARY = hexToRgb('#f4efe4');// parchment -> zone chiare

  // Matrice di Bayer 8x8 (valori 0..63), normalizzata a 0..1 con +0.5 per
  // centrare la soglia. È il cuore del dithering ordinato.
  var BAYER_8 = [
    [0, 32, 8, 40, 2, 34, 10, 42],
    [48, 16, 56, 24, 50, 18, 58, 26],
    [12, 44, 4, 36, 14, 46, 6, 38],
    [60, 28, 52, 20, 62, 30, 54, 22],
    [3, 35, 11, 43, 1, 33, 9, 41],
    [51, 19, 59, 27, 49, 17, 57, 25],
    [15, 47, 7, 39, 13, 45, 5, 37],
    [63, 31, 55, 23, 61, 29, 53, 21]
  ];
  var BAYER_N = 8;
  var BAYER_DIV = BAYER_N * BAYER_N; // 64

  var canvas = document.querySelector('.dither-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d', { willReadFrequently: true });

  function hexToRgb(hex) {
    var h = hex.replace('#', '');
    return {
      r: parseInt(h.substring(0, 2), 16),
      g: parseInt(h.substring(2, 4), 16),
      b: parseInt(h.substring(4, 6), 16)
    };
  }

  function clamp255(v) { return v < 0 ? 0 : v > 255 ? 255 : v; }

  function render(img) {
    var frame = canvas.parentElement;
    var rect = frame.getBoundingClientRect();
    // Risoluzione logica = area visibile / GRID_SIZE: ogni cella diventa 1 px canvas.
    var lowW = Math.max(2, Math.round(rect.width / GRID_SIZE));
    var lowH = Math.max(2, Math.round(rect.height / GRID_SIZE));

    canvas.width = lowW;
    canvas.height = lowH;

    // Copri la cornice (object-fit: cover) calcolando crop centrato.
    var ir = img.width / img.height;
    var cr = lowW / lowH;
    var sx = 0, sy = 0, sw = img.width, sh = img.height;
    if (ir > cr) { sw = img.height * cr; sx = (img.width - sw) / 2; }
    else { sh = img.width / cr; sy = (img.height - sh) / 2; }

    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, lowW, lowH);

    var image = ctx.getImageData(0, 0, lowW, lowH);
    var d = image.data;

    // Fattore di contrasto standard (range -255..255).
    var cf = (259 * (CONTRAST + 255)) / (255 * (259 - CONTRAST));

    for (var y = 0; y < lowH; y++) {
      for (var x = 0; x < lowW; x++) {
        var i = (y * lowW + x) * 4;

        // Luminanza percettiva, poi brightness + contrasto.
        var lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        lum += BRIGHTNESS;
        lum = cf * (lum - 128) + 128;
        lum = clamp255(lum);

        // Soglia ordinata: confronta la luminanza con la cella Bayer.
        var t = (BAYER_8[y % BAYER_N][x % BAYER_N] + 0.5) / BAYER_DIV; // 0..1
        var threshold = t * 255 + THRESHOLD;
        var on = lum > threshold;       // true -> tono chiaro
        if (INVERT) on = !on;

        var c = on ? SECONDARY : PRIMARY; // duotono a due livelli
        d[i] = c.r; d[i + 1] = c.g; d[i + 2] = c.b; d[i + 3] = 255;
      }
    }

    ctx.putImageData(image, 0, 0);
  }

  var img = new Image();
  img.crossOrigin = 'anonymous'; // necessario per leggere i pixel senza taint
  img.onload = function () {
    render(img);
    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { render(img); }, 120);
    });
  };
  img.onerror = function () {
    // Fallback discreto: tinta parchment piena se l'immagine non carica.
    canvas.width = 4; canvas.height = 5;
    ctx.fillStyle = '#efe9dc';
    ctx.fillRect(0, 0, 4, 5);
  };
  img.src = SRC;
})();
