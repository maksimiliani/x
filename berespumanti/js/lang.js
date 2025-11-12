(function() {
  // Detect or load preferred language
  const storedLang = localStorage.getItem('langPreference');
  const browserLang = navigator.language.startsWith('en') ? 'en' :
                      navigator.language.startsWith('pl') ? 'pl' : 'pl';
  let lang = storedLang || browserLang;

  // Detect explicit visit via /en or /pl (in case of shared URLs)
  const path = window.location.pathname.toLowerCase();
  if (path.startsWith('/en')) lang = 'en';
  if (path.startsWith('/pl')) lang = 'pl';

  // Persist language
  localStorage.setItem('langPreference', lang);
  document.documentElement.setAttribute('lang', lang);

  // Redirect for top-level pages only (not CMS)
  const staticPages = ['/', '/about', '/contact', '/cookies'];
  const isStatic = staticPages.some(p => path === p || path === p + '/');

  // Mapping for redirection targets (adjust for your structure)
  const redirects = {
    en: {
      '/': '/en',          // your English home slug
      '/about': '/en/about-us',
      '/contact': '/en/contact',
      '/cookies': '/en/cookies-policy'
    },
    pl: {
      '/': '/',             // or keep root for Polish
      '/about': '/about-us',
      '/contact': '/contact',
      '/cookies': '/cookies-policy'
    }
  };

  if (isStatic) {
    const target = redirects[lang][path];
    if (target && path !== target) {
      window.location.replace(target);
    }
  }

  // Visibility control for CMS and static elements (data-lang)
  function applyLang() {
    document.querySelectorAll('[data-lang]').forEach(el => {
      const active = el.dataset.lang === lang;
      el.style.display = active ? 'block' : 'none';
      if (active) el.removeAttribute('aria-hidden');
      else el.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.navbar-item.lang').forEach(el => {
      if (el.innerHTML == lang) el.classList.add('current');
      el.addEventListener("mouseup", function(event) {
        localStorage.setItem('langPreference', this.innerTex.toLowerCase);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyLang);
  } else {
    applyLang();
  }
})();
