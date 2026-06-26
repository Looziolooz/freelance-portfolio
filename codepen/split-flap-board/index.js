/* Split-Flap Board — vanilla port of the React TextFlippingBoard for the looping
   preview. Same model as the original: a BOARD_ROWS x BOARD_COLS grid of cells,
   each scrambling through random FLAP_CHARS then settling on its target glyph.
   Per-cell start delay staggers across columns then rows; every character change
   does a mechanical flip (top leaf rotates down to reveal the new glyph). ~20% of
   scramble steps flash a brand accent. {G}{O}{T}{S}{W} render as solid color
   tiles. Messages are word-wrapped to the grid, centered, and cycled every 6s.
   Web Animations API drives the flip; no dependencies. */
(function () {
  var BOARD_ROWS = 6;
  var BOARD_COLS = 22;
  var FLAP_CHARS =
    " ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$()-+&=;:'\"%,./?°";

  // Timing.
  var COL_DELAY = 30; // ms added per column to the start delay
  var ROW_DELAY = 20; // ms added per row to the start delay
  var STEP_INTERVAL = 55; // ms between scramble steps
  var FLASH_CHANCE = 0.2; // share of scramble steps that flash an accent
  var FLIP_MS = 130; // duration of one mechanical flip
  var CYCLE_MS = 6000; // time each message stays before the next

  // Brand accent palette: [fill, ink-on-fill].
  var ACCENTS = [
    ["#c8972e", "#26221d"], // gold — dark text
    ["#1f4d3a", "#f4efe4"], // forest — light text
    ["#2f6f68", "#f4efe4"], // teal — light text
    ["#b85c34", "#f4efe4"], // terracotta — light text
    ["#8a9a6b", "#26221d"]  // sage — dark text
  ];
  // Color tile tokens -> solid square color.
  var COLOR_MAP = {
    G: "#1f4d3a",
    O: "#c8972e",
    T: "#2f6f68",
    S: "#8a9a6b",
    W: "#f4efe4"
  };

  // Italian departure-board lines for founders / PMI. Accent-free on purpose:
  // the charset carries no accented glyphs. \n forces a line break.
  var MESSAGES = [
    "DESTINAZIONE\nCRESCITA",
    "IMBARCO IMMEDIATO\nPER IL TUO SITO",
    "MENO RUMORE\nPIU VENDITE",
    "DAL BRAND\nAL FATTURATO",
    "PROSSIMA PARTENZA\nLORENZO STUDIO"
  ];

  var grid = document.querySelector(".sfb-grid");
  if (!grid) return;

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function randomFlapChar() {
    return FLAP_CHARS.charAt(Math.floor(Math.random() * FLAP_CHARS.length));
  }

  // ---------- Build the cell grid once ----------
  var cells = []; // flat array, row-major
  for (var r = 0; r < BOARD_ROWS; r += 1) {
    for (var c = 0; c < BOARD_COLS; c += 1) {
      var cell = document.createElement("div");
      cell.className = "sfb-cell";

      var topHalf = document.createElement("div");
      topHalf.className = "sfb-half sfb-half-top";
      var topGlyph = document.createElement("div");
      topGlyph.className = "sfb-glyph";
      topHalf.appendChild(topGlyph);

      var botHalf = document.createElement("div");
      botHalf.className = "sfb-half sfb-half-bottom";
      var botGlyph = document.createElement("div");
      botGlyph.className = "sfb-glyph";
      botHalf.appendChild(botGlyph);

      cell.appendChild(topHalf);
      cell.appendChild(botHalf);
      grid.appendChild(cell);

      cells.push({
        el: cell,
        topGlyph: topGlyph,
        botGlyph: botGlyph,
        row: r,
        col: c,
        current: " ",
        timer: null,
        anim: null
      });
    }
  }

  function setGlyph(cell, ch) {
    cell.topGlyph.textContent = ch;
    cell.botGlyph.textContent = ch;
    cell.current = ch;
  }

  function clearTile(cell) {
    cell.el.classList.remove("is-tile");
    cell.el.style.removeProperty("background");
    cell.el.style.removeProperty("color");
  }

  function applyTile(cell, color) {
    cell.el.classList.add("is-tile");
    cell.el.style.background = color;
    // Light tiles keep dark ink; dark tiles flip ink to parchment.
    cell.el.style.color = color === "#f4efe4" ? "#2b2a26" : "#f4efe4";
    setGlyph(cell, " ");
  }

  function flash(cell, on) {
    if (on) {
      var a = ACCENTS[Math.floor(Math.random() * ACCENTS.length)];
      cell.el.style.setProperty("--flash", a[0]);
      cell.el.style.setProperty("--flash-ink", a[1]);
      cell.el.classList.add("is-flash");
    } else {
      cell.el.classList.remove("is-flash");
    }
  }

  // One mechanical flip: the top leaf shows the OLD glyph and rotates down,
  // revealing the static halves (already set to the NEW glyph); a bottom leaf
  // rises to seat the new glyph. Falls back to an instant swap without WAAPI.
  function flip(cell, newChar) {
    var oldChar = cell.current;
    setGlyph(cell, newChar); // static halves now show the new glyph

    if (reduceMotion || typeof cell.el.animate !== "function" || oldChar === newChar) {
      return;
    }

    // Top leaf: old glyph, top half, rotates 0 -> -90 about its bottom edge.
    var leafTop = document.createElement("div");
    leafTop.className = "sfb-leaf sfb-leaf-top";
    var lt = document.createElement("div");
    lt.className = "sfb-glyph";
    lt.style.alignSelf = "flex-start";
    lt.textContent = oldChar;
    leafTop.appendChild(lt);

    // Bottom leaf: new glyph, bottom half, rises 90 -> 0 about its top edge.
    var leafBot = document.createElement("div");
    leafBot.className = "sfb-leaf sfb-leaf-bottom";
    var lb = document.createElement("div");
    lb.className = "sfb-glyph";
    lb.style.alignSelf = "flex-end";
    lb.textContent = newChar;
    leafBot.appendChild(lb);

    cell.el.appendChild(leafTop);
    cell.el.appendChild(leafBot);

    var ease = "cubic-bezier(0.36, 0, 0.66, -0.2)";
    var aTop = leafTop.animate(
      [{ transform: "rotateX(0deg)" }, { transform: "rotateX(-90deg)" }],
      { duration: FLIP_MS * 0.55, easing: ease, fill: "forwards" }
    );
    aTop.onfinish = function () {
      if (leafTop.parentNode) leafTop.parentNode.removeChild(leafTop);
      var aBot = leafBot.animate(
        [{ transform: "rotateX(90deg)" }, { transform: "rotateX(0deg)" }],
        { duration: FLIP_MS * 0.45, easing: "cubic-bezier(0.34, 1.2, 0.64, 1)", fill: "forwards" }
      );
      aBot.onfinish = function () {
        if (leafBot.parentNode) leafBot.parentNode.removeChild(leafBot);
      };
    };
  }

  // ---------- Target grid from a message ----------
  // Word-wrap each line to BOARD_COLS, then center the block vertically and each
  // line horizontally. Returns a BOARD_ROWS x BOARD_COLS array of target chars.
  function layout(message) {
    var rawLines = message.split("\n");
    var wrapped = [];
    for (var i = 0; i < rawLines.length; i += 1) {
      var words = rawLines[i].split(/\s+/).filter(Boolean);
      var line = "";
      for (var w = 0; w < words.length; w += 1) {
        var word = words[w];
        if (!line.length) {
          line = word;
        } else if (line.length + 1 + word.length <= BOARD_COLS) {
          line += " " + word;
        } else {
          wrapped.push(line);
          line = word;
        }
      }
      if (line.length || words.length === 0) wrapped.push(line);
    }
    if (wrapped.length > BOARD_ROWS) wrapped = wrapped.slice(0, BOARD_ROWS);

    var topPad = Math.floor((BOARD_ROWS - wrapped.length) / 2);
    var target = [];
    for (var r = 0; r < BOARD_ROWS; r += 1) {
      var rowChars = [];
      var src = r - topPad;
      var text = src >= 0 && src < wrapped.length ? wrapped[src] : "";
      var leftPad = Math.floor((BOARD_COLS - text.length) / 2);
      for (var c = 0; c < BOARD_COLS; c += 1) {
        var idx = c - leftPad;
        rowChars.push(idx >= 0 && idx < text.length ? text.charAt(idx) : " ");
      }
      target.push(rowChars);
    }
    return target;
  }

  // ---------- Drive one cell to its target ----------
  function driveCell(cell, targetChar) {
    if (cell.timer) {
      clearTimeout(cell.timer);
      cell.timer = null;
    }
    flash(cell, false);

    // Color tile token: settle straight to a solid color square.
    if (Object.prototype.hasOwnProperty.call(COLOR_MAP, targetChar)) {
      var color = COLOR_MAP[targetChar];
      var tileDelay = cell.col * COL_DELAY + cell.row * ROW_DELAY;
      cell.timer = setTimeout(function () {
        applyTile(cell, color);
      }, tileDelay);
      return;
    }

    clearTile(cell);

    var isSpace = targetChar === " ";
    // Real chars scramble 12-20 steps; spaces a quieter 6-10.
    var steps = isSpace
      ? 6 + Math.floor(Math.random() * 5)
      : 12 + Math.floor(Math.random() * 9);
    var startDelay = cell.col * COL_DELAY + cell.row * ROW_DELAY;
    var step = 0;

    function tick() {
      if (step >= steps) {
        flash(cell, false);
        flip(cell, targetChar);
        cell.timer = null;
        return;
      }
      var ch = isSpace && step > steps - 3 ? " " : randomFlapChar();
      flash(cell, Math.random() < FLASH_CHANCE);
      flip(cell, ch);
      step += 1;
      cell.timer = setTimeout(tick, STEP_INTERVAL);
    }

    cell.timer = setTimeout(tick, startDelay);
  }

  function showMessage(message) {
    var target = layout(message);
    for (var r = 0; r < BOARD_ROWS; r += 1) {
      for (var c = 0; c < BOARD_COLS; c += 1) {
        driveCell(cells[r * BOARD_COLS + c], target[r][c]);
      }
    }
  }

  // Reduced motion: render the first message statically and stop.
  if (reduceMotion) {
    var t0 = layout(MESSAGES[0]);
    for (var rr = 0; rr < BOARD_ROWS; rr += 1) {
      for (var cc = 0; cc < BOARD_COLS; cc += 1) {
        var cell0 = cells[rr * BOARD_COLS + cc];
        var ch0 = t0[rr][cc];
        if (Object.prototype.hasOwnProperty.call(COLOR_MAP, ch0)) {
          applyTile(cell0, COLOR_MAP[ch0]);
        } else {
          setGlyph(cell0, ch0);
        }
      }
    }
    return;
  }

  var msgIndex = 0;
  showMessage(MESSAGES[msgIndex]);
  setInterval(function () {
    msgIndex = (msgIndex + 1) % MESSAGES.length;
    showMessage(MESSAGES[msgIndex]);
  }, CYCLE_MS);
})();
