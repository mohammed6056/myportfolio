/* =========================================================
   Portfolio — Afnan Nadeem Isane
   Vanilla JS interactions
   ========================================================= */

// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Theme toggle ----------
const themeToggle = document.getElementById('themeToggle');
themeToggle.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', cur === 'dark' ? 'light' : 'dark');
});

// ---------- Nav scroll state + reading progress (rAF-throttled to prevent jitter) ----------
const nav = document.getElementById('nav');
const progressBar = document.getElementById('progressBar');
const backTop = document.getElementById('backTop');

let scrollTicking = false;
let lastScrolled = null;
let lastBackTopVisible = null;
function onScrollFrame() {
  const y = window.scrollY;
  const scrolled = y > 30;
  if (scrolled !== lastScrolled) {
    nav.classList.toggle('scrolled', scrolled);
    lastScrolled = scrolled;
  }
  const backTopVisible = y > 500;
  if (backTopVisible !== lastBackTopVisible) {
    backTop.classList.toggle('visible', backTopVisible);
    lastBackTopVisible = backTopVisible;
  }
  const h = document.documentElement.scrollHeight - window.innerHeight;
  const progress = h > 0 ? Math.min(1, Math.max(0, y / h)) : 0;
  progressBar.style.transform = `scaleX(${progress}) translateZ(0)`;
  scrollTicking = false;
}
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    scrollTicking = true;
    requestAnimationFrame(onScrollFrame);
  }
}, { passive: true });

backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ---------- Mobile menu ----------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
}));

// ---------- Active section indicator ----------
const sections = document.querySelectorAll('section[id]');
const navMap = {};
document.querySelectorAll('[data-nav]').forEach(a => {
  navMap[a.getAttribute('href').slice(1)] = a;
});
const spy = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      Object.values(navMap).forEach(a => a.classList.remove('active'));
      const link = navMap[e.target.id];
      if (link) link.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => spy.observe(s));

// ---------- Cursor glow (rAF-throttled) ----------
const glow = document.getElementById('cursorGlow');
let mx = 0, my = 0, glowTicking = false;
window.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;
  if (!glowTicking) {
    glowTicking = true;
    requestAnimationFrame(() => {
      glow.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      glowTicking = false;
    });
  }
}, { passive: true });

// ---------- Particles ----------
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  for (let i = 0; i < 24; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = -Math.random() * 20 + '%';
    p.style.animationDuration = (10 + Math.random() * 15) + 's';
    p.style.animationDelay = -Math.random() * 20 + 's';
    p.style.opacity = 0.2 + Math.random() * 0.6;
    particlesEl.appendChild(p);
  }
}

// ---------- Mouse parallax on portrait ----------
document.querySelectorAll('[data-parallax]').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 20;
    const y = ((e.clientY - r.top) / r.height - 0.5) * 20;
    el.style.transform = `translate(${x}px, ${y}px)`;
  });
  el.addEventListener('mouseleave', () => el.style.transform = '');
});

// ---------- Magnetic buttons ----------
document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const r = btn.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = '');
});

// ---------- Reveal on scroll ----------
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      // count-up
      e.target.querySelectorAll('[data-count]').forEach(node => {
        const target = +node.dataset.count;
        let cur = 0;
        const step = Math.max(1, Math.ceil(target / 40));
        const tick = () => {
          cur += step;
          if (cur >= target) { node.textContent = target + '+'; return; }
          node.textContent = cur;
          requestAnimationFrame(tick);
        };
        tick();
      });
      // skill bars
      e.target.querySelectorAll('.skill-bar-fill').forEach(f => f.style.width = f.dataset.value + '%');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObs.observe(el));

