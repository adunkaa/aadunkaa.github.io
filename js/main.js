// menu
var navbar = document.getElementById('navbar');
var hamburger = document.querySelector('.nav-hamburger');
var mobileMenu = document.querySelector('.nav-mobile');

window.addEventListener('scroll', function() {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  if (mobileMenu.classList.contains('open')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

var mobileLinks = document.querySelectorAll('.nav-mobile a');
mobileLinks.forEach(function(link) {
  link.addEventListener('click', function() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});
