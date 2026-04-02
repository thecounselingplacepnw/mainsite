/* ── CONTACT FORM MODAL ── */
const contactFormBtn   = document.getElementById('contact-form-btn');
const contactFormModal = document.getElementById('contact-form-modal');
const contactFormClose = document.getElementById('contact-form-close');

if (contactFormBtn && contactFormModal) {
  contactFormBtn.addEventListener('click', () => {
    contactFormModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
  });
  contactFormClose.addEventListener('click', () => {
    contactFormModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
  });
  contactFormModal.addEventListener('click', e => {
    if (e.target === contactFormModal) {
      contactFormModal.setAttribute('hidden', '');
      document.body.style.overflow = '';
    }
  });
}

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
      // Amber status banner
      const banner = document.getElementById('status-banner');
      if (banner) {
        banner.innerHTML = `${data.messageText} <a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.urlText}</a>.`;
        banner.removeAttribute('hidden');
      }

      // Update "new patient" body copy
      document.querySelectorAll('.new-patient-text').forEach(el => {
        el.textContent = 'Krissy is not currently accepting new clients — Check back weekly to see if availability has changed.';
      });

      // Hide all consult/message CTAs site-wide
      document.querySelectorAll('.free-consult-cta, .cta-send-message').forEach(el => {
        el.setAttribute('hidden', '');
      });

      // Contact page: hide widgets, show not-accepting message
      const widgets = document.getElementById('contact-widgets');
      const notAccepting = document.getElementById('contact-not-accepting');
      const notAcceptingMsg = document.getElementById('contact-not-accepting-msg');
      if (widgets && notAccepting && notAcceptingMsg) {
        widgets.setAttribute('hidden', '');
        notAcceptingMsg.innerHTML = `${data.messageText} <a href="${data.url}" target="_blank" rel="noopener noreferrer">${data.urlText}</a>.`;
        notAccepting.removeAttribute('hidden');
      }
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
