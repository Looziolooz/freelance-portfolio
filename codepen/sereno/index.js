/* Sereno hero interactions: glassmorphism mobile menu toggle and the inline
   email-capture pill. No framework, no build step, plain DOM. */
(function () {
  var burger = document.querySelector('.nav-burger');
  var menu = document.querySelector('.mobile-menu');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var open = menu.hasAttribute('hidden');
      if (open) {
        menu.removeAttribute('hidden');
      } else {
        menu.setAttribute('hidden', '');
      }
      burger.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
    });

    // Close the menu when a link inside it is tapped.
    menu.querySelectorAll('.mobile-link, .mobile-join').forEach(function (el) {
      el.addEventListener('click', function () {
        menu.setAttribute('hidden', '');
        burger.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  function handleJoin(form) {
    var input = form.querySelector('.email-input');
    var value = input ? input.value.trim() : '';
    if (!value) {
      if (input) input.focus();
      return;
    }
    window.alert('You are on the list: ' + value);
    if (input) input.value = '';
  }

  var emailForm = document.querySelector('.email-pill');
  if (emailForm) {
    emailForm.addEventListener('submit', function (e) {
      e.preventDefault();
      handleJoin(emailForm);
    });
  }

  // The header / menu "Join the list" buttons jump focus to the capture pill.
  document.querySelectorAll('.nav-join, .mobile-join').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var input = document.querySelector('.email-input');
      if (input) input.focus();
    });
  });
})();
