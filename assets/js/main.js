/* ── MOBILE NAV TOGGLE ── */
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* ── ACTIVE NAV LINK ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a:not(.nav-book)').forEach(link => {
  const linkPage = link.getAttribute('href');
  if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
    link.classList.add('active');
  }
});

/* ── CONTACT FORM SUCCESS STATE ── */
const contactForm = document.querySelector('.contact-form');
const formSuccess = document.querySelector('.form-success');

if (contactForm && formSuccess) {
  // Netlify redirects back with ?submitted=true on success
  if (window.location.search.includes('submitted=true')) {
    contactForm.style.display = 'none';
    formSuccess.classList.add('visible');
  }
}

/* ── ACCEPTING NEW PATIENTS STATUS ── */
fetch('/api/status')
  .then(r => r.json())
  .then(data => {
    if (!data.acceptingNewPatients) {
      const banner = document.getElementById('status-banner');
      if (banner) {
        banner.innerHTML = `${data.messageText} <a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.urlText}</a>.`;
        banner.removeAttribute('hidden');
      }

      document.querySelectorAll('.free-consult-cta').forEach(link => {
        link.textContent = 'Send a message \u2192';
        link.href = 'contact.html';
        link.removeAttribute('target');
        link.removeAttribute('rel');
      });

      document.querySelectorAll('.new-patient-text').forEach(el => {
        el.textContent = 'Krissy is not currently accepting new clients — contact her to ask about future availability.';
      });
    }

    if (data.noticeBanner && data.noticeBannerText) {
      const notice = document.getElementById('notice-banner');
      if (notice) {
        notice.textContent = data.noticeBannerText;
        notice.removeAttribute('hidden');
      }
    }
  })
  .catch(() => { /* fail silently — default behaviour is accepting */ });
