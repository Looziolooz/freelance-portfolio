/* Globe3D (vanilla port). Plain three.js recreation of the Aceternity Globe:
   a textured Earth (blue-marble color + topology bump), a soft teal/forest
   atmosphere shell, slow auto-rotation, drag-to-rotate, and marker pins (a thin
   line from the surface to a small gold dot) at European/Italian client cities.
   No R3F, no OrbitControls — drag is hand-rolled so the preview has zero extra
   deps beyond the three.js global loaded in index.html. */
(function () {
  if (typeof THREE === 'undefined') {
    console.error('[globe-3d] THREE global not found — CDN script missing.');
    return;
  }

  var canvas = document.querySelector('.globe-canvas');
  var stage = document.querySelector('.globe-stage');
  var loadingEl = document.querySelector('[data-globe-loading]');
  if (!canvas || !stage) return;

  /* ---- Config (mirrors the R3F component's props) ---- */
  var CONFIG = {
    autoRotateSpeed: 0.0016,        // radians per frame
    bumpScale: 0.012,
    atmosphereColor: 0x2f6f68,      // teal, with a forest undertone
    markerColor: 0xc8972e,          // ochre gold
    globeRadius: 1
  };

  /* European + Italian client cities (lat, lng, label). */
  var MARKERS = [
    { lat: 45.46, lng: 9.19,   label: 'Milano' },
    { lat: 41.90, lng: 12.50,  label: 'Roma' },
    { lat: 45.07, lng: 7.69,   label: 'Torino' },
    { lat: 51.51, lng: -0.13,  label: 'London' },
    { lat: 48.86, lng: 2.35,   label: 'Paris' },
    { lat: 59.33, lng: 18.07,  label: 'Stockholm' },
    { lat: 40.42, lng: -3.70,  label: 'Madrid' }
  ];

  var TEX = {
    map: 'https://unpkg.com/three-globe@2.31.0/example/img/earth-blue-marble.jpg',
    bump: 'https://unpkg.com/three-globe@2.31.0/example/img/earth-topology.png'
  };

  /* ---- lat/lng -> vec3 on a sphere of radius r ---- */
  function latLngToVec3(lat, lng, r) {
    var phi = (90 - lat) * (Math.PI / 180);
    var theta = (lng + 180) * (Math.PI / 180);
    return new THREE.Vector3(
      -r * Math.sin(phi) * Math.cos(theta),
       r * Math.cos(phi),
       r * Math.sin(phi) * Math.sin(theta)
    );
  }

  /* ---- Renderer / scene / camera ---- */
  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true               // transparent — the parchment shows through
  });
  renderer.setClearColor(0x000000, 0);
  if ('outputColorSpace' in renderer) renderer.outputColorSpace = THREE.SRGBColorSpace;

  var scene = new THREE.Scene();

  var camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
  camera.position.set(0, 0, 3.4);

  /* group we spin (globe + markers ride together) */
  var world = new THREE.Group();
  // A gentle initial tilt so Europe faces the viewer and the axis reads as Earth-like.
  world.rotation.x = 0.32;
  world.rotation.y = -1.7;
  scene.add(world);

  /* ---- Lights ---- */
  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  var key = new THREE.DirectionalLight(0xfff4e0, 1.15);
  key.position.set(-2.2, 1.4, 2.6);
  scene.add(key);
  var rim = new THREE.DirectionalLight(0x2f6f68, 0.5);   // teal rim
  rim.position.set(2.4, -0.6, -2.0);
  scene.add(rim);

  /* ---- Globe (placeholder material until textures load) ---- */
  var globeGeo = new THREE.SphereGeometry(CONFIG.globeRadius, 64, 64);
  var globeMat = new THREE.MeshPhongMaterial({
    color: 0x14304a,           // deep ocean fallback if textures fail
    shininess: 8,
    specular: 0x16331f
  });
  var globe = new THREE.Mesh(globeGeo, globeMat);
  world.add(globe);

  /* ---- Atmosphere shell (back-side glow, additive) ---- */
  var atmoMat = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color(CONFIG.atmosphereColor) } },
    vertexShader: [
      'varying vec3 vN;',
      'void main(){',
      '  vN = normalize(normalMatrix * normal);',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);',
      '}'
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 uColor;',
      'varying vec3 vN;',
      'void main(){',
      '  float i = pow(0.62 - dot(vN, vec3(0.0,0.0,1.0)), 2.4);',
      '  gl_FragColor = vec4(uColor, 1.0) * clamp(i, 0.0, 1.0);',
      '}'
    ].join('\n'),
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false
  });
  var atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(CONFIG.globeRadius * 1.18, 48, 48),
    atmoMat
  );
  world.add(atmosphere);

  /* ---- Markers: a thin line from surface outward + a small gold dot ---- */
  var PIN_LEN = 0.16;
  var dotGeo = new THREE.SphereGeometry(0.018, 16, 16);
  var dotMat = new THREE.MeshBasicMaterial({ color: CONFIG.markerColor });
  var lineMat = new THREE.LineBasicMaterial({
    color: CONFIG.markerColor, transparent: true, opacity: 0.7
  });

  MARKERS.forEach(function (m) {
    var base = latLngToVec3(m.lat, m.lng, CONFIG.globeRadius * 1.001);
    var tip = latLngToVec3(m.lat, m.lng, CONFIG.globeRadius + PIN_LEN);

    var lineGeo = new THREE.BufferGeometry().setFromPoints([base, tip]);
    world.add(new THREE.Line(lineGeo, lineMat));

    var dot = new THREE.Mesh(dotGeo, dotMat);
    dot.position.copy(tip);
    world.add(dot);

    // faint halo ring around each dot for a softer "pin" read
    var halo = new THREE.Mesh(
      new THREE.SphereGeometry(0.034, 16, 16),
      new THREE.MeshBasicMaterial({
        color: CONFIG.markerColor, transparent: true, opacity: 0.18, depthWrite: false
      })
    );
    halo.position.copy(tip);
    world.add(halo);
  });

  /* ---- Texture load (async; bump applied once both arrive) ---- */
  var loader = new THREE.TextureLoader();
  loader.setCrossOrigin('anonymous');

  function finishLoading() {
    if (loadingEl) {
      loadingEl.classList.add('is-hidden');
      setTimeout(function () { if (loadingEl && loadingEl.parentNode) loadingEl.parentNode.removeChild(loadingEl); }, 600);
    }
  }

  loader.load(TEX.map, function (mapTex) {
    if ('colorSpace' in mapTex) mapTex.colorSpace = THREE.SRGBColorSpace;
    globeMat.map = mapTex;
    globeMat.color.set(0xffffff);
    globeMat.needsUpdate = true;
    finishLoading();

    loader.load(TEX.bump, function (bumpTex) {
      globeMat.bumpMap = bumpTex;
      globeMat.bumpScale = CONFIG.bumpScale;
      globeMat.needsUpdate = true;
    }, undefined, function () {
      console.warn('[globe-3d] bump map failed — continuing without relief.');
    });
  }, undefined, function () {
    // Color map failed: keep the shaded fallback sphere so the scene still reads.
    console.warn('[globe-3d] earth map failed — using procedural fallback sphere.');
    globeMat.color.set(0x1f4d3a);
    finishLoading();
  });

  /* ---- Drag-to-rotate (hand-rolled; no OrbitControls) ---- */
  var dragging = false, lastX = 0, lastY = 0;
  var velY = 0, velX = 0;             // momentum after release
  var manualY = 0, manualX = 0;       // user-accumulated offsets

  function onDown(x, y) { dragging = true; lastX = x; lastY = y; velY = velX = 0; }
  function onMove(x, y) {
    if (!dragging) return;
    var dx = x - lastX, dy = y - lastY;
    lastX = x; lastY = y;
    velY = dx * 0.005;
    velX = dy * 0.005;
    manualY += velY;
    manualX += velX;
    manualX = Math.max(-0.9, Math.min(0.9, manualX));   // clamp pole tilt
  }
  function onUp() { dragging = false; }

  canvas.addEventListener('mousedown', function (e) { onDown(e.clientX, e.clientY); });
  window.addEventListener('mousemove', function (e) { onMove(e.clientX, e.clientY); });
  window.addEventListener('mouseup', onUp);
  canvas.addEventListener('touchstart', function (e) {
    if (e.touches[0]) onDown(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  canvas.addEventListener('touchmove', function (e) {
    if (e.touches[0]) { onMove(e.touches[0].clientX, e.touches[0].clientY); e.preventDefault(); }
  }, { passive: false });
  canvas.addEventListener('touchend', onUp, { passive: true });

  /* ---- Resize (size to the square stage, capped DPR) ---- */
  function resize() {
    var size = stage.clientWidth || canvas.clientWidth || 480;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(size, size, false);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener('resize', resize);

  /* ---- Animation loop ---- */
  var reduceMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function tick() {
    if (!dragging) {
      // momentum decay, then fall back to a slow steady auto-spin
      velY *= 0.94; velX *= 0.94;
      manualY += velY; manualX += velX;
      manualX = Math.max(-0.9, Math.min(0.9, manualX));
      if (!reduceMotion) manualY += CONFIG.autoRotateSpeed;
    }
    world.rotation.y = -1.7 + manualY;
    world.rotation.x = 0.32 + manualX;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  }
  tick();
})();
