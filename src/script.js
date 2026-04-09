// Ambil elemen-elemen DOM yang dibutuhkan
const menu = document.getElementById('mobile-menu');
const btn = document.getElementById('menu-btn');
const burgerIcon = document.getElementById('burger-icon');
const closeIcon = document.getElementById('close-icon');
const navbar = document.getElementById('main-nav');
const DESKTOP_BREAKPOINT = 1024; // sesuai breakpoint lg di Tailwind

// Jaga-jaga, Hentikan script jika ada elemen yang tidak ditemukan
if (!menu || !btn || !burgerIcon || !closeIcon || !navbar) {
  console.warn(
    'Navigation: satu atau lebih elemen tidak ditemukan. Script dihentikan.'
  );
} else {
  // ===== HELPER FUNCTIONS =====
  function closeMenu() {
    menu.classList.add('hidden');
    menu.classList.remove('flex', 'flex-col');
    document.body.classList.remove('overflow-hidden');
    burgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
  }

  function openMenu() {
    const navHeight = navbar.getBoundingClientRect().bottom;
    menu.style.top = navHeight + 'px';
    menu.classList.remove('hidden');
    menu.classList.add('flex', 'flex-col');
    document.body.classList.add('overflow-hidden');
    burgerIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');
    btn.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');

    //supaya fokus langsung ke link pertama di menu saat dibuka, untuk aksesibilitas
    const firstLink = menu.querySelector('a[href], button:not([disabled])');
    if (firstLink) firstLink.focus();
  }

  // ===== TOGGLE MENU =====
  // Buka atau tutup mobile menu saat tombol burger diklik
  btn.addEventListener('click', () => {
    const isOpen = !menu.classList.contains('hidden');
    isOpen ? closeMenu() : openMenu();
  });

  // Supaya tombol Enter dan Space bisa akses toggle menu juga
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      btn.click();
    }
  });

  // ===== SCROLL HELPER =====
  // Scroll smooth ke section tertentu berdasarkan ID-nya
  function scrollToSection(targetId) {
    const targetElement = document.getElementById(targetId);
    if (!targetElement) return;

    // Dapatkan tinggi navbar untuk menghindari overlap saat scroll
    const navHeight = navbar.getBoundingClientRect().height;

    // Hitung posisi scroll dengan memperhitungkan tinggi navbar agar section tidak tertutup
    const top =
      targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' }); // Scroll dengan animasi smooth

    const isMenuOpen = !menu.classList.contains('hidden');
    if (isMenuOpen) closeMenu();
  }

  // ===== SCROLL: data-scroll-target buttons =====
  // Tombol "Contact Us" dan "Let's Talk"
  document.querySelectorAll('[data-scroll-target]').forEach((button) => {
    button.addEventListener('click', () => {
      scrollToSection(button.getAttribute('data-scroll-target'));
    });
  });

  // ===== SCROLL: nav links =====
  // Link "About", "Service", "Our Work", "Team" di navbar
  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection(link.getAttribute('href').substring(1));
    });
  });

  // ===== AUTO-CLOSE MENU SAAT LAYAR DIPERBESAR =====
  // Tutup mobile menu otomatis jika layar diperbesar ke ukuran desktop
  window.addEventListener('resize', () => {
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT; // Cek apakah sudah di breakpoint desktop
    const isMenuOpen = !menu.classList.contains('hidden');
    if (isDesktop && isMenuOpen) closeMenu();
  });

  // ===== FOCUS TRAP + ESCAPE KEY =====
  // Dipasang di document agar Escape selalu terpicu,
  // tidak peduli fokus sedang di mana
  document.addEventListener('keydown', (e) => {
    const isMenuOpen = !menu.classList.contains('hidden');
    if (!isMenuOpen) return;

    const menuFocusables = Array.from(
      menu.querySelectorAll('a[href], button:not([disabled])')
    );
    const focusableElements = [btn, ...menuFocusables]; // btn = tombol burger
    const firstElement = focusableElements[0]; // → btn
    const lastElement = focusableElements[focusableElements.length - 1]; // → "Contact Us"

    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          // Shift + Tab di first element
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          // Tab di last element
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    if (e.key === 'Escape') {
      // Tutup menu saat Escape ditekan
      closeMenu();
      btn.focus();
    }
  });
}
