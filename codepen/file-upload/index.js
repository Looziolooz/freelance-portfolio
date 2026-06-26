/* file-upload — vanilla port of the Aceternity "FileUpload" behaviour.
   The harness wraps this in DOMContentLoaded, so we run immediately.

   - Drag/drop or click adds files; each one renders as an animated card with
     name, size (MB), type and modified date — same fields as the React card.
   - The .is-dragging class drives the gold drop highlight (handled in CSS).
   - Click with no real file picked simulates a sample Italian-styled file so
     the gallery teaser shows the full interaction even when non-interactive.
   - The upload tile floats on a CSS loop on its own (see .upload-tile), so the
     idle preview already has life before anyone touches it. */
(function () {
  var upload = document.querySelector('.upload');
  var input = document.querySelector('.upload-input');
  var list = document.querySelector('.file-list');
  if (!upload || !list) return;

  // A few sample files cycled through on each simulated click.
  var SAMPLES = [
    { name: 'brief-progetto.pdf', size: 2.4 * 1024 * 1024, type: 'application/pdf' },
    { name: 'logo-studio.svg',    size: 86 * 1024,         type: 'image/svg+xml' },
    { name: 'preventivo-2026.xlsx', size: 1.1 * 1024 * 1024, type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
  ];
  var sampleIndex = 0;

  var MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];

  function formatMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  function formatDate(d) {
    return d.getDate() + ' ' + MESI[d.getMonth()] + ' ' + d.getFullYear();
  }

  function prettyType(mime) {
    if (!mime) return 'file';
    var map = {
      'application/pdf': 'PDF',
      'image/svg+xml': 'SVG',
      'image/png': 'PNG',
      'image/jpeg': 'JPEG',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX'
    };
    if (map[mime]) return map[mime];
    var parts = mime.split('/');
    return (parts[1] || parts[0]).toUpperCase();
  }

  function addCard(file) {
    var modified = file.lastModified ? new Date(file.lastModified) : new Date();

    var card = document.createElement('div');
    card.className = 'file-card';

    var name = document.createElement('span');
    name.className = 'file-name';
    name.textContent = file.name;

    var size = document.createElement('span');
    size.className = 'file-size';
    size.textContent = formatMB(file.size);

    var meta = document.createElement('div');
    meta.className = 'file-meta';

    var type = document.createElement('span');
    type.className = 'file-type';
    type.textContent = prettyType(file.type);

    var date = document.createElement('span');
    date.className = 'file-date';
    date.textContent = 'Modificato ' + formatDate(modified);

    meta.appendChild(type);
    meta.appendChild(date);
    card.appendChild(name);
    card.appendChild(size);
    card.appendChild(meta);
    list.appendChild(card);
  }

  function addSample() {
    var s = SAMPLES[sampleIndex % SAMPLES.length];
    sampleIndex++;
    addCard({ name: s.name, size: s.size, type: s.type, lastModified: Date.now() });
  }

  // ---------- Click to upload (or simulate) ----------
  upload.addEventListener('click', function (e) {
    // Let the native picker open if the visitor clicks; if nothing comes back
    // (e.g. a sandboxed/non-interactive frame), still drop a sample card.
    if (input && e.target !== input) {
      try { input.click(); } catch (err) { /* sandboxed: fall through */ }
    }
    addSample();
  });

  upload.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addSample();
    }
  });

  if (input) {
    input.addEventListener('change', function () {
      var files = Array.prototype.slice.call(input.files || []);
      for (var i = 0; i < files.length; i++) addCard(files[i]);
      input.value = '';
    });
  }

  // ---------- Drag and drop ----------
  ['dragenter', 'dragover'].forEach(function (ev) {
    upload.addEventListener(ev, function (e) {
      e.preventDefault();
      upload.classList.add('is-dragging');
    });
  });

  ['dragleave', 'dragend'].forEach(function (ev) {
    upload.addEventListener(ev, function (e) {
      e.preventDefault();
      if (ev === 'dragleave' && upload.contains(e.relatedTarget)) return;
      upload.classList.remove('is-dragging');
    });
  });

  upload.addEventListener('drop', function (e) {
    e.preventDefault();
    upload.classList.remove('is-dragging');
    var files = e.dataTransfer && e.dataTransfer.files
      ? Array.prototype.slice.call(e.dataTransfer.files)
      : [];
    if (files.length === 0) { addSample(); return; }
    for (var i = 0; i < files.length; i++) addCard(files[i]);
  });
})();
