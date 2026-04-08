// Ambil elemen-elemen DOM yang dibutuhkan
const menu = document.getElementById('mobile-menu');
const btn = document.getElementById('menu-btn');
const burgerIcon = document.getElementById('burger-icon');
const closeIcon = document.getElementById('close-icon');
const navbar = document.getElementById('main-nav');

// ===== TOGGLE MENU =====
// Buka atau tutup mobile menu saat tombol burger diklik
btn.addEventListener('click', () => {
  // Cek apakah menu sedang terbuka (tidak memiliki class 'hidden')
  const isOpen = !menu.classList.contains('hidden');

  if (isOpen) {
    // Tutup menu: sembunyikan overlay dan kembalikan tampilan ke semula
    menu.classList.add('hidden');
    menu.classList.remove('flex', 'flex-col');

    // supaya halaman bisa discroll lagi setelah menu ditutup
    document.body.classList.remove('overflow-hidden');

    // Tampilkan ikon burger, sembunyikan ikon close
    burgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');

    // Update atribut aksesibilitas
    btn.setAttribute('aria-expanded', 'false');
  } else {
    // Hitung posisi bawah navbar agar menu mulai tepat di bawahnya
    const navHeight = navbar.getBoundingClientRect().bottom;
    menu.style.top = navHeight + 'px';

    // Buka menu: tampilkan overlay sebagai flex column
    menu.classList.remove('hidden');
    menu.classList.add('flex', 'flex-col');

    // Kunci scroll halaman selama menu terbuka
    document.body.classList.add('overflow-hidden');

    // Tampilkan ikon close, sembunyikan ikon burger
    burgerIcon.classList.add('hidden');
    closeIcon.classList.remove('hidden');

    // Update atribut aksesibilitas
    btn.setAttribute('aria-expanded', 'true');
  }
});

// Supaya tombol enter dan space bisa akses toggle menu juga
btn.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault(); // Cegah scroll halaman saat Space ditekan
    btn.click();
  }
});

// ===== SCROLL HELPER =====
//supaya bisa scroll smooth ke section tertentu berdasarkan ID-nya
function scrollToSection(targetId) {
  const targetElement = document.getElementById(targetId);
  if (!targetElement) return; // Batalkan jika elemen tidak ditemukan

  targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });

  // Jika mobile menu sedang terbuka, tutup otomatis setelah navigasi
  const isMenuOpen = !menu.classList.contains('hidden');
  if (isMenuOpen) btn.click();
}

// ===== SCROLL: data-target buttons =====
// Pasang event listener pada semua tombol dengan atribut "data-scroll-target"
// (contoh: tombol "Contact Us" dan "Let's Talk")
document.querySelectorAll('[data-scroll-target]').forEach((button) => {
  button.addEventListener('click', () => {
    scrollToSection(button.getAttribute('data-scroll-target'));
  });
});

// ===== SCROLL: nav links =====
// Pasang event listener pada semua link navigasi dengan atribut "data-nav-link"
// (contoh: link "About", "Service", "Our Work", "Team" di navbar)
document.querySelectorAll('[data-nav-link]').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    // Ambil ID target dari href, buang karakter '#' di depannya
    scrollToSection(link.getAttribute('href').substring(1));
  });
});

// ===== AUTO-CLOSE MENU SAAT LAYAR DIPERBESAR =====
// Tutup mobile menu otomatis jika layar diperbesar ke ukuran desktop
window.addEventListener('resize', () => {
  const isDesktop = window.innerWidth >= 1024;
  const isMenuOpen = !menu.classList.contains('hidden');

  if (isDesktop && isMenuOpen) {
    menu.classList.add('hidden');
    menu.classList.remove('flex', 'flex-col');
    document.body.classList.remove('overflow-hidden');
    burgerIcon.classList.remove('hidden');
    closeIcon.classList.add('hidden');
    btn.setAttribute('aria-expanded', 'false');
  }
});

// ===== FOCUS TRAP =====
// Pastikan fokus tetap berada di dalam mobile menu saat menu terbuka, dan tombol Escape bisa menutup menu
menu.addEventListener('keydown', (e) => {
  const isMenuOpen = !menu.classList.contains('hidden');
  if (!isMenuOpen) return;

  const focusableElements = menu.querySelectorAll(
    'a[href], button:not([disabled])'
  );
  const firstElement = focusableElements[0]; // Elemen pertama yang bisa difokuskan di menu
  const lastElement = focusableElements[focusableElements.length - 1]; // Elemen terakhir yang bisa difokuskan di menu

  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        // Jika Shift+Tab di elemen pertama, pindahkan fokus ke elemen terakhir
        e.preventDefault(); // Cegah fokus keluar dari menu saat Shift+Tab di elemen pertama
        lastElement.focus(); // Pindahkan fokus ke elemen terakhir
      }
    } else {
      if (document.activeElement === lastElement) {
        // Jika Tab di elemen terakhir, pindahkan fokus ke elemen pertama
        e.preventDefault(); // Cegah fokus keluar dari menu saat Tab di elemen terakhir
        firstElement.focus(); // Pindahkan fokus ke elemen pertama
      }
    }
  }

  if (e.key === 'Escape') {
    // Jika tombol Escape ditekan, tutup menu dan kembalikan fokus ke tombol menu
    btn.click();
    btn.focus();
  }
});
