(function () {
 const renderMode = window.PORTFOLIO_RENDER_MODE || document.documentElement.dataset.renderMode;
 if (renderMode !== 'mobile') return;

 const icon = {
  home: 'portfolio98-internet-explorer.webp',
  projects: 'icons/documents.png',
  skills: 'portfolio98-computer.png',
  experience: 'icons/msoutlook.png',
  contact: 'icons/address-book.webp',
  readme: 'icons/notepad.png',
  cv: 'icons/notepad.png',
  github: 'portfolio98-github.png',
  linkedin: 'portfolio98-linkedin.webp'
 };

 const routeLabels = {
  home: 'About Me',
  projects: 'Projects',
  skills: 'Skills',
  experience: 'Experience',
  contact: 'Contact',
  readme: 'README.txt'
 };

 function text(selector, root = document) {
  return root.querySelector(selector)?.textContent.trim() || '';
 }

 function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
   '&': '&amp;',
   '<': '&lt;',
   '>': '&gt;',
   '"': '&quot;',
   "'": '&#39;'
  }[char]));
 }

 function attrs(attributes) {
  return Object.entries(attributes)
   .filter(([, value]) => value !== undefined && value !== null && value !== '')
   .map(([key, value]) => ` ${key}="${escapeHtml(value)}"`)
   .join('');
 }

 function image(src, alt = '') {
  return `<img${attrs({ src, alt })}>`;
 }

 function getProfileData() {
  const article = document.querySelector('.britannica-profile-article');
  return {
   name: text('#britannicaTitle') || 'Sofia Cardenas Garcia',
   role: text('h3', article) || 'Student, ML Systems & Infrastructure Developer',
   bio: text('p', article),
   photo: article?.querySelector('img')?.getAttribute('src') || 'ChatGPT Image Jul 22, 2026, 08_23_10 PM.png',
   date: text('.britannica-ref-tabs div')
  };
 }

 function getNewsData() {
  const aside = document.querySelector('.britannica-ref-news');
  if (!aside) return [];
  return Array.from(aside.querySelectorAll('h4')).map(heading => {
   const list = heading.nextElementSibling;
   return {
    heading: heading.textContent.trim(),
    items: list ? Array.from(list.querySelectorAll('li')).map(item => item.textContent.trim()) : []
   };
  }).filter(section => section.heading && section.items.length);
 }

 function getProjectsData() {
  if (typeof PROJECT_DATA === 'undefined') return [];
  return Object.entries(PROJECT_DATA).map(([key, project]) => ({ key, ...project }));
 }

 function getExperienceData() {
  if (typeof EXPERIENCE_DATA === 'undefined') return [];
  return Object.entries(EXPERIENCE_DATA).map(([key, item]) => ({ key, ...item }));
 }

 function getSkillsData() {
  const source = document.getElementById('skillsSource');
  if (!source) return [];
  return Array.from(source.querySelectorAll('.skill-group')).map(group => {
   const category = text('.skill-group-title', group).replace(/^\[/, '').replace(/\]$/, '');
   const skills = Array.from(group.querySelectorAll('.stag')).map(tag => {
    return tag.getAttribute('title') || tag.getAttribute('aria-label') || tag.textContent.trim();
   }).filter(Boolean);
   return { category, skills };
  }).filter(group => group.category && group.skills.length);
 }

 function getReadmeData() {
  return document.querySelector('#readmeWindow .readme-textarea')?.value || '';
 }

 function getExternalLinks() {
  return {
   github: document.querySelector('.desktop-icons a[href*="github.com"]')?.href || 'https://github.com/sofialougvrc',
   linkedin: document.querySelector('.desktop-icons a[href*="linkedin.com"]')?.href || 'https://linkedin.com/in/sofia-cardenas-garcia-63239a2b4'
  };
 }

 function MobileWindow(title, iconSrc, body, status = 'Ready') {
  return `
   <div class="mobile-window">
    <div class="mobile-titlebar">
     <span>${image(iconSrc, '')}${escapeHtml(title)}</span>
     <div class="mobile-window-controls" aria-hidden="true">
      <button type="button">_</button><button type="button">□</button><button type="button">×</button>
     </div>
    </div>
    <div class="mobile-menubar" aria-label="${escapeHtml(title)} menu">
     <span>File</span><span>Edit</span><span>View</span><span>Help</span>
    </div>
    <div class="mobile-body">${body}</div>
    <div class="mobile-status"><span>${escapeHtml(status)}</span><span>Mobile</span></div>
   </div>`;
 }

 function MobileAppList() {
  const links = getExternalLinks();
  const apps = [
   { key: 'home', label: 'About Me', icon: icon.home },
   { key: 'projects', label: 'Projects', icon: icon.projects },
   { key: 'skills', label: 'Skills', icon: icon.skills },
   { key: 'experience', label: 'Experience', icon: icon.experience },
   { key: 'contact', label: 'Contact', icon: icon.contact },
   { key: 'readme', label: 'README.txt', icon: icon.readme },
   { key: 'cv', label: 'CV', icon: icon.cv },
   { key: 'github', label: 'GitHub', icon: icon.github, href: links.github },
   { key: 'linkedin', label: 'LinkedIn', icon: icon.linkedin, href: links.linkedin }
  ];

  const appMarkup = apps.map(app => {
   if (app.href) {
    return `<a class="mobile-app" href="${escapeHtml(app.href)}" target="_blank" rel="noopener">${image(app.icon, '')}<span>${escapeHtml(app.label)}</span></a>`;
   }
   if (app.key === 'cv') {
    return `<button class="mobile-app" type="button" data-mobile-action="cv">${image(app.icon, '')}<span>CV</span></button>`;
   }
   return `<button class="mobile-app" type="button" data-mobile-route="${escapeHtml(app.key)}">${image(app.icon, '')}<span>${escapeHtml(app.label)}</span></button>`;
  }).join('');

  return MobileWindow(
   'Sofia Portfolio - Mobile',
   'portfolio98-windows-logo.png',
   `<div class="mobile-inset mobile-copy">Tap an icon to open a section. The full Windows 98 desktop stays available on laptop and desktop screens.</div><div class="mobile-app-grid">${appMarkup}</div>`,
   '9 object(s)'
  );
 }

 function MobileSectionView(route, body, status) {
  return MobileWindow(
   routeLabels[route] || 'Portfolio',
   icon[route] || 'portfolio98-windows-logo.png',
   `<div class="mobile-section-toolbar"><button class="mobile-button" type="button" data-mobile-back>Back</button><span class="mobile-section-title">${escapeHtml(routeLabels[route] || 'Portfolio')}</span></div>${body}`,
   status || 'Ready'
  );
 }

 function MobileBritannica() {
  const profile = getProfileData();
  const news = getNewsData().map(section => `
   <div class="mobile-inset">
    <h3>${escapeHtml(section.heading)}</h3>
    <ul>${section.items.map(item => `<li><a class="mobile-link" href="#" onclick="return false;">${escapeHtml(item)}</a></li>`).join('')}</ul>
   </div>`).join('');

  return MobileSectionView('home', `
   <div class="mobile-inset mobile-profile">
    ${image(profile.photo, 'Pixel art portrait of Sofia Cardenas Garcia')}
    <div>
     <h1>${escapeHtml(profile.name)}</h1>
     <h2>${escapeHtml(profile.role)}</h2>
     <p>${escapeHtml(profile.bio)}</p>
    </div>
   </div>
   <div class="mobile-news">${news}</div>`,
   profile.date || 'britannica.com'
  );
 }

 function MobileProjects() {
  const projects = getProjectsData();
  const cards = projects.map(project => `
   <article class="mobile-card">
    <h3>${escapeHtml(project.title)}.exe</h3>
    <p>${escapeHtml(project.description)}</p>
    <div class="mobile-chip-row">${project.tags.map(tag => `<span class="mobile-chip">${escapeHtml(tag)}</span>`).join('')}</div>
    <div class="mobile-project-actions">
     <a class="mobile-button" href="${escapeHtml(project.github)}" target="_blank" rel="noopener">GitHub</a>
     <a class="mobile-button" href="${escapeHtml(project.demo)}">Demo</a>
    </div>
   </article>`).join('');
  return MobileSectionView('projects', `<div class="mobile-card-list">${cards}</div>`, `${projects.length} project(s)`);
 }

 function MobileSkills() {
  const groups = getSkillsData().map(group => `
   <section class="mobile-skill-group">
    <h3>${escapeHtml(group.category)}</h3>
    <div class="mobile-chip-row">${group.skills.map(skill => `<span class="mobile-chip">${escapeHtml(skill)}</span>`).join('')}</div>
   </section>`).join('');
  return MobileSectionView('skills', `<div class="mobile-skills">${groups}</div>`, 'Details view');
 }

 function MobileExperience() {
  const entries = getExperienceData().map(item => `
   <article class="mobile-card">
    <div class="mobile-experience-meta">
     <strong>From:</strong><span>${escapeHtml(item.from)}</span>
     <strong>Subject:</strong><span>${escapeHtml(item.subject)}</span>
     <strong>Date:</strong><span>${escapeHtml(item.date)}</span>
     <strong>Location:</strong><span>${escapeHtml(item.location)}</span>
    </div>
    <p>${escapeHtml(item.body)}</p>
   </article>`).join('');
  return MobileSectionView('experience', `<div class="mobile-card-list">${entries}</div>`, 'Inbox');
 }

 function MobileContact() {
  return MobileSectionView('contact', `
   <form class="mobile-form mobile-inset" data-mobile-contact>
    <label for="mobile-contact-subject">Subject</label>
    <input id="mobile-contact-subject" name="subject" type="text" autocomplete="off">
    <label for="mobile-contact-body">Body/Message</label>
    <textarea id="mobile-contact-body" name="body"></textarea>
    <div class="mobile-project-actions"><button class="mobile-button" type="submit">Send</button></div>
   </form>`,
   'mailto: ready'
  );
 }

 function MobileReadme() {
  return MobileSectionView('readme', `<textarea class="mobile-readme" readonly spellcheck="false">${escapeHtml(getReadmeData())}</textarea>`, 'Notepad');
 }

 function render(route = 'list') {
  const root = document.getElementById('mobileRoot');
  if (!root) return;
  const views = {
   home: MobileBritannica,
   projects: MobileProjects,
   skills: MobileSkills,
   experience: MobileExperience,
   contact: MobileContact,
   readme: MobileReadme
  };
  root.innerHTML = `<div class="mobile-shell">${route === 'list' ? MobileAppList() : views[route]()}</div>`;
 }

 function openCVFromMobile() {
  if (typeof openCV === 'function') {
   openCV({ preventDefault() {} });
  }
 }

 function sendMobileContact(event) {
  event.preventDefault();
  const subject = document.getElementById('mobile-contact-subject')?.value.trim() || '';
  const body = document.getElementById('mobile-contact-body')?.value.trim() || '';
  window.location.href = 'mailto:sofialou07@gmail.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
 }

 function bindMobileEvents(root) {
  root.addEventListener('click', event => {
   const routeButton = event.target.closest('[data-mobile-route]');
   const backButton = event.target.closest('[data-mobile-back]');
   const cvButton = event.target.closest('[data-mobile-action="cv"]');

   if (routeButton) {
    render(routeButton.dataset.mobileRoute);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
   }
   if (backButton) {
    render('list');
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
   }
   if (cvButton) openCVFromMobile();
  });

  root.addEventListener('submit', event => {
   if (event.target.matches('[data-mobile-contact]')) sendMobileContact(event);
  });
 }

 function initMobileShell() {
  document.body.dataset.renderMode = 'mobile';
  const root = document.createElement('div');
  root.id = 'mobileRoot';
  document.body.appendChild(root);
  bindMobileEvents(root);
  render('list');
 }

 if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMobileShell, { once: true });
 } else {
  initMobileShell();
 }
}());
