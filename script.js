const WHATSAPP_NUMBER = '919167493183';
const RECRUITMENT_EMAIL = 'hadisaudi@gmail.com';
const body = document.body;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.getElementById('mobileMenu');
menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  body.classList.toggle('menu-open', open);
});
mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton?.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    body.classList.remove('menu-open');
  });
});

const panels = [...document.querySelectorAll('[data-panel]')];
const modeButtons = [...document.querySelectorAll('[data-mode-option]')];
function setMode(mode, { scroll = true } = {}) {
  body.dataset.mode = mode;
  panels.forEach((panel) => {
    panel.hidden = panel.dataset.panel !== mode;
  });
  modeButtons.forEach((button) => {
    const active = button.dataset.modeOption === mode;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  if (scroll) window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
  if (mode === 'travel' && !reduceMotion) startHeroTimer(); else clearInterval(heroTimer);
}
modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.modeOption)));

const heroSlides = [...document.querySelectorAll('.hero-slide')];
const heroDots = [...document.querySelectorAll('.hero-dot')];
const heroCount = document.getElementById('heroCount');
const heroTitle = document.getElementById('heroTitle');
const heroPlace = document.getElementById('heroPlace');
let currentHero = 0;
let heroTimer;
function showHero(index, restart = true) {
  currentHero = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentHero));
  heroDots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentHero));
  const active = heroSlides[currentHero];
  if (heroCount) heroCount.textContent = `${String(currentHero + 1).padStart(2, '0')} / ${String(heroSlides.length).padStart(2, '0')}`;
  if (heroTitle) heroTitle.textContent = active.dataset.title;
  if (heroPlace) heroPlace.textContent = active.dataset.place;
  if (restart && !reduceMotion && body.dataset.mode === 'travel') startHeroTimer();
}
function startHeroTimer() {
  clearInterval(heroTimer);
  heroTimer = setInterval(() => showHero(currentHero + 1, false), 5200);
}
heroDots.forEach((dot, i) => dot.addEventListener('click', () => showHero(i)));
document.querySelector('.hero')?.addEventListener('mouseenter', () => clearInterval(heroTimer));
document.querySelector('.hero')?.addEventListener('mouseleave', () => {
  if (!reduceMotion && body.dataset.mode === 'travel') startHeroTimer();
});
if (!reduceMotion) startHeroTimer();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  reveals.forEach((item) => observer.observe(item));
} else {
  reveals.forEach((item) => item.classList.add('is-visible'));
}

function markInvalid(el, bad) {
  if (el) el.classList.toggle('invalid', bad);
}
document.querySelectorAll('input, select, textarea').forEach((field) => {
  field.addEventListener('input', () => markInvalid(field, false));
  field.addEventListener('change', () => markInvalid(field, false));
});
function scrollToId(id) {
  const target = document.getElementById(id);
  if (!target) return;
  const offset = window.innerWidth < 768 ? 86 : 112;
  window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: reduceMotion ? 'auto' : 'smooth' });
}
function whatsappUrl(text) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

const travelService = document.getElementById('travelService');
const travelPackage = document.getElementById('travelPackage');
const visaCountryField = document.getElementById('visaCountryField');
const visaCountry = document.getElementById('visaCountry');
const travelDate = document.getElementById('travelDate');
if (travelDate) travelDate.min = new Date().toISOString().slice(0, 10);
function syncVisaCountry() {
  const show = travelService?.value === 'Gulf Visa Assistance';
  if (visaCountryField) visaCountryField.hidden = !show;
  if (!show && visaCountry) visaCountry.value = '';
}
travelService?.addEventListener('change', syncVisaCountry);
function prefillTravel({ service, packageName } = {}) {
  setMode('travel', { scroll: false });
  if (service && travelService) travelService.value = service;
  if (packageName && travelPackage) travelPackage.value = packageName;
  syncVisaCountry();
  scrollToId('travel-enquiry');
  setTimeout(() => document.getElementById('travelName')?.focus({ preventScroll: true }), 350);
}
document.querySelectorAll('[data-service]').forEach((button) => {
  button.addEventListener('click', () => prefillTravel({ service: button.dataset.service }));
});
document.querySelectorAll('[data-package]').forEach((button) => {
  button.addEventListener('click', () => prefillTravel({ service: 'Hajj & Umrah', packageName: button.dataset.package }));
});

