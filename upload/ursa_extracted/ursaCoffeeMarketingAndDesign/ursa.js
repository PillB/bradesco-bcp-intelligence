/* URSA dossier — light, dependency-free interactivity */
(function(){
  'use strict';

  // ---------- Nav active-state on scroll ----------
  function setActiveNav(){
    const links = document.querySelectorAll('.ursa-header__nav a');
    if(!links.length) return;
    const sections = Array.from(links).map(l => {
      const href = l.getAttribute('href') || '';
      if(!href.startsWith('#')) return null;
      const el = document.querySelector(href);
      return el ? {link:l, el:el} : null;
    }).filter(Boolean);

    if(!sections.length) return;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          sections.forEach(s => s.link.removeAttribute('aria-current'));
          const match = sections.find(s => s.el === entry.target);
          if(match) match.link.setAttribute('aria-current','page');
        }
      });
    }, {rootMargin:'-40% 0px -55% 0px', threshold:0});
    sections.forEach(s => observer.observe(s.el));
  }

  // ---------- Collapsible "details" toggles ----------
  function wireToggles(){
    document.querySelectorAll('[data-toggle]').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.getAttribute('data-toggle'));
        if(!target) return;
        const isOpen = target.hasAttribute('hidden') === false;
        if(isOpen){ target.setAttribute('hidden',''); btn.setAttribute('aria-expanded','false'); }
        else { target.removeAttribute('hidden'); btn.setAttribute('aria-expanded','true'); }
      });
    });
  }

  // ---------- Smooth-scroll for in-page anchor links ----------
  function wireAnchors(){
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const id = a.getAttribute('href');
        if(id.length < 2) return;
        const target = document.querySelector(id);
        if(!target) return;
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth', block:'start'});
        history.replaceState(null, '', id);
      });
    });
  }

  // ---------- Print button ----------
  function wirePrint(){
    document.querySelectorAll('[data-action="print"]').forEach(b => {
      b.addEventListener('click', () => window.print());
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    setActiveNav();
    wireToggles();
    wireAnchors();
    wirePrint();
  });
})();
