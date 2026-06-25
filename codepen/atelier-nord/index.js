/* Animated hamburger toggle. Tapping the burger flips the .is-open state on the
   root, which (via CSS) cross-fades the menu/X icons and slides the full-screen
   overlay down. Any link or CTA inside the overlay closes it again. */
(function () {
  var root = document.querySelector('.an-root');
  var burger = document.querySelector('.an-burger');
  if (!root || !burger) return;

  burger.addEventListener('click', function () {
    root.classList.toggle('is-open');
  });

  var closers = document.querySelectorAll('.an-mobile-link, .an-mobile-cta');
  for (var i = 0; i < closers.length; i++) {
    closers[i].addEventListener('click', function () {
      root.classList.remove('is-open');
    });
  }
})();
