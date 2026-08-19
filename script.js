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
  if (mode === 'travel' && !reduceMotion) {
    startHeroTimer();
    clearInterval(recruitmentHeroTimer);
  } else if (mode === 'recruitment' && !reduceMotion) {
    clearInterval(heroTimer);
    startRecruitmentHeroTimer();
  } else {
    clearInterval(heroTimer);
    clearInterval(recruitmentHeroTimer);
  }
  if (typeof syncAssistantMode === 'function') syncAssistantMode(mode);
}
modeButtons.forEach((button) => button.addEventListener('click', () => setMode(button.dataset.modeOption)));

const heroSlides = [...document.querySelectorAll('.hero-slide')];
const heroCount = document.getElementById('heroCount');
const heroDotsContainer = document.getElementById('heroDots');
let heroDots = [];
let currentHero = 0;
let heroTimer;

// Dots and counter are generated from the actual number of slides.
// Future hero photos only require adding another .hero-slide in the HTML.
if (heroDotsContainer) {
  heroDotsContainer.innerHTML = '';
  heroDots = heroSlides.map((_, i) => {
    const dot = document.createElement('button');
    dot.className = `hero-dot${i === 0 ? ' is-active' : ''}`;
    dot.type = 'button';
    dot.setAttribute('aria-label', `Show hero image ${i + 1}`);
    dot.addEventListener('click', () => showHero(i));
    heroDotsContainer.appendChild(dot);
    return dot;
  });
}

function showHero(index, restart = true) {
  if (!heroSlides.length) return;
  currentHero = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentHero));
  heroDots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentHero));
  if (heroCount) heroCount.textContent = `${String(currentHero + 1).padStart(2, '0')} / ${String(heroSlides.length).padStart(2, '0')}`;
  if (restart && !reduceMotion && body.dataset.mode === 'travel') startHeroTimer();
}
function startHeroTimer() {
  clearInterval(heroTimer);
  if (heroSlides.length > 1) heroTimer = setInterval(() => showHero(currentHero + 1, false), 5200);
}
document.querySelector('.hero')?.addEventListener('mouseenter', () => clearInterval(heroTimer));
document.querySelector('.hero')?.addEventListener('mouseleave', () => {
  if (!reduceMotion && body.dataset.mode === 'travel') startHeroTimer();
});
if (!reduceMotion) startHeroTimer();

// Recruitment hero uses its own image set and 5-second rotation.
const recruitmentHero = document.querySelector('.recruitment-hero-slider');
const recruitmentSlides = [...document.querySelectorAll('.recruitment-slide')];
const recruitmentHeroCount = document.getElementById('recruitmentHeroCount');
const recruitmentHeroDotsContainer = document.getElementById('recruitmentHeroDots');
let recruitmentHeroDots = [];
let currentRecruitmentHero = 0;
let recruitmentHeroTimer;

if (recruitmentHeroDotsContainer) {
  recruitmentHeroDotsContainer.innerHTML = '';
  recruitmentHeroDots = recruitmentSlides.map((_, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = `recruitment-hero-dot${i === 0 ? ' is-active' : ''}`;
    dot.setAttribute('aria-label', `Show recruitment image ${i + 1}`);
    dot.addEventListener('click', () => showRecruitmentHero(i));
    recruitmentHeroDotsContainer.appendChild(dot);
    return dot;
  });
}

function showRecruitmentHero(index, restart = true) {
  if (!recruitmentSlides.length) return;
  currentRecruitmentHero = (index + recruitmentSlides.length) % recruitmentSlides.length;
  recruitmentSlides.forEach((slide, i) => slide.classList.toggle('is-active', i === currentRecruitmentHero));
  recruitmentHeroDots.forEach((dot, i) => dot.classList.toggle('is-active', i === currentRecruitmentHero));
  if (recruitmentHeroCount) recruitmentHeroCount.textContent = `${String(currentRecruitmentHero + 1).padStart(2, '0')} / ${String(recruitmentSlides.length).padStart(2, '0')}`;
  if (restart && !reduceMotion && body.dataset.mode === 'recruitment') startRecruitmentHeroTimer();
}

function startRecruitmentHeroTimer() {
  clearInterval(recruitmentHeroTimer);
  if (recruitmentSlides.length > 1) recruitmentHeroTimer = setInterval(() => showRecruitmentHero(currentRecruitmentHero + 1, false), 5000);
}

recruitmentHero?.addEventListener('mouseenter', () => clearInterval(recruitmentHeroTimer));
recruitmentHero?.addEventListener('mouseleave', () => {
  if (!reduceMotion && body.dataset.mode === 'recruitment') startRecruitmentHeroTimer();
});

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
const saudiVisaRow = document.getElementById('saudiVisaRow');
const saudiVisaType = document.getElementById('saudiVisaType');
const visaDocumentsBox = document.getElementById('visaDocumentsBox');
const visaDocumentsTitle = document.getElementById('visaDocumentsTitle');
const visaDocumentsList = document.getElementById('visaDocumentsList');
const visaDocumentsNote = document.getElementById('visaDocumentsNote');
const hajjSectorRow = document.getElementById('hajjSectorRow');
const hajjSector = document.getElementById('hajjSector');
const customSectorField = document.getElementById('customSectorField');
const customSector = document.getElementById('customSector');
const serviceDetailRow = document.getElementById('serviceDetailRow');
const travelDate = document.getElementById('travelDate');
if (travelDate) travelDate.min = new Date().toISOString().slice(0, 10);

const saudiVisaDocuments = {
  'Absher Visa': {
    items: ['Passport copy — front & back', 'Valid Iqama', 'Contact number linked with Absher', 'National Address', 'Confirmed round-trip ticket copy'],
  },
  'Without Absher': {
    items: ['Passport copy — front & back', 'Confirmed round-trip ticket copy', 'PAN Card'],
  },
  'Tourist Visa': {
    items: ['Original passport', 'Bank statement', 'Passport-size photo with white background'],
  },
  'Employment Visa': {
    items: ['Original passport', 'Medical', 'Passport-size photo with white background', 'Trade test'],
    note: 'Visa number / ID number is required if it is a visa-only service.',
  },
};