// =========================================================
// SERVICES
// =========================================================
const services = [
  { icon:'🌐', title:'Website Development', desc:'Responsive, brand-aligned websites built on the right platform for the job.', features:['WordPress','Shopify','GoHighLevel','Wix','Squarespace','Hostinger','Custom HTML/CSS/JS'] },
  { icon:'🛒', title:'E-Commerce Development', desc:'Complete online store setup — from product uploads to payment gateways and order flow.', features:['Shopify','WooCommerce','Collections','Payment Gateways','Order Management','Store Customization'] },
  { icon:'⚡', title:'Marketing Automation', desc:'End-to-end CRM automations and funnels built in GoHighLevel to capture and convert leads.', features:['CRM Setup','Lead Capture','Follow-up Sequences','Appointment Booking','Sales Pipelines','Email Workflows'] },
  { icon:'📈', title:'SEO & Digital Marketing', desc:'On-page SEO, technical optimizations and paid campaigns that build sustainable traffic.', features:['On-page SEO','Meta Tags','Keyword Targeting','Page Speed','Google Ads','Google Analytics'] },
  { icon:'📱', title:'Social Media Management', desc:'Full-stack account management — planning, content, scheduling and engagement.', features:['Content Planning','Post Scheduling','Facebook','Instagram','LinkedIn','Reputation Monitoring'] },
  { icon:'🎨', title:'Creative & Graphic Design', desc:'Social posts, promotional banners and ad graphics that fit the brand.', features:['Canva','Adobe Photoshop','Post Creatives','Ad Banners','Brand Assets'] },
  { icon:'🎬', title:'Video Editing', desc:'Professional edits for promos, reels and branded content.', features:['Adobe Premiere Pro','After Effects','Reels','Promo Videos','Branded Intros'] },
  { icon:'🎯', title:'Landing Pages & Funnels', desc:'Conversion-focused pages and funnels engineered around a single outcome.', features:['Wireframes','Copy','GoHighLevel Funnels','Tracking','CRO'] },
];
const servicesGrid = document.getElementById('servicesGrid');
services.forEach((s, i) => {
  const el = document.createElement('div');
  el.className = 'service-card reveal';
  el.style.transitionDelay = (i * 40) + 'ms';
  el.innerHTML = `
    <div class="service-icon">${s.icon}</div>
    <h3>${s.title}</h3>
    <p>${s.desc}</p>
    <button class="service-more">Learn more <i class="icon-arrow-right"></i></button>
    <div class="service-expand"><div class="service-expand-inner">
      <div class="service-features">${s.features.map(f => `<span>${f}</span>`).join('')}</div>
      <a href="#contact" class="btn btn-outline btn-sm">Start a project</a>
    </div></div>`;
  el.querySelector('.service-more').addEventListener('click', (e) => {
    e.stopPropagation();
    el.classList.toggle('open');
  });
  servicesGrid.appendChild(el);
  revealObs.observe(el);
});

// =========================================================
// PROJECTS — real portfolio sites from resume
// =========================================================
const projects = [
  { emoji:'🍽️', cat:'web', category:'Restaurant',           title:'Sultan Chef',           desc:'Responsive restaurant website with a clean menu presentation and SEO-friendly structure.',      tech:['WordPress','SEO','Responsive'], url:'https://www.sultanchef.com' },
  { emoji:'✨', cat:'brand', category:'Personal Brand',       title:'Kaif.co',               desc:'Modern personal brand site focused on identity, storytelling and clear calls-to-action.',        tech:['Web Design','Branding','UX'],   url:'https://www.kaif.co' },
  { emoji:'📚', cat:'edu',  category:'Learning Platform',    title:'StudyBuddy Online',     desc:'Education-focused website with structured content, improved navigation and lead capture.',       tech:['WordPress','SEO','CRO'],        url:'https://www.studybuddyonline.com' },
  { emoji:'🎓', cat:'edu',  category:'Education',            title:'ISEES Edu',             desc:'Institutional website for ISEES with courses, programs and clear enrollment journeys.',         tech:['WordPress','SEO','A11y'],       url:'https://www.iseesedu.in' },
  { emoji:'☕', cat:'ecom', category:'Coffee Brand',         title:'Stockroom Coffee',      desc:'Brand-first Shopify store built around product storytelling and a smooth buying experience.',   tech:['Shopify','E-Commerce','Branding'], url:'https://www.stockroomcoffee.com' },
  { emoji:'🏫', cat:'edu',  category:'International School', title:'American Academy Qatar', desc:'Informative school website optimized for accessibility and parent/student journeys.',           tech:['WordPress','A11y','SEO'],       url:'https://www.americanacademy.sch.qa' },
  { emoji:'💼', cat:'web',  category:'Corporate / IT',       title:'ISEES Technologies',    desc:'Corporate website for ISEES Technologies showcasing services, capabilities and case work.',     tech:['WordPress','Corporate','SEO'],  url:'https://www.iseestech.com' },
  { emoji:'🛍️', cat:'ecom', category:'Trading Business',     title:'Majestic Traders',      desc:'E-commerce and business site with product catalog, categories and inquiry flow.',               tech:['E-Commerce','Web Design','SEO'], url:'https://www.majestictraders.in' },
];
const projectsGrid = document.getElementById('projectsGrid');
function renderProjects(filter = 'all') {
  projectsGrid.innerHTML = '';
  projects.filter(p => filter === 'all' || p.cat === filter).forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'project-card reveal';
    el.style.transitionDelay = (i * 60) + 'ms';
    el.innerHTML = `
      <div class="project-thumb" data-emoji="${p.emoji}">
        <div class="project-overlay">
          <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-primary btn-sm">Visit Site <i class="icon-arrow-right"></i></a>
        </div>
      </div>
      <div class="project-body">
        <div class="project-cat">${p.category}</div>
        <h3 class="project-title">${p.title}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
        <div class="project-actions">
          <a href="${p.url}" target="_blank" rel="noopener" class="btn btn-outline btn-sm">Open Website <i class="icon-arrow-right"></i></a>
        </div>
      </div>`;
    projectsGrid.appendChild(el);
    requestAnimationFrame(() => el.classList.add('visible'));
  });
}
renderProjects();
document.querySelectorAll('#filterTabs .tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('#filterTabs .tab').forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    renderProjects(t.dataset.filter);
  });
});

