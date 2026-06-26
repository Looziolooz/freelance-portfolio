/* Spinning globe for the fourth bento cell. Uses the real cobe WebGL library
   (loaded as a module in index.html and parked on window.__cobe). cobe paints a
   GPU globe onto a <canvas>; we auto-rotate it with a small phi increment each
   frame and tilt it slightly so it peeks out of the cell corner. If cobe never
   arrives (offline / blocked), we flag the wrapper so the CSS fallback globe shows.
   The play button is wired only to feel alive in the preview — it has no real video. */
(function () {
  function initGlobe() {
    var wrap = document.querySelector(".globe-wrap");
    var canvas = document.querySelector(".globe-canvas");
    if (!wrap || !canvas) return;

    var createGlobe = window.__cobe;
    if (typeof createGlobe !== "function") {
      wrap.classList.add("is-fallback");
      return;
    }

    var phi = 0;
    var size = 300;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    try {
      createGlobe(canvas, {
        devicePixelRatio: dpr,
        width: size * dpr,
        height: size * dpr,
        phi: 0,
        theta: 0.28,
        dark: 0, // light globe to sit on the parchment canvas
        diffuse: 1.1,
        mapSamples: 16000,
        mapBrightness: 5.4,
        baseColor: [0.184, 0.435, 0.408], // teal #2f6f68
        markerColor: [0.784, 0.592, 0.18], // ochre-gold #c8972e
        glowColor: [0.937, 0.914, 0.863], // parchment glow
        markers: [
          { location: [41.9028, 12.4964], size: 0.06 }, // Roma
          { location: [45.4642, 9.19], size: 0.05 }, // Milano
          { location: [40.8518, 14.2681], size: 0.045 }, // Napoli
          { location: [48.8566, 2.3522], size: 0.05 }, // Parigi
          { location: [51.5074, -0.1278], size: 0.05 }, // Londra
          { location: [40.7128, -74.006], size: 0.05 }, // New York
          { location: [59.3293, 18.0686], size: 0.045 } // Stoccolma
        ],
        onRender: function (state) {
          state.phi = phi;
          phi += 0.006;
        }
      });
    } catch (e) {
      wrap.classList.add("is-fallback");
    }
  }

  // The cobe module may resolve before or after this IIFE runs.
  if (window.__cobe !== undefined) {
    initGlobe();
  } else {
    window.addEventListener("cobe:ready", initGlobe, { once: true });
    // Safety net: if the module event never fires, fall back after a moment.
    setTimeout(function () {
      var wrap = document.querySelector(".globe-wrap");
      if (wrap && !wrap.querySelector(".globe-canvas").width) initGlobe();
    }, 2500);
  }

  // Play button micro-interaction (no real video in the preview).
  var thumb = document.querySelector(".thumb");
  if (thumb) {
    thumb.addEventListener("click", function () {
      thumb.classList.toggle("is-playing");
    });
  }
})();