function syncSaudiVisaDetails() {
  const isSaudiVisa = travelService?.value === 'Gulf Visa Assistance' && visaCountry?.value === 'Saudi Arabia';
  if (saudiVisaRow) saudiVisaRow.hidden = !isSaudiVisa;

  if (!isSaudiVisa) {
    if (saudiVisaType) saudiVisaType.value = '';
    if (visaDocumentsBox) visaDocumentsBox.hidden = true;
    return;
  }

  const selected = saudiVisaDocuments[saudiVisaType?.value || ''];
  if (!selected) {
    if (visaDocumentsBox) visaDocumentsBox.hidden = true;
    return;
  }

  if (visaDocumentsTitle) visaDocumentsTitle.textContent = saudiVisaType.value;
  if (visaDocumentsList) {
    visaDocumentsList.innerHTML = selected.items.map((item) => `<li>${escapeHtml(item)}</li>`).join('');
  }
  if (visaDocumentsNote) {
    visaDocumentsNote.textContent = selected.note || '';
    visaDocumentsNote.hidden = !selected.note;
  }
  if (visaDocumentsBox) visaDocumentsBox.hidden = false;
}

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
  if (service !== 'Gulf Visa Assistance') {
    if (saudiVisaType) saudiVisaType.value = '';
    if (saudiVisaRow) saudiVisaRow.hidden = true;
    if (visaDocumentsBox) visaDocumentsBox.hidden = true;
  }
  syncSaudiVisaDetails();
  if (service !== 'Hajj & Umrah' && travelPackage) travelPackage.value = 'Not selected';
  if (service !== 'Hajj & Umrah') {
    if (hajjSector) hajjSector.value = '';
    if (customSector) customSector.value = '';
    if (customSectorField) customSectorField.hidden = true;
  }
}
travelService?.addEventListener('change', syncTravelDetails);
visaCountry?.addEventListener('change', syncSaudiVisaDetails);
saudiVisaType?.addEventListener('change', syncSaudiVisaDetails);
hajjSector?.addEventListener('change', () => {
  const custom = hajjSector.value === 'Other';
  if (customSectorField) customSectorField.hidden = !custom;
  if (!custom && customSector) customSector.value = '';
});
syncTravelDetails();

// Hero quick enquiry: collect the essentials, then continue into the adaptive detailed form.
const heroQuickForm = document.getElementById('heroQuickForm');
const heroQuickName = document.getElementById('heroQuickName');
const heroQuickPhone = document.getElementById('heroQuickPhone');
const heroQuickDate = document.getElementById('heroQuickDate');
const heroQuickTravellers = document.getElementById('heroQuickTravellers');
const heroQuickService = document.getElementById('heroQuickService');
const heroQuickStatus = document.getElementById('heroQuickStatus');
if (heroQuickDate) heroQuickDate.min = new Date().toISOString().slice(0, 10);
heroQuickForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const required = [heroQuickName, heroQuickPhone, heroQuickService];
  let valid = true;
  required.forEach((field) => {
    const bad = !String(field?.value || '').trim();
    markInvalid(field, bad);
    if (bad) valid = false;
  });
  if (!valid) {
    if (heroQuickStatus) heroQuickStatus.textContent = 'Please enter your name, mobile number and service.';
    return;
  }
  document.getElementById('travelName').value = heroQuickName.value.trim();
  document.getElementById('travelPhone').value = heroQuickPhone.value.trim();
  if (travelDate && heroQuickDate?.value) travelDate.value = heroQuickDate.value;
  const people = document.getElementById('travelPeople');
  if (people && heroQuickTravellers?.value) people.value = heroQuickTravellers.value;
  if (travelService) travelService.value = heroQuickService.value;
  syncTravelDetails();
  if (heroQuickStatus) heroQuickStatus.textContent = '';
  scrollToId('travel-enquiry');
  setTimeout(() => {
    const nextField = document.querySelector('#travelForm [required], #travelForm select:not([hidden])');
    document.getElementById('travelService')?.focus({ preventScroll: true });
  }, 350);
});

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

    if (visaCountry?.value === 'Saudi Arabia') {
      const badVisaType = !String(saudiVisaType?.value || '').trim();
      markInvalid(saudiVisaType, badVisaType);
      if (badVisaType) valid = false;
    }
  }

  if (!valid) {
    if (travelService?.value === 'Hajj & Umrah') {
      travelStatus.textContent = 'Please complete your name, WhatsApp number, service and arrival sector.';
    } else if (travelService?.value === 'Gulf Visa Assistance' && visaCountry?.value === 'Saudi Arabia') {
      travelStatus.textContent = 'Please complete your name, WhatsApp number, service, Gulf country and Saudi visa type.';
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
  if (service === 'Gulf Visa Assistance') {
    serviceSpecific.push(`Country: ${visaCountry?.value || 'Not selected'}`);
    if (visaCountry?.value === 'Saudi Arabia') {
      serviceSpecific.push(`Visa type: ${saudiVisaType?.value || 'Not selected'}`);
    }
  }

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

// Mobile navigation polish: close on outside click, Escape and tablet/desktop resize.
document.addEventListener('click', (event) => {
  if (!mobileMenu?.classList.contains('is-open')) return;
  if (mobileMenu.contains(event.target) || menuButton?.contains(event.target)) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  body.classList.remove('menu-open');
});
document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape' || !mobileMenu?.classList.contains('is-open')) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  body.classList.remove('menu-open');
  menuButton?.focus();
});
window.addEventListener('resize', () => {
  if (window.innerWidth <= 980 || !mobileMenu?.classList.contains('is-open')) return;
  menuButton?.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('is-open');
  mobileMenu.setAttribute('aria-hidden', 'true');
  body.classList.remove('menu-open');
});