// =========================================================
// SKILLS — grouped per resume
// =========================================================
const skills = [
  { group:'Front-End Development', desc:'Building fast, accessible, responsive web experiences.',
    items:[['HTML5 / CSS3 / JS (ES6+)',95],['React.js',85],['Next.js (Basic)',65],['Responsive / Cross-browser',92]] },
  { group:'CMS & E-Commerce', desc:'Delivering client sites across the platforms that matter.',
    items:[['WordPress',92],['Shopify',90],['GoHighLevel',88],['Wix / Squarespace / Hostinger',82]] },
  { group:'Marketing & Automation', desc:'Funnels, CRM automations and campaigns that convert.',
    items:[['GoHighLevel Automations',90],['SEO (On-page)',88],['SMO / Social Media',85],['Google Ads',78]] },
  { group:'Design & Video', desc:'Creatives, brand assets and video for social and web.',
    items:[['Figma',82],['Canva',92],['Adobe Photoshop',80],['Premiere Pro / After Effects',80]] },
  { group:'Database & Analytics', desc:'Structured data, reporting and measurement.',
    items:[['MS-SQL',85],['MySQL',75],['Google Analytics / Search Console',85],['Power BI',75]] },
  { group:'Other Tools', desc:'Everyday productivity and scripting.',
    items:[['Advanced Excel',88],['Google Sheets',88],['MS Office / Outlook',90],['Python (Basic)',60]] },
];
const skillsGrid = document.getElementById('skillsGrid');
skills.forEach((s, i) => {
  const el = document.createElement('div');
  el.className = 'skill-group reveal';
  el.style.transitionDelay = (i * 60) + 'ms';
  el.innerHTML = `
    <h3>${s.group}</h3>
    <p>${s.desc}</p>
    ${s.items.map(([n,v]) => `
      <div class="skill-bar">
        <div class="skill-bar-head"><span>${n}</span><span>${v}%</span></div>
        <div class="skill-bar-track"><div class="skill-bar-fill" data-value="${v}"></div></div>
      </div>`).join('')}`;
  skillsGrid.appendChild(el);
  revealObs.observe(el);
});

