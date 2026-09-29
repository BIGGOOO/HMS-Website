const header = document.querySelector('.site-header');
const form = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');
const navToggle = document.querySelector('#navToggle');
const mobileNav = document.querySelector('#mobileNav');

// --- Lead capture configuration -------------------------------------------
// Point this at your CRM/email/backend endpoint to submit leads directly
// (it will receive a JSON POST of the form fields). Leave it empty and the
// form falls back to opening the visitor's email client with the request
// prefilled, so it is functional even before a backend is connected.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'hello@sehaone.example';
// ---------------------------------------------------------------------------

window.addEventListener('scroll', () => {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
});

function closeMobileNav() {
  mobileNav.hidden = true;
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = isOpen;
  navToggle.setAttribute('aria-expanded', String(!isOpen));
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMobileNav();
});

document.addEventListener('click', (event) => {
  if (!mobileNav.hidden && !mobileNav.contains(event.target) && !navToggle.contains(event.target)) {
    closeMobileNav();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth >= 900) closeMobileNav();
});

const scaleTabs = document.querySelectorAll('.scale-tab');
const scaleCopy = document.querySelector('#scaleCopy');

scaleTabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    scaleTabs.forEach((other) => {
      other.classList.remove('is-active');
      other.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('is-active');
    tab.setAttribute('aria-selected', 'true');
    scaleCopy.textContent = tab.dataset.copy;
  });
});

const promoCard = document.querySelector('#promoCard');
const promoClose = document.querySelector('#promoClose');
const PROMO_DISMISSED_KEY = 'sehaone-promo-dismissed';

function dismissPromo() {
  promoCard.hidden = true;
  sessionStorage.setItem(PROMO_DISMISSED_KEY, '1');
}

if (!sessionStorage.getItem(PROMO_DISMISSED_KEY)) {
  promoCard.hidden = false;
}

promoClose.addEventListener('click', dismissPromo);

function showFormMessage(text, isError = false) {
  formMessage.textContent = text;
  formMessage.classList.toggle('is-error', isError);
  formMessage.classList.add('is-visible');
}

async function submitToEndpoint(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Submission failed with status ${response.status}`);
  }
}

function openMailFallback(data) {
  const subject = encodeURIComponent(`Discovery call request — ${data.organisation}`);
  const body = encodeURIComponent(
    `Work email: ${data.email}\nOrganisation: ${data.organisation}\nLooking to improve: ${data.interest}`,
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  if (!FORM_ENDPOINT) {
    openMailFallback(data);
    showFormMessage('Opening your email client with this request. Set FORM_ENDPOINT in app.js to submit straight to your CRM instead.');
    form.reset();
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  try {
    await submitToEndpoint(data);
    showFormMessage('Thank you. Our team will follow up shortly.');
    form.reset();
  } catch (error) {
    showFormMessage(`We could not send this automatically. Please email us at ${CONTACT_EMAIL} instead.`, true);
  } finally {
    submitButton.disabled = false;
  }
});