// ---------------------------------------------------------
// Al Hadi Journey Advisor
// Frontend-only guided consultation. No AI API or backend.
// ---------------------------------------------------------
const journeyAdvisor = document.getElementById('journeyAdvisor');
const journeyAdvisorEyebrow = document.getElementById('journeyAdvisorEyebrow');
const journeyAdvisorHeading = document.getElementById('journeyAdvisorHeading');
const journeyAdvisorIntro = document.getElementById('journeyAdvisorIntro');
const advisorModeBadge = document.getElementById('advisorModeBadge');
const advisorSessionTitle = document.getElementById('advisorSessionTitle');
const advisorSessionText = document.getElementById('advisorSessionText');
const advisorWorkspaceKicker = document.getElementById('advisorWorkspaceKicker');
const advisorWorkspaceName = document.getElementById('advisorWorkspaceName');
const advisorQuestionTitle = document.getElementById('advisorQuestionTitle');
const advisorQuestionCopy = document.getElementById('advisorQuestionCopy');
const advisorForm = document.getElementById('advisorForm');
const advisorInput = document.getElementById('advisorInput');
const advisorSubmit = document.getElementById('advisorSubmit');
const advisorPrompts = document.getElementById('advisorPrompts');
const advisorOpening = document.getElementById('advisorOpening');
const advisorProcessing = document.getElementById('advisorProcessing');
const advisorProcessingQuestion = document.getElementById('advisorProcessingQuestion');
const advisorProcessingCount = document.getElementById('advisorProcessingCount');
const advisorProcessingNote = document.getElementById('advisorProcessingNote');
const advisorResponse = document.getElementById('advisorResponse');
const advisorReset = document.getElementById('advisorReset');
const advisorStatusText = document.getElementById('advisorStatusText');
const advisorProcessNodes = [...document.querySelectorAll('.advisor-route-node')];
const advisorContextItems = [...document.querySelectorAll('.advisor-context-item')];
const advisorContextLabels = [document.getElementById('advisorContextLabel1'),document.getElementById('advisorContextLabel2'),document.getElementById('advisorContextLabel3')];
const advisorContextValues = [document.getElementById('advisorContextValue1'),document.getElementById('advisorContextValue2'),document.getElementById('advisorContextValue3')];

let advisorMode = body.dataset.mode === 'recruitment' ? 'recruitment' : 'travel';
let advisorBusy = false;
let advisorTimers = [];
let advisorContext = {service:'', preference:'', route:''};
let advisorSelectedCategory = '';
let advisorSelectedPassport = '';

const advisorMeta = {
  travel:{
    eyebrow:'AL HADI JOURNEY ADVISOR',
    heading:'Plan your journey, one decision at a time.',
    intro:'Ask about packages, documents, arrival sectors, hotels, flights or Gulf visas. The advisor keeps your choices together and takes you to the right next step.',
    badge:'HAJJ / UMRAH', kicker:'PERSONAL JOURNEY GUIDANCE', name:'Ask Al Hadi',
    title:'What would you like help planning?',
    copy:'Write a short question in your own words. You can start with something as simple as “Umrah packages”.',
    placeholder:'Ask about Umrah packages, documents, hotels, flights…',
    prompts:['Umrah packages','What documents do I need?','Can I arrive in Madinah?','I need hotel booking'],
    labels:['Service','Preference','Arrival / route']
  },
  recruitment:{
    eyebrow:'ASK AL HADI · RECRUITMENT',
    heading:'Questions about applying? Ask Al Hadi.',
    intro:'Ask about job categories, passport status, sending your CV or how the application works. For current openings, contact the Al Hadi team directly.',
    badge:'RECRUITMENT', kicker:'APPLICATION HELP', name:'Ask Al Hadi',
    title:'What would you like to know?',
    copy:'Try “How do I send my CV?” or “Which category should I choose?”.',
    placeholder:'Ask about job categories, your CV, passport or applying…',
    prompts:['How do I apply?','How do I send my CV?','Which category should I choose?','Do I need a passport?'],
    labels:['Category','Passport status','Next step']
  }
};

