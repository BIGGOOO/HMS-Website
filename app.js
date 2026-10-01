import { inject } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

inject();
injectSpeedInsights();

const header = document.querySelector('.site-header');
const navToggle = document.querySelector('#navToggle');
const mobileNav = document.querySelector('#mobileNav');
const form = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');
const scaleOptions = document.querySelectorAll('.scale-option');
const scaleCopy = document.querySelector('#scaleCopy');
const scaleCare = document.querySelector('#scaleCare');
const scaleOperations = document.querySelector('#scaleOperations');
const scaleFinance = document.querySelector('#scaleFinance');
const navLinks = document.querySelectorAll('.desktop-nav a');

// Configure these when a CRM, booking tool, or backend endpoint is approved.
const FORM_ENDPOINT = '';
const CONTACT_EMAIL = 'info@theonedigit.com';

const scaleDetails = {
  facility: ['Run one facility\u2019s patient journey\u2014registration through billing\u2014on one connected, governed workspace.', 'Registration \u2192 care \u2192 discharge', 'Live queues and resource status', 'Billing clarity at point of service'],
  network: ['Coordinate shared capacity, services, and operating standards across a multi-site provider network.', 'Consistent workflows across facilities', 'Shared capacity and network visibility', 'Consolidated finance and controls'],
  programme: ['Support decentralised service delivery and programme visibility across public-health operations.', 'Programme pathways across services', 'Field-to-central operational visibility', 'Auditable claims and reporting'],
};

function updateScaleContent(option = document.querySelector('.scale-option.is-active')) {
  const [copy, care, operations, finance] = scaleDetails[option.dataset.scale];
  scaleCopy.textContent = copy;
  scaleCare.textContent = care;
  scaleOperations.textContent = operations;
  scaleFinance.textContent = finance;
}

function closeMobileNav() {
  mobileNav.hidden = true;
  navToggle.setAttribute('aria-expanded', 'false');
}

function updateHeader() {
  header.classList.toggle('is-scrolled', window.scrollY > 18);
}

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

navToggle.addEventListener('click', () => {
  const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
  mobileNav.hidden = isOpen;
  navToggle.setAttribute('aria-expanded', String(!isOpen));
  if (!isOpen) mobileNav.querySelector('a')?.focus();
});

mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !mobileNav.hidden) {
    closeMobileNav();
    navToggle.focus();
  }
});

document.addEventListener('click', (event) => {
  if (!mobileNav.hidden && !mobileNav.contains(event.target) && !navToggle.contains(event.target)) {
    closeMobileNav();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMobileNav();
});

scaleOptions.forEach((option) => {
  option.addEventListener('click', () => {
    scaleOptions.forEach((item) => {
      const selected = item === option;
      item.classList.toggle('is-active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    updateScaleContent(option);
  });
});

function initialiseRevealMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const revealItems = document.querySelectorAll('.reveal');
  document.documentElement.classList.add('motion-ready');
  revealItems.forEach((item) => item.classList.add('will-reveal'));

  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px' });

  revealItems.forEach((item) => observer.observe(item));
}

function initialiseActiveNavigation() {
  const sections = [...navLinks]
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    const active = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!active) return;
    navLinks.forEach((link) => {
      link.toggleAttribute('aria-current', link.getAttribute('href') === `#${active.target.id}`);
    });
  }, { rootMargin: '-32% 0px -58%', threshold: [0, 0.1, 0.3] });

  sections.forEach((section) => observer.observe(section));
}

function showFormMessage(message, isError = false) {
  formMessage.textContent = message;
  formMessage.classList.toggle('is-error', isError);
  formMessage.classList.add('is-visible');
}

async function submitToEndpoint(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) throw new Error(`Submission failed with status ${response.status}`);
}

function openMailFallback(data) {
  const subject = encodeURIComponent(`KSA discovery session request \u2014 ${data.organisation}`);
  const body = encodeURIComponent(
    `Work email: ${data.email}\nOrganisation: ${data.organisation}\nPrimary priority: ${data.interest}`,
  );
  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const submitButton = form.querySelector('button[type="submit"]');

  if (!FORM_ENDPOINT) {
    if (CONTACT_EMAIL) {
      openMailFallback(data);
      showFormMessage('Opening your email client with your discovery request.');
      return;
    }

    showFormMessage('Booking integration is not configured yet. Please connect an approved CRM, booking tool, or contact endpoint before publishing.', true);
    return;
  }

  submitButton.disabled = true;
  try {
    await submitToEndpoint(data);
    form.reset();
    showFormMessage('Thank you. A member of the Seha One team will follow up shortly.');
  } catch {
    showFormMessage('We could not send your request. Please use the approved contact channel or try again shortly.', true);
  } finally {
    submitButton.disabled = false;
  }
});

updateScaleContent();
initialiseRevealMotion();
initialiseActiveNavigation();
