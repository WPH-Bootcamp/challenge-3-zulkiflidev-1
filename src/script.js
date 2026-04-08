const menu = document.getElementById('mobile-menu');
const btn = document.getElementById('menu-btn');
const burgerIcon = document.getElementById('burger-icon');
const closeIcon = document.getElementById('close-icon');
const navbar = document.getElementById('main-nav');

// ===== TOGGLE MENU =====
btn.addEventListener('click', () => {
  const isOpen = !menu.classList.contains('hidden');

  if (isOpen) {
    menu.classList.add('hidden');
    menu.classList.remove('flex'); // fix: prevent flex class accumulation
    document.body.classList.remove('overflow-hidden');
    burgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
  } else {
    const navHeight = navbar.getBoundingClientRect().bottom;
    menu.style.top = navHeight + 'px';
    menu.classList.remove('hidden');
    menu.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    burgerIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
  }
});

btn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    btn.click();
  }
});

// ===== SCROLL HELPER =====
function scrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return;

  targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const isMenuOpen = !menu.classList.contains('hidden');
  if (isMenuOpen) btn.click();
}

// ===== SCROLL: data-target buttons =====
document.querySelectorAll('[data-target]').forEach((button) => {
  button.addEventListener('click', () => {
    scrollToSection(button.getAttribute('data-target'));
  });
});

// ===== SCROLL: nav links =====
document.querySelectorAll('.js-nav-link').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    scrollToSection(link.getAttribute('href').substring(1));
  });
});