function advisorClearTimers(){advisorTimers.forEach(clearTimeout);advisorTimers=[];}
function advisorSchedule(fn,ms){const id=setTimeout(fn,ms);advisorTimers.push(id);return id;}
function advisorNormalize(value){return String(value||'').toLowerCase().replace(/[’']/g,'').replace(/[^a-z0-9\s/&-]/g,' ').replace(/\s+/g,' ').trim();}
function advisorScrollTo(id){const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:'start'});}

function advisorSetContext(key,value){
  advisorContext[key]=value||'';
  const keys=['service','preference','route'];
  const index=keys.indexOf(key);
  if(index<0)return;
  const item=advisorContextItems[index],target=advisorContextValues[index];
  if(target)target.textContent=value||'Not selected';
  if(item){
    item.classList.toggle('is-set',Boolean(value));
    item.classList.remove('is-updating');
    if(value){requestAnimationFrame(()=>item.classList.add('is-updating'));advisorSchedule(()=>item.classList.remove('is-updating'),650);}
  }
  advisorUpdateSessionCopy();
}
function advisorUpdateSessionCopy(){
  const active=Object.values(advisorContext).filter(Boolean);
  if(!active.length){advisorSessionTitle.textContent='Start with a question.';advisorSessionText.textContent='Your useful choices will collect here as you plan.';return;}
  if(advisorMode==='travel'){
    advisorSessionTitle.textContent=advisorContext.service?`Planning ${advisorContext.service}`:'Your journey is taking shape.';
    advisorSessionText.textContent=active.join(' · ');
  }else{
    advisorSessionTitle.textContent=advisorContext.service?`${advisorContext.service} enquiry`:'Your application details will appear here.';
    advisorSessionText.textContent=active.join(' · ');
  }
}
function advisorResetContext(){advisorContext={service:'',preference:'',route:''};advisorSelectedCategory='';advisorSelectedPassport='';['service','preference','route'].forEach(k=>advisorSetContext(k,''));}

function advisorRenderPrompts(){
  if(!advisorPrompts)return;
  advisorPrompts.innerHTML='';
  advisorMeta[advisorMode].prompts.forEach((label,i)=>{
    const btn=document.createElement('button');btn.type='button';btn.className='advisor-prompt';
    btn.innerHTML=`<span>${String(i+1).padStart(2,'0')}</span><strong>${escapeHtml(label)}</strong>`;
    btn.addEventListener('click',()=>advisorAsk(label));advisorPrompts.appendChild(btn);
  });
}
function advisorApplyMode(){
  if(!journeyAdvisor)return;
  const meta=advisorMeta[advisorMode];journeyAdvisor.dataset.advisorMode=advisorMode;
  journeyAdvisorEyebrow.textContent=meta.eyebrow;journeyAdvisorHeading.textContent=meta.heading;journeyAdvisorIntro.textContent=meta.intro;
  advisorModeBadge.textContent=meta.badge;advisorWorkspaceKicker.textContent=meta.kicker;advisorWorkspaceName.textContent=meta.name;
  advisorQuestionTitle.textContent=meta.title;advisorQuestionCopy.textContent=meta.copy;advisorInput.placeholder=meta.placeholder;
  advisorContextLabels.forEach((el,i)=>{if(el)el.textContent=meta.labels[i];});
  advisorRenderPrompts();
}
function advisorResetExperience(){
  advisorClearTimers();advisorBusy=false;advisorResetContext();
  if(advisorInput){advisorInput.disabled=false;advisorInput.value='';}
  if(advisorSubmit)advisorSubmit.disabled=false;
  if(advisorOpening)advisorOpening.hidden=false;
  if(advisorProcessing)advisorProcessing.hidden=true;
  if(advisorResponse){advisorResponse.hidden=true;advisorResponse.innerHTML='';}
  advisorProcessNodes.forEach((n,i)=>{n.classList.toggle('is-active',i===0);n.classList.remove('is-done');});
  if(advisorStatusText)advisorStatusText.textContent='Ready when you are';
  advisorApplyMode();
}
function syncAssistantMode(mode){
  const next=mode==='recruitment'?'recruitment':'travel';
  if(advisorMode!==next){advisorMode=next;advisorResetExperience();}else advisorApplyMode();
}

function advisorDetectTravelIntent(query){
  const q=advisorNormalize(query);
  if(/\b(umrah|hajj)\b/.test(q)) advisorSetContext('service',q.includes('umrah')&&!q.includes('hajj')?'Umrah':'Hajj / Umrah');
  if(/\b(madinah|medina)\b/.test(q))advisorSetContext('route','Madinah');
  else if(/\bjeddah\b/.test(q))advisorSetContext('route','Jeddah');
  else if(/\briyadh\b/.test(q))advisorSetContext('route','Riyadh');
  else if(/\bdammam\b/.test(q))advisorSetContext('route','Dammam');
  if(/\b(premium|comfort|better hotel|luxury)\b/.test(q)){advisorSetContext('preference','Premium');return 'packages';}
  if(/\b(economy|budget|value|affordable|cheap)\b/.test(q)){advisorSetContext('preference','Economy');return 'packages';}
  if(/\b(custom|specific requirement|personalised|personalized)\b/.test(q)){advisorSetContext('preference','Custom');return 'packages';}
  if(/\bfamily\b/.test(q)){advisorSetContext('preference','Premium');return 'packages';}
  if(/\b(package|packages|umrah tour|hajj tour|plan)\b/.test(q))return 'packages';
  if(/\b(document|documents|passport|paperwork|photograph|photo)\b/.test(q))return 'documents';
  if(/\b(sector|airport|arrival|madinah|medina|jeddah|riyadh|dammam)\b/.test(q))return 'sector';
  if(/\b(hotel|room|stay|accommodation)\b/.test(q)){advisorSetContext('service','Hotel Booking');return 'hotel';}
  if(/\b(flight|airline|ticket|emirates|etihad|saudia|indigo|qatar airways)\b/.test(q)){advisorSetContext('service','Flight Tickets');return 'flight';}
  if(/\b(visa|kuwait|uae|oman|bahrain|gulf)\b/.test(q)){advisorSetContext('service','Visa Assistance');return 'visa';}
  if(/\b(forex|currency|exchange|riyal|money)\b/.test(q)){advisorSetContext('service','Forex');return 'forex';}
  return 'fallback';
}
function advisorDetectRecruitmentIntent(query){
  const q=advisorNormalize(query);
  if(/\b(engineer|engineering|professional)\b/.test(q))advisorSetContext('service','Engineering / Professional');
  else if(/\b(labour|worker|helper|general)\b/.test(q))advisorSetContext('service','General Workforce');
  else if(/\b(technical|technician|operator)\b/.test(q))advisorSetContext('service','Technical Roles');
  else if(/\b(skilled|electrician|welder|carpenter|plumber)\b/.test(q))advisorSetContext('service','Skilled Trades');
  if(/\b(resume|cv|curriculum)\b/.test(q))return 'resume';
  if(/\b(category|categories|engineer|engineering|labour|worker|technical|skilled|professional)\b/.test(q))return 'categories';
  if(/\b(passport)\b/.test(q))return 'passport';
  if(/\b(country|saudi|ksa|kingdom)\b/.test(q))return 'country';
  if(/\b(apply|application|job|join|candidate)\b/.test(q))return 'apply';
  return 'fallback';
}

function advisorStartProcessing(query,done){
  advisorClearTimers();advisorBusy=true;if(advisorInput)advisorInput.disabled=true;if(advisorSubmit)advisorSubmit.disabled=true;
  advisorOpening.hidden=true;advisorResponse.hidden=true;advisorProcessing.hidden=false;
  advisorProcessingQuestion.textContent=query.length>58?`${query.slice(0,58)}…`:query;
  const notes=advisorMode==='travel'?['Reading the travel need behind your question.','Checking the relevant Al Hadi travel service.','Preparing the most useful next decision.']:['Checking your question.','Finding the relevant recruitment information.','Preparing the next step.'];
  advisorProcessNodes.forEach((node,i)=>{node.classList.toggle('is-active',i===0);node.classList.remove('is-done');});
  advisorProcessingCount.textContent='01 / 03';advisorProcessingNote.textContent=notes[0];advisorStatusText.textContent='Preparing guidance';
  const steps=reduceMotion?[0,80,160]:[0,360,760];
  advisorSchedule(()=>{advisorProcessNodes[0]?.classList.add('is-done');advisorProcessNodes[0]?.classList.remove('is-active');advisorProcessNodes[1]?.classList.add('is-active');advisorProcessingCount.textContent='02 / 03';advisorProcessingNote.textContent=notes[1];},steps[1]);
  advisorSchedule(()=>{advisorProcessNodes[1]?.classList.add('is-done');advisorProcessNodes[1]?.classList.remove('is-active');advisorProcessNodes[2]?.classList.add('is-active');advisorProcessingCount.textContent='03 / 03';advisorProcessingNote.textContent=notes[2];},steps[2]);
  advisorSchedule(()=>{advisorProcessNodes[2]?.classList.add('is-done');advisorProcessing.hidden=true;advisorBusy=false;if(advisorInput)advisorInput.disabled=false;if(advisorSubmit)advisorSubmit.disabled=false;advisorStatusText.textContent='Guidance ready';done();},reduceMotion?240:1120);
}

function advisorBaseResponse(label,title,text,body='',actions=''){
  return `<div class="advisor-response-enter"><div class="advisor-response-top"><span>${escapeHtml(label)}</span><button type="button" class="advisor-new-question" data-advisor-action="new-question">Ask another question</button></div><h3>${escapeHtml(title)}</h3><p class="advisor-response-copy">${escapeHtml(text)}</p>${body}${actions?`<div class="advisor-response-actions">${actions}</div>`:''}</div>`;
}
function advisorAction(label,action,secondary=false){return `<button type="button" class="advisor-action${secondary?' secondary':''}" data-advisor-action="${escapeHtml(action)}">${escapeHtml(label)}<span>→</span></button>`;}
function advisorAttachActions(){advisorResponse.querySelectorAll('[data-advisor-action]').forEach(btn=>btn.addEventListener('click',()=>advisorDoAction(btn.dataset.advisorAction)));}
function advisorShow(html){advisorResponse.innerHTML=html;advisorResponse.hidden=false;requestAnimationFrame(()=>advisorResponse.firstElementChild?.classList.add('is-visible'));advisorAttachActions();}

function advisorRenderPackages(query){
  if(!advisorContext.service)advisorSetContext('service',advisorNormalize(query).includes('hajj')?'Hajj / Umrah':'Umrah');
  const selected=advisorContext.preference;
  const cards=[
    ['Economy','Essential arrangements','Best for value-focused travellers','A carefully organised journey with a stronger focus on essential arrangements and value.'],
    ['Premium','Comfort-led planning','Best for hotel comfort & families','A stronger starting point when hotel category and a smoother overall arrangement matter more.'],
    ['Custom','Built around you','Best for specific requirements','For preferred hotels, family requirements, route preferences or a more personalised plan.']
  ].map(([name,sub,best,desc])=>`<button type="button" class="advisor-package-card${selected===name?' is-selected':''}" data-package-pick="${name}"><span>${name}</span><strong>${sub}</strong><p>${desc}</p><small>${best}</small><i>${selected===name?'Selected':'Explore'}</i></button>`).join('');
  const body=`<div class="advisor-package-board">${cards}</div><div class="advisor-preference-box"><div><small>WHAT MATTERS MOST?</small><strong>Choose one priority and the advisor will bring the strongest fit forward.</strong></div><div class="advisor-preference-options"><button data-package-priority="Economy">Best value</button><button data-package-priority="Premium">Hotel comfort</button><button data-package-priority="Premium">Family comfort</button><button data-package-priority="Custom">Specific requirements</button></div></div><div class="advisor-recommendation" id="advisorRecommendation" ${selected?'':'hidden'}></div>`;
  const actions=advisorAction('Compare full packages','scroll:packages',true)+advisorAction('Start Hajj / Umrah enquiry','service:Hajj & Umrah');
  advisorShow(advisorBaseResponse('PACKAGE ADVISOR','Three ways to shape your journey.','Prices are shared after travel dates, hotel preference, traveller count and availability are confirmed.',body,actions));
  advisorResponse.querySelectorAll('[data-package-pick]').forEach(btn=>btn.addEventListener('click',()=>advisorRecommendPackage(btn.dataset.packagePick,'You selected this package direction.')));
  advisorResponse.querySelectorAll('[data-package-priority]').forEach(btn=>btn.addEventListener('click',()=>advisorRecommendPackage(btn.dataset.packagePriority,`Based on “${btn.textContent.trim()}”, this is the strongest starting point.`)));
  if(selected)advisorRecommendPackage(selected,'Based on what you asked, this is the strongest starting point.',false);
}
function advisorRecommendPackage(pkg,reason,animate=true){
  advisorSetContext('preference',pkg);
  advisorResponse.querySelectorAll('.advisor-package-card').forEach(card=>{const on=card.dataset.packagePick===pkg;card.classList.toggle('is-selected',on);const i=card.querySelector('i');if(i)i.textContent=on?'Recommended':'Explore';});
  const box=document.getElementById('advisorRecommendation');if(box){box.hidden=false;box.innerHTML=`<span>RECOMMENDED DIRECTION</span><div><strong>${escapeHtml(pkg)}</strong><p>${escapeHtml(reason)}</p></div>${advisorAction(`Continue with ${pkg}`,`package:${pkg}`)}`;if(animate){box.classList.remove('is-visible');requestAnimationFrame(()=>box.classList.add('is-visible'));}else box.classList.add('is-visible');advisorAttachActions();}
}

const documentSets={
  'Hajj / Umrah':['Passport','Photographs','Required ID / supporting documents','Preferred travel dates','Arrival sector preference'],
  'Flight Tickets':['Passenger names as per travel document','Passport details where required','Route and preferred travel date','Preferred airline, if any'],
  'Hotel Booking':['City / destination','Check-in and check-out dates','Guest count','Hotel name or stay preference'],
  'Visa Assistance':['Passport','Photograph','Destination country','Country-specific supporting documents']
};
function advisorRenderDocuments(){
  const tabs=Object.keys(documentSets).map((name,i)=>`<button type="button" class="advisor-doc-tab${i===0?' is-active':''}" data-doc-set="${name}">${name}</button>`).join('');
  const body=`<div class="advisor-doc-layout"><div class="advisor-doc-tabs">${tabs}</div><div class="advisor-checklist" id="advisorChecklist"></div></div>`;
  advisorShow(advisorBaseResponse('DOCUMENT GUIDE','Keep the right details ready before you enquire.','Exact requirements can vary by service and destination. Use this as a planning checklist, then confirm the final current requirement with Al Hadi.',body,advisorAction('View full document section','scroll:documents-required',true)+advisorAction('Start an enquiry','scroll:travel-enquiry')));
  const choose=(name)=>{advisorSetContext('service',name);advisorResponse.querySelectorAll('.advisor-doc-tab').forEach(b=>b.classList.toggle('is-active',b.dataset.docSet===name));const target=document.getElementById('advisorChecklist');target.innerHTML=`<span>${escapeHtml(name.toUpperCase())}</span><ul>${documentSets[name].map(x=>`<li><i>✓</i>${escapeHtml(x)}</li>`).join('')}</ul>`;};
  advisorResponse.querySelectorAll('[data-doc-set]').forEach(btn=>btn.addEventListener('click',()=>choose(btn.dataset.docSet)));choose('Hajj / Umrah');
}
function advisorRenderSector(){
  if(!advisorContext.service)advisorSetContext('service','Hajj / Umrah');
  const sectors=['Madinah','Jeddah','Riyadh','Dammam'];
  const body=`<div class="advisor-sector-map"><div class="advisor-sector-route" aria-hidden="true"><span></span><i></i></div>${sectors.map(s=>`<button type="button" data-sector="${s}" class="advisor-sector-point${advisorContext.route===s?' is-selected':''}"><b></b><span>${s}</span></button>`).join('')}</div><div class="advisor-sector-note" id="advisorSectorNote">Choose a sector to add it to your planning session.</div>`;
  advisorShow(advisorBaseResponse('ARRIVAL SECTOR','Yes — you can choose your preferred arrival sector.','Madinah, Jeddah, Riyadh and Dammam are available in the Hajj & Umrah enquiry, with an additional manual option.',body,advisorAction('Open Hajj / Umrah enquiry','service:Hajj & Umrah')+advisorAction('Ask the team on WhatsApp','whatsapp',true)));
  advisorResponse.querySelectorAll('[data-sector]').forEach(btn=>btn.addEventListener('click',()=>{const sector=btn.dataset.sector;advisorSetContext('route',sector);advisorResponse.querySelectorAll('[data-sector]').forEach(b=>b.classList.toggle('is-selected',b===btn));document.getElementById('advisorSectorNote').innerHTML=`<strong>${sector}</strong><span>Added to your planning session. Final routing still depends on the confirmed itinerary and flight plan.</span>${advisorAction(`Use ${sector} in enquiry`,`sector:${sector}`)}`;advisorAttachActions();}));
}
function advisorRenderSimple(kind){
  const data={
    hotel:['HOTEL GUIDANCE','Request the stay you actually want.','Choose Hotel Booking and the form changes to a hotel-name field instead of package options.','Hotel Booking',['Add your preferred hotel name','Share dates and traveller count','Use the note for room or stay preferences'],['Open hotel enquiry','service:Hotel Booking']],
    flight:['FLIGHT GUIDANCE','Share your preferred airline — or keep it flexible.','The flight enquiry includes common carriers such as IndiGo, Air India, Saudia, Emirates, Etihad and Qatar Airways.','Flight Tickets',['Final options depend on route and date','You can leave the airline preference flexible','The team confirms availability'],['Open flight enquiry','service:Flight Tickets']],
    visa:['GULF VISA GUIDANCE','Start by choosing the destination country.','Visa Assistance supports Saudi Arabia, Kuwait, UAE, Qatar, Oman and Bahrain, with another Gulf country option.','Visa Assistance',['Requirements differ by country','Passport and photograph are common starting documents','The team confirms current supporting documents'],['Open visa enquiry','service:Gulf Visa Assistance']],
    forex:['FOREX GUIDANCE','Add foreign exchange support to your travel planning.','Use the Forex service in the enquiry and share any specific currency requirement in the note.','Forex',['Useful alongside international travel planning','Final exchange availability is confirmed by the team'],['Open travel enquiry','service:Forex']]
  }[kind];
  advisorSetContext('service',data[3]);
  const body=`<div class="advisor-detail-list">${data[4].map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(x)}</p></div>`).join('')}</div>`;
  advisorShow(advisorBaseResponse(data[0],data[1],data[2],body,advisorAction(data[5][0],data[5][1])+advisorAction('Speak with Al Hadi','whatsapp',true)));
}
function advisorRenderFallback(){
  const prompts=advisorMeta[advisorMode].prompts.map(q=>`<button type="button" class="advisor-fallback-prompt" data-fallback-query="${escapeHtml(q)}">${escapeHtml(q)}<span>→</span></button>`).join('');
  advisorShow(advisorBaseResponse('LET’S NARROW IT DOWN',advisorMode==='recruitment'?'Please give me one more detail.':'I need one clearer travel detail.',advisorMode==='recruitment'?'Choose the closest question below, or type another short question.':'Choose the closest example below, or ask another short question.',`<div class="advisor-fallback-grid">${prompts}</div>`,''));
  advisorResponse.querySelectorAll('[data-fallback-query]').forEach(btn=>btn.addEventListener('click',()=>advisorAsk(btn.dataset.fallbackQuery)));
}

function advisorRenderRecruitment(kind){
  if(kind==='categories'){
    const cats=['General Workforce','Skilled Trades','Technical Roles','Engineering / Professional'];
    const body=`<div class="advisor-category-board">${cats.map(c=>`<button type="button" data-recruit-category="${c}" class="advisor-category-card${advisorContext.service===c?' is-selected':''}"><span></span><strong>${c}</strong><small>Choose category</small></button>`).join('')}</div><div class="advisor-category-note" id="advisorCategoryNote">Choose the category that best matches your experience.</div>`;
    advisorShow(advisorBaseResponse('RECRUITMENT CATEGORIES','Which category best matches your experience?','We accept enquiries for general workforce, skilled trades, technical, engineering and professional roles.',body,advisorAction('Open candidate form','candidate-form')+advisorAction('WhatsApp recruitment','whatsapp',true)));
    advisorResponse.querySelectorAll('[data-recruit-category]').forEach(btn=>btn.addEventListener('click',()=>{advisorSelectedCategory=btn.dataset.recruitCategory;advisorSetContext('service',advisorSelectedCategory);advisorResponse.querySelectorAll('[data-recruit-category]').forEach(b=>b.classList.toggle('is-selected',b===btn));document.getElementById('advisorCategoryNote').innerHTML=`<strong>${escapeHtml(advisorSelectedCategory)}</strong><span>Added to your application details.</span>`;}));
    return;
  }
  if(kind==='passport'){
    const statuses=['Valid passport','Passport applied','No passport yet'];
    const body=`<div class="advisor-passport-options">${statuses.map(s=>`<button data-passport-status="${s}">${s}</button>`).join('')}</div><div class="advisor-category-note" id="advisorPassportNote">Choose your current status accurately.</div>`;
    advisorShow(advisorBaseResponse('PASSPORT STATUS','Select your current passport status.','You can still send an enquiry if your passport is applied for or not yet available.',body,advisorAction('Open candidate form','candidate-form')));
    advisorResponse.querySelectorAll('[data-passport-status]').forEach(btn=>btn.addEventListener('click',()=>{advisorSelectedPassport=btn.dataset.passportStatus;advisorSetContext('preference',advisorSelectedPassport);advisorResponse.querySelectorAll('[data-passport-status]').forEach(b=>b.classList.toggle('is-selected',b===btn));document.getElementById('advisorPassportNote').innerHTML=`<strong>${escapeHtml(advisorSelectedPassport)}</strong><span>Added to your application details.</span>`;}));return;
  }
  const info={
    apply:['APPLICATION ROUTE','Start with the short candidate form.','Enter your contact details, category, position, experience and passport status. Then continue to WhatsApp or Gmail and attach your CV before sending.',['Your CV is not stored on this website','The enquiry message is prepared before WhatsApp or Gmail opens']],
    resume:['RESUME PROCESS','Send your CV through WhatsApp or Gmail.','Complete the candidate form, choose WhatsApp or Gmail, and attach your CV in the app that opens before sending.',['The website does not upload or store CV files','Your CV goes directly through the app you choose']],
    country:['DESTINATION','Our recruitment enquiries currently focus on Saudi Arabia.','Saudi Arabia is the main recruitment market listed on this website.',['Categories range from general workforce to engineering','Current openings are shared directly by the Al Hadi team']]
  }[kind]||null;
  if(!info){advisorRenderFallback();return;}
  advisorSetContext('route',kind==='country'?'Saudi Arabia':'Candidate form');
  const body=`<div class="advisor-detail-list">${info[3].map((x,i)=>`<div><span>${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(x)}</p></div>`).join('')}</div>`;
  advisorShow(advisorBaseResponse(info[0],info[1],info[2],body,advisorAction('Open candidate form','candidate-form')+advisorAction('WhatsApp recruitment','whatsapp',true)));
}

function advisorShowIntent(intent,query){
  if(advisorMode==='travel'){
    if(intent==='packages')advisorRenderPackages(query);
    else if(intent==='documents')advisorRenderDocuments();
    else if(intent==='sector')advisorRenderSector();
    else if(['hotel','flight','visa','forex'].includes(intent))advisorRenderSimple(intent);
    else advisorRenderFallback();
  }else advisorRenderRecruitment(intent);
}
function advisorAsk(question){
  const q=String(question||'').trim();if(!q||advisorBusy)return;
  if(advisorInput)advisorInput.value=q;
  const intent=advisorMode==='travel'?advisorDetectTravelIntent(q):advisorDetectRecruitmentIntent(q);
  advisorStartProcessing(q,()=>advisorShowIntent(intent,q));
}
advisorForm?.addEventListener('submit',e=>{e.preventDefault();advisorAsk(advisorInput.value);});
advisorReset?.addEventListener('click',advisorResetExperience);

function advisorDoAction(action){
  if(!action)return;
  if(action==='new-question'){advisorResponse.hidden=true;advisorOpening.hidden=false;if(advisorInput){advisorInput.value='';advisorInput.focus({preventScroll:true});}advisorStatusText.textContent='Ready for another question';return;}
  if(action==='whatsapp'){window.open(`https://wa.me/${WHATSAPP_NUMBER}`,'_blank','noopener');return;}
  if(action==='candidate-form'){
    setMode('recruitment',{scroll:false});
    requestAnimationFrame(()=>{const cat=document.getElementById('candidateCategory');if(cat&&advisorSelectedCategory){const map={'General Workforce':'Labour / General Worker','Skilled Trades':'Skilled Trade','Technical Roles':'Technical','Engineering / Professional':'Engineering / Professional'};cat.value=map[advisorSelectedCategory]||advisorSelectedCategory;cat.dispatchEvent(new Event('change',{bubbles:true}));}const pass=document.getElementById('candidatePassport');if(pass&&advisorSelectedPassport)pass.value=advisorSelectedPassport;advisorScrollTo('candidate-enquiry');});return;
  }
  if(action.startsWith('scroll:')){const id=action.slice(7);if(['packages','documents-required','travel-enquiry'].includes(id))setMode('travel',{scroll:false});requestAnimationFrame(()=>advisorScrollTo(id));return;}
  if(action.startsWith('package:')){const pkg=action.slice(8);setMode('travel',{scroll:false});requestAnimationFrame(()=>{const service=document.getElementById('travelService'),pack=document.getElementById('travelPackage');if(service){service.value='Hajj & Umrah';service.dispatchEvent(new Event('change',{bubbles:true}));}if(pack)pack.value=pkg;advisorScrollTo('travel-enquiry');});return;}
  if(action.startsWith('service:')){const name=action.slice(8);setMode('travel',{scroll:false});requestAnimationFrame(()=>{const service=document.getElementById('travelService');if(service){service.value=name;service.dispatchEvent(new Event('change',{bubbles:true}));}advisorScrollTo('travel-enquiry');});return;}
  if(action.startsWith('sector:')){const sector=action.slice(7);setMode('travel',{scroll:false});requestAnimationFrame(()=>{const service=document.getElementById('travelService'),field=document.getElementById('hajjSector');if(service){service.value='Hajj & Umrah';service.dispatchEvent(new Event('change',{bubbles:true}));}if(field)field.value=sector;advisorScrollTo('travel-enquiry');});}
}

