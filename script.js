// ─── Mobile Nav Toggle ────────────────────────────
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
    }
  });
}

// ─── FAQ Accordion ────────────────────────────────
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  if (!btn || !answer) return;

  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      const a = i.querySelector('.faq-answer');
      if (a) a.style.maxHeight = null;
    });
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ─── Scroll Fade-in ───────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ─── Navbar scroll shadow ─────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,0.4)' : 'none';
  });
}

// ─── Language Switcher ────────────────────────────
function applyLang(lang) {
  if (typeof T === 'undefined') return;
  const dict = T[lang];
  if (!dict) return;

  // Update text nodes
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (dict[key] !== undefined) el.textContent = dict[key];
  });

  // Update innerHTML (for gradient spans etc.)
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.dataset.i18nHtml;
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });

  // RTL for Arabic
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lang;

  // Update active button
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });

  localStorage.setItem('sv-lang', lang);
}

document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => applyLang(btn.dataset.lang));
});

// Apply saved or default language on load
const savedLang = localStorage.getItem('sv-lang') || 'en';
applyLang(savedLang);

// ─── Per-Card Billing Toggle ──────────────────────
document.querySelectorAll('.card-bill-toggle').forEach(toggle => {
  toggle.querySelectorAll('.cbill').forEach(btn => {
    btn.addEventListener('click', function () {
      const card = this.closest('.pricing-card');
      const isYearly = this.dataset.p === 'yearly';

      // Update active pill
      toggle.querySelectorAll('.cbill').forEach(b => b.classList.remove('cbill-active'));
      this.classList.add('cbill-active');

      // Update price amount
      const amountEl = card.querySelector('.amount');
      if (amountEl) amountEl.textContent = isYearly ? amountEl.dataset.yearly : amountEl.dataset.monthly;

      // Update period text
      const periodEl = card.querySelector('.period');
      if (periodEl) {
        const lang = localStorage.getItem('sv-lang') || 'en';
        const dict = (typeof T !== 'undefined' && T[lang]) ? T[lang] : {};
        periodEl.textContent = isYearly
          ? (dict['billing.yearly'] ? '/ ' + dict['billing.yearly'].toLowerCase().replace('annuel','an').replace('سنوي','سنة') : '/ year')
          : '/ month';
        // Simple approach: just set directly
        periodEl.textContent = isYearly ? '/ year' : '/ month';
      }

      // Show/hide "or X / year" sub-line
      const yearlyEl = card.querySelector('.card-yearly');
      if (yearlyEl) yearlyEl.style.display = isYearly ? 'none' : '';

      // Update WhatsApp button links
      card.querySelectorAll('a[data-monthly]').forEach(a => {
        a.href = isYearly ? a.dataset.yearly : a.dataset.monthly;
      });
    });
  });
});