const travelForm = document.getElementById('travelForm');
const travelStatus = document.getElementById('travelStatus');
travelForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.getElementById('travelName');
  const phone = document.getElementById('travelPhone');
  const required = [name, phone, travelService];
  let valid = true;
  required.forEach((field) => {
    const bad = !String(field?.value || '').trim();
    markInvalid(field, bad);
    if (bad) valid = false;
  });
  if (!valid) {
    travelStatus.textContent = 'Please complete your name, WhatsApp number and service.';
    travelStatus.className = 'form-status error';
    return;
  }
  const dateValue = travelDate?.value
    ? new Date(`${travelDate.value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Flexible / not selected';
  const lines = [
    'Assalamu Alaikum, I would like to enquire with Al Hadi Tours & Travels.',
    '',
    `Name: ${name.value.trim()}`,
    `WhatsApp: ${phone.value.trim()}`,
    `Service: ${travelService.value}`,
    `Package: ${travelPackage.value}`,
    travelService.value === 'Gulf Visa Assistance' ? `Country: ${visaCountry?.value || 'Not selected'}` : null,
    `Preferred travel date: ${dateValue}`,
    `Travellers: ${document.getElementById('travelPeople').value}`,
    `Requirement: ${document.getElementById('travelMessage').value.trim() || 'No additional note'}`,
  ].filter(Boolean);
  travelStatus.textContent = 'Opening WhatsApp with your enquiry prepared…';
  travelStatus.className = 'form-status success';
  window.open(whatsappUrl(lines.join('\n')), '_blank', 'noopener');
});

const roleOptions = {
  'Labour / General Worker': ['General Labour', 'Helper', 'Cleaner', 'Warehouse Worker', 'Loading / Unloading', 'Other'],
  'Skilled Trade': ['Electrician', 'Plumber', 'Welder', 'Carpenter', 'Mason', 'Painter', 'Driver', 'Other'],
  Technical: ['HVAC Technician', 'Mechanical Technician', 'Electrical Technician', 'Civil Technician', 'Machine Operator', 'Maintenance Technician', 'Other'],
  'Engineering / Professional': ['Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Project Engineer', 'Site Engineer', 'QA / QC', 'Safety Officer', 'Other'],
};
const candidateCategory = document.getElementById('candidateCategory');
const candidateRole = document.getElementById('candidateRole');
const candidateStatus = document.getElementById('candidateStatus');
function populateRoles(category) {
  if (!candidateRole) return;
  candidateRole.innerHTML = '';
  const roles = roleOptions[category] || [];
  if (!roles.length) {
    candidateRole.add(new Option('Select category first', ''));
    candidateRole.disabled = true;
    return;
  }
  candidateRole.disabled = false;
  candidateRole.add(new Option('Select position / trade', ''));
  roles.forEach((role) => candidateRole.add(new Option(role, role)));
}
candidateCategory?.addEventListener('change', () => populateRoles(candidateCategory.value));
document.querySelectorAll('[data-category]').forEach((button) => {
  button.addEventListener('click', () => {
    setMode('recruitment', { scroll: false });
    candidateCategory.value = button.dataset.category;
    populateRoles(candidateCategory.value);
    scrollToId('candidate-enquiry');
  });
});
function candidatePayload() {
  const name = document.getElementById('candidateName');
  const phone = document.getElementById('candidatePhone');
  const required = [name, phone, candidateCategory, candidateRole];
  let valid = true;
  required.forEach((field) => {
    const bad = !String(field?.value || '').trim();
    markInvalid(field, bad);
    if (bad) valid = false;
  });
  if (!valid) {
    candidateStatus.textContent = 'Please complete your name, mobile number, category and position.';
    candidateStatus.className = 'form-status error';
    return null;
  }
  return [
    'Candidate enquiry for Saudi recruitment — Al Hadi Tours & Travels',
    '',
    `Name: ${name.value.trim()}`,
    `Mobile: ${phone.value.trim()}`,
    `Email: ${document.getElementById('candidateEmail').value.trim() || 'Not provided'}`,
    `Current location: ${document.getElementById('candidateLocation').value.trim() || 'Not provided'}`,
    `Category: ${candidateCategory.value}`,
    `Position / trade: ${candidateRole.value}`,
    `Experience: ${document.getElementById('candidateExperience').value}`,
    `Passport: ${document.getElementById('candidatePassport').value}`,
    `Note: ${document.getElementById('candidateNote').value.trim() || 'No additional note'}`,
    '',
    'I will attach my resume with this message/email.',
  ].join('\n');
}
document.getElementById('sendCandidateWhatsApp')?.addEventListener('click', () => {
  const message = candidatePayload();
  if (!message) return;
  candidateStatus.textContent = 'WhatsApp is opening. Please attach your resume before sending.';
  candidateStatus.className = 'form-status success';
  window.open(whatsappUrl(message), '_blank', 'noopener');
});
document.getElementById('sendCandidateEmail')?.addEventListener('click', () => {
  const message = candidatePayload();
  if (!message) return;
  candidateStatus.textContent = 'Your email app is opening. Please attach your resume before sending.';
  candidateStatus.className = 'form-status success';
  const subject = 'Saudi Recruitment Candidate Enquiry — Al Hadi';
  window.location.href = `mailto:${RECRUITMENT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
});