advisorResetExperience();

function escapeHtml(value){
  return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
}

// =========================================================
// Recruitment candidate studio — live profile summary.
// Keeps the custom recruitment interface useful, not decorative.
// =========================================================
(() => {
  const category = document.getElementById('candidateCategory');
  const role = document.getElementById('candidateRole');
  const experience = document.getElementById('candidateExperience');
  const passport = document.getElementById('candidatePassport');
  const name = document.getElementById('candidateName');
  const phone = document.getElementById('candidatePhone');
  const summaryCategory = document.getElementById('candidateSummaryCategory');
  const summaryRole = document.getElementById('candidateSummaryRole');
  const summaryExperience = document.getElementById('candidateSummaryExperience');
  const summaryPassport = document.getElementById('candidateSummaryPassport');
  const progressText = document.getElementById('candidateProgressText');
  const progressBar = document.getElementById('candidateProgressBar');
  const lanes = [...document.querySelectorAll('.recruitment-lane[data-category]')];

  if (!category || !role || !summaryCategory) return;

  const syncCandidateStudio = () => {
    const categoryValue = category.value || '';
    const roleValue = role.value || '';
    summaryCategory.textContent = categoryValue || 'Select a category';
    summaryRole.textContent = roleValue || 'Not selected';
    if (summaryExperience && experience) summaryExperience.textContent = experience.value || 'Not selected';
    if (summaryPassport && passport) summaryPassport.textContent = passport.value || 'Not selected';

    lanes.forEach((lane) => lane.classList.toggle('is-selected', lane.dataset.category === categoryValue));

    const essentials = [name?.value.trim(), phone?.value.trim(), categoryValue, roleValue];
    const complete = essentials.filter(Boolean).length;
    if (progressText) progressText.textContent = `${complete} of 4`;
    if (progressBar) progressBar.style.width = `${complete * 25}%`;
  };

  [category, role, experience, passport].forEach((field) => field?.addEventListener('change', syncCandidateStudio));
  [name, phone].forEach((field) => field?.addEventListener('input', syncCandidateStudio));
  lanes.forEach((lane) => lane.addEventListener('click', () => requestAnimationFrame(syncCandidateStudio)));

  syncCandidateStudio();
})();

