/* Cursor-following spotlight reveal. A radial-gradient is painted into an
   off-screen canvas each frame, then used as an alpha mask on the reveal image,
   so the second photo shows only inside the soft glowing circle that trails the
   cursor with eased (lerped) motion. */
(function () {
  var SPOTLIGHT_R = 260;

  var canvas = document.querySelector('.reveal-canvas');
  var revealImg = document.querySelector('.reveal-img');
  if (!canvas || !revealImg) return;

  var ctx = canvas.getContext('2d');
  var mouse = { x: -999, y: -999 };
  var smooth = { x: -999, y: -999 };

  function sizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  sizeCanvas();
  window.addEventListener('resize', sizeCanvas);

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var g = ctx.createRadialGradient(smooth.x, smooth.y, 0, smooth.x, smooth.y, SPOTLIGHT_R);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,1)');
    g.addColorStop(0.6, 'rgba(255,255,255,0.75)');
    g.addColorStop(0.75, 'rgba(255,255,255,0.4)');
    g.addColorStop(0.88, 'rgba(255,255,255,0.12)');
    g.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(smooth.x, smooth.y, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();

    var url = canvas.toDataURL();
    revealImg.style.webkitMaskImage = 'url(' + url + ')';
    revealImg.style.maskImage = 'url(' + url + ')';
    revealImg.style.webkitMaskSize = '100% 100%';
    revealImg.style.maskSize = '100% 100%';
    revealImg.style.webkitMaskRepeat = 'no-repeat';
    revealImg.style.maskRepeat = 'no-repeat';
  }

  function loop() {
    smooth.x += (mouse.x - smooth.x) * 0.1;
    smooth.y += (mouse.y - smooth.y) * 0.1;
    draw();
    requestAnimationFrame(loop);
  }
  loop();
})();
