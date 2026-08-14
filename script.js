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
function gmailComposeUrl({ to = RECRUITMENT_EMAIL, subject = '', body = '' } = {}) {
  const params = new URLSearchParams({ view: 'cm', fs: '1', to, su: subject, body });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

const travelService = document.getElementById('travelService');
const travelPackage = document.getElementById('travelPackage');
const packageField = document.getElementById('packageField');
const hotelField = document.getElementById('hotelField');
const hotelName = document.getElementById('hotelName');
const airlineField = document.getElementById('airlineField');
const preferredAirline = document.getElementById('preferredAirline');
const visaCountryField = document.getElementById('visaCountryField');
const visaCountry = document.getElementById('visaCountry');
const hajjSectorRow = document.getElementById('hajjSectorRow');
const hajjSector = document.getElementById('hajjSector');
const customSectorField = document.getElementById('customSectorField');
const customSector = document.getElementById('customSector');
const serviceDetailRow = document.getElementById('serviceDetailRow');
const travelDate = document.getElementById('travelDate');
if (travelDate) travelDate.min = new Date().toISOString().slice(0, 10);

function syncTravelDetails() {
  const service = travelService?.value || '';
  [packageField, hotelField, airlineField, visaCountryField].forEach((field) => {
    if (field) field.hidden = true;
  });
  if (serviceDetailRow) serviceDetailRow.classList.remove('single-field');

  if (hajjSectorRow) hajjSectorRow.hidden = service !== 'Hajj & Umrah';
  if (service === 'Hajj & Umrah') {
    if (packageField) packageField.hidden = false;
  } else if (service === 'Hotel Booking') {
    if (hotelField) hotelField.hidden = false;
  } else if (service === 'Flight Tickets') {
    if (airlineField) airlineField.hidden = false;
  } else if (service === 'Gulf Visa Assistance') {
    if (visaCountryField) visaCountryField.hidden = false;
  } else if (serviceDetailRow) {
    serviceDetailRow.classList.add('single-field');
  }

  if (service !== 'Hotel Booking' && hotelName) hotelName.value = '';
  if (service !== 'Flight Tickets' && preferredAirline) preferredAirline.value = '';
  if (service !== 'Gulf Visa Assistance' && visaCountry) visaCountry.value = '';
  if (service !== 'Hajj & Umrah' && travelPackage) travelPackage.value = 'Not selected';
  if (service !== 'Hajj & Umrah') {
    if (hajjSector) hajjSector.value = '';
    if (customSector) customSector.value = '';
    if (customSectorField) customSectorField.hidden = true;
  }
}
travelService?.addEventListener('change', syncTravelDetails);
hajjSector?.addEventListener('change', () => {
  const custom = hajjSector.value === 'Other';
  if (customSectorField) customSectorField.hidden = !custom;
  if (!custom && customSector) customSector.value = '';
});
syncTravelDetails();

function prefillTravel({ service, packageName } = {}) {
  setMode('travel', { scroll: false });
  if (service && travelService) travelService.value = service;
  syncTravelDetails();
  if (packageName && travelPackage) travelPackage.value = packageName;
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

  if (travelService?.value === 'Hajj & Umrah') {
    const badSector = !String(hajjSector?.value || '').trim();
    markInvalid(hajjSector, badSector);
    if (badSector) valid = false;
    const needsCustom = hajjSector?.value === 'Other';
    const badCustomSector = needsCustom && !String(customSector?.value || '').trim();
    markInvalid(customSector, badCustomSector);
    if (badCustomSector) valid = false;
  }

  if (travelService?.value === 'Gulf Visa Assistance') {
    const badCountry = !String(visaCountry?.value || '').trim();
    markInvalid(visaCountry, badCountry);
    if (badCountry) valid = false;
  }

  if (!valid) {
    if (travelService?.value === 'Hajj & Umrah') {
      travelStatus.textContent = 'Please complete your name, WhatsApp number, service and arrival sector.';
    } else if (travelService?.value === 'Gulf Visa Assistance') {
      travelStatus.textContent = 'Please complete your name, WhatsApp number, service and Gulf country.';
    } else {
      travelStatus.textContent = 'Please complete your name, WhatsApp number and service.';
    }
    travelStatus.className = 'form-status error';
    return;
  }

  const dateValue = travelDate?.value
    ? new Date(`${travelDate.value}T00:00:00`).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : 'Flexible / not selected';

  const service = travelService.value;
  const serviceSpecific = [];
  if (service === 'Hajj & Umrah') {
    serviceSpecific.push(`Package: ${travelPackage?.value || 'Not selected'}`);
    const sectorLabel = hajjSector?.value === 'Other' ? customSector?.value.trim() : hajjSector?.value;
    serviceSpecific.push(`Arrival sector / airport: ${sectorLabel || 'Not selected'}`);
  }
  if (service === 'Hotel Booking') serviceSpecific.push(`Hotel preference: ${hotelName?.value.trim() || 'Not specified'}`);
  if (service === 'Flight Tickets') serviceSpecific.push(`Preferred airline: ${preferredAirline?.value || 'No preference'}`);
  if (service === 'Gulf Visa Assistance') serviceSpecific.push(`Country: ${visaCountry?.value || 'Not selected'}`);

  const lines = [
    'Assalamu Alaikum, I would like to enquire with Al Hadi Tours & Travels.',
    '',
    `Name: ${name.value.trim()}`,
    `WhatsApp: ${phone.value.trim()}`,
    `Service: ${service}`,
    ...serviceSpecific,
    `Preferred travel date: ${dateValue}`,
    `Travellers: ${document.getElementById('travelPeople').value}`,
    `Requirement: ${document.getElementById('travelMessage').value.trim() || 'No additional note'}`,
  ];
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
  candidateStatus.textContent = 'Gmail is opening with your enquiry prepared. Please attach your resume before sending.';
  candidateStatus.className = 'form-status success';
  const subject = 'Saudi Recruitment Candidate Enquiry — Al Hadi';
  window.open(gmailComposeUrl({ subject, body: message }), '_blank', 'noopener');
});


// Footer travel information links remain useful even when Recruitment mode is active.
document.querySelectorAll('[data-travel-footer-link]').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const targetId = link.getAttribute('href')?.replace('#', '');
    setMode('travel', { scroll: false });
    requestAnimationFrame(() => scrollToId(targetId));
  });
});

// Compact privacy modal keeps policy information out of the main page flow.
const privacyDialog = document.getElementById('privacyDialog');
document.getElementById('openPrivacy')?.addEventListener('click', () => {
  if (privacyDialog?.showModal) privacyDialog.showModal();
});
document.getElementById('closePrivacy')?.addEventListener('click', () => privacyDialog?.close());
privacyDialog?.addEventListener('click', (event) => {
  if (event.target === privacyDialog) privacyDialog.close();
});

// Premium FAQ behaviour: keep one answer open at a time for a cleaner reading flow.
document.querySelectorAll('.faq-item').forEach((item) => {
  item.addEventListener('toggle', () => {
    if (!item.open) return;
    document.querySelectorAll('.faq-item').forEach((other) => {
      if (other !== item) other.open = false;
    });
  });
});