// =========================================================
// EXPERIENCE — from resume
// =========================================================
const experience = [
  {
    role: 'Web Developer',
    company: 'Tasks Expert Virtual Employee Service Pvt Ltd',
    duration: 'May 2025 — Feb 2026',
    desc: 'Multi-platform web development for international clients: Shopify, WordPress, GoHighLevel, Wix, Squarespace and Hostinger. Built marketing funnels and CRM automations, managed social media, produced creatives and videos, and shipped custom-coded landing pages.'
  },
  {
    role: 'Front-End Developer',
    company: 'ISEES Technologies LLP',
    duration: '2022 — April 2025',
    desc: 'Designed and developed responsive React.js and WordPress applications from Figma mockups. Integrated SEO best practices, optimized performance and delivered feature-rich sites in Agile sprints.'
  },
  {
    role: 'Database Administrator',
    company: 'ISEES Technologies LLP',
    duration: '2021 — 2022',
    desc: 'Designed and maintained MS-SQL databases for business applications. Wrote Views, stored procedures and triggers, tuned queries with indexing, and supported development teams with ETL and schema changes.'
  },
  {
    role: 'Web Development Intern',
    company: 'ISEES Technologies LLP',
    duration: 'Nov 2020 — Dec 2020',
    desc: 'Hands-on Shopify web development. Preceded by earlier internships (2017–2019) in HTML/CSS/JS, PHP and WordPress at the same organisation.'
  },
];
const timeline = document.getElementById('timeline');
timeline.innerHTML = `<div class="timeline-progress" id="tlProgress"></div>` +
  experience.map(e => `
    <div class="timeline-item reveal-left">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <h3 class="tl-role">${e.role}</h3>
        <div class="tl-company">${e.company}</div>
        <div class="tl-duration">${e.duration}</div>
        <p class="tl-desc">${e.desc}</p>
      </div>
    </div>`).join('');
timeline.querySelectorAll('.reveal-left').forEach(el => revealObs.observe(el));

const tlProgress = document.getElementById('tlProgress');
let timelineTicking = false;
function updateTimelineProgress() {
  const r = timeline.getBoundingClientRect();
  const vh = window.innerHeight;
  const total = r.height;
  const scrolled = Math.min(total, Math.max(0, vh * 0.7 - r.top));
  tlProgress.style.height = (scrolled / total * 100) + '%';
  timelineTicking = false;
}
window.addEventListener('scroll', () => {
  if (!timelineTicking) {
    timelineTicking = true;
    requestAnimationFrame(updateTimelineProgress);
  }
}, { passive: true });

// =========================================================
// PROCESS
// =========================================================
const processSteps = [
  { n:'01', title:'Discovery',      desc:'Understanding your business, goals and target users.' },
  { n:'02', title:'Strategy',       desc:'Platform choice, scope and roadmap shaped around outcomes.' },
  { n:'03', title:'Design',         desc:'Wireframes, UI and prototypes that feel on-brand.' },
  { n:'04', title:'Build',          desc:'Clean, performant, responsive engineering — shipped in iterations.' },
  { n:'05', title:'Launch & Grow',  desc:'SEO, automation and analytics so results compound over time.' },
];
document.getElementById('processGrid').innerHTML = processSteps.map(p => `
  <div class="process-step reveal">
    <div class="process-num">${p.n}</div>
    <h4>${p.title}</h4>
    <p>${p.desc}</p>
  </div>`).join('');
document.querySelectorAll('#processGrid .reveal').forEach(el => revealObs.observe(el));

// =========================================================
// FAQ
// =========================================================
const faqs = [
  { q:'What kind of projects do you take on?', a:'Websites, e-commerce stores, marketing funnels, CRM automations, SEO and social media — for startups, agencies and international clients.' },
  { q:'Which platforms do you specialize in?', a:'Shopify, WordPress, GoHighLevel, Wix, Squarespace, Hostinger — plus custom builds with HTML, CSS, JavaScript and React.js.' },
  { q:'How long does a typical project take?', a:'Landing pages: 1–2 weeks. Marketing sites: 3–5 weeks. E-commerce and CRM automation systems: 4–8 weeks. Exact timelines are firmed up after discovery.' },
  { q:'Do you work with existing teams?', a:'Yes — I regularly plug into in-house teams and agencies as a specialist, from design handoff to launch.' },
  { q:'Do you also handle SEO, social media and video?', a:'Yes. Alongside development I manage on-page SEO, social media accounts, creatives (Canva/Photoshop) and video editing (Premiere Pro / After Effects).' },
  { q:'How do we get started?', a:"Send a quick note through the contact form or email afnanisane2@gmail.com. I'll reply within 24 hours to schedule a discovery call." },
];
const faqEl = document.getElementById('faq');
faqEl.innerHTML = faqs.map(f => `
  <div class="faq-item">
    <button class="faq-q">${f.q}<span class="faq-toggle">+</span></button>
    <div class="faq-a"><div class="faq-a-inner">${f.a}</div></div>
  </div>`).join('');
faqEl.querySelectorAll('.faq-item').forEach(item => {
  item.querySelector('.faq-q').addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    faqEl.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-a').style.maxHeight = '';
    });
    if (!isOpen) {
      item.classList.add('open');
      const a = item.querySelector('.faq-a');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});