// Recruitment role directory — photography-led category browser.
(() => {
  const directory = document.getElementById('roleDirectory');
  if (!directory) return;

  const tabs = [...directory.querySelectorAll('.role-tab')];
  const image = document.getElementById('rolePreviewImage');
  const title = document.getElementById('rolePreviewTitle');
  const text = document.getElementById('rolePreviewText');
  const list = document.getElementById('rolePreviewList');
  const useButton = document.getElementById('roleUseCategory');

  const selectTab = (tab) => {
    if (!tab) return;
    tabs.forEach((item) => {
      const active = item === tab;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-selected', String(active));
    });

    directory.classList.add('is-changing');
    window.setTimeout(() => {
      if (image) {
        image.src = tab.dataset.image || image.src;
        image.alt = `${tab.dataset.title || 'Recruitment'} category`;
      }
      if (title) title.textContent = tab.dataset.title || '';
      if (text) text.textContent = tab.dataset.copy || '';
      if (list) {
        list.replaceChildren(...String(tab.dataset.roles || '').split('|').filter(Boolean).map((role) => {
          const item = document.createElement('span');
          item.textContent = role;
          return item;
        }));
      }
      if (useButton) useButton.dataset.category = tab.dataset.categoryValue || '';
      directory.classList.remove('is-changing');
    }, 140);
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => selectTab(tab)));
})();
