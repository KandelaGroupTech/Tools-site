'use strict';
/* Journey Office Builders: hoarding wall interactions */

(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- Mobile menu ---------- */
  const menuBtn = document.querySelector('.menu-btn');
  const nav = document.getElementById('site-nav');
  if (menuBtn && nav) {
    const setOpen = (open) => {
      nav.classList.toggle('is-open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menuBtn.querySelector('.i-menu').toggleAttribute('hidden', open);
      menuBtn.querySelector('.i-close').toggleAttribute('hidden', !open);
    };
    menuBtn.addEventListener('click', () => setOpen(!nav.classList.contains('is-open')));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); menuBtn.focus(); }
    });
  }

  /* ---------- Viewing window: finished work slides past the cut ---------- */
  document.querySelectorAll('[data-window]').forEach((root) => {
    const track = root.querySelector('.viewport-cut__track');
    const slides = Array.from(track.children);
    const caption = root.querySelector('[data-window-caption]');
    const count = root.querySelector('[data-window-count]');
    const toggle = root.querySelector('[data-window-toggle]');
    let index = 0;
    let timer = null;
    let playing = !reduceMotion.matches;

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((s, n) => s.setAttribute('aria-hidden', String(n !== index)));
      caption.textContent = slides[index].dataset.caption;
      count.textContent = `${index + 1} / ${slides.length}`;
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { stop(); timer = setInterval(() => show(index + 1), 5200); };
    const syncToggle = () => {
      toggle.setAttribute('aria-label', playing ? 'Pause slideshow' : 'Play slideshow');
      toggle.querySelector('.i-pause').toggleAttribute('hidden', !playing);
      toggle.querySelector('.i-play').toggleAttribute('hidden', playing);
    };

    root.querySelector('[data-window-prev]').addEventListener('click', () => { show(index - 1); if (playing) start(); });
    root.querySelector('[data-window-next]').addEventListener('click', () => { show(index + 1); if (playing) start(); });
    toggle.addEventListener('click', () => { playing = !playing; playing ? start() : stop(); syncToggle(); });
    root.addEventListener('focusin', stop);
    root.addEventListener('focusout', () => { if (playing) start(); });

    show(0);
    syncToggle();
    if (playing) start();
  });

  /* ---------- Wall pull-back: before / after ---------- */
  document.querySelectorAll('[data-pull]').forEach((pull) => {
    const range = pull.querySelector('input[type="range"]');
    const set = (v) => {
      pull.style.setProperty('--pos', `${v}%`);
      range.setAttribute('aria-valuetext', `${Math.round(v)}% before, ${Math.round(100 - v)}% after`);
    };
    range.addEventListener('input', () => { pull.classList.remove('is-settling'); set(range.value); });
    set(range.value);

    // One authored moment: the first time a wall scrolls into view, the panel pulls back to reveal the finished side.
    if (!reduceMotion.matches && 'IntersectionObserver' in window && pull.hasAttribute('data-pull-intro')) {
      set(88);
      range.value = 88;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.disconnect();
          requestAnimationFrame(() => {
            pull.classList.add('is-settling');
            range.value = 42;
            set(42);
            setTimeout(() => pull.classList.remove('is-settling'), 950);
          });
        });
      }, { threshold: 0.55 });
      io.observe(pull);
    }
  });

  /* ---------- Project filters ---------- */
  const filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    const cards = document.querySelectorAll('[data-category]');
    const status = document.getElementById('filter-status');
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      const f = btn.dataset.filter;
      filterBar.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      let shown = 0;
      cards.forEach((c) => {
        const match = f === 'all' || c.dataset.category === f;
        c.hidden = !match;
        if (match) shown += 1;
      });
      if (status) status.textContent = `Showing ${shown} project${shown === 1 ? '' : 's'}: ${btn.textContent.trim()}`;
    });
  }

  /* ---------- Quote request form ---------- */
  const form = document.getElementById('contact-form');
  if (form) {
    const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const rules = {
      'first-name': (v) => v ? '' : 'Enter your first name.',
      'last-name': (v) => v ? '' : 'Enter your last name.',
      email: (v) => !v ? 'Enter your email so we can reply.' : (email.test(v) ? '' : 'That email looks incomplete. Check for a missing @ or domain.'),
      role: (v) => v ? '' : 'Choose the option that best describes you.',
      message: (v) => v ? '' : 'Tell us a little about the space and the work.',
    };
    const check = (id) => {
      const input = document.getElementById(id);
      const field = input.closest('.field');
      const msg = rules[id](input.value.trim());
      field.classList.toggle('has-error', Boolean(msg));
      input.setAttribute('aria-invalid', String(Boolean(msg)));
      field.querySelector('.error').textContent = msg;
      return !msg;
    };
    Object.keys(rules).forEach((id) => {
      const input = document.getElementById(id);
      input.addEventListener('blur', () => { if (input.value.trim() || input.closest('.field').classList.contains('has-error')) check(id); });
      input.addEventListener('input', () => { if (input.closest('.field').classList.contains('has-error')) check(id); });
    });

    const status = document.getElementById('contact-success');
    const submit = document.getElementById('contact-submit');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (document.getElementById('bot-field').value) return;
      const results = Object.keys(rules).map(check);
      if (results.includes(false)) {
        form.querySelector('.has-error input, .has-error select, .has-error textarea').focus();
        return;
      }
      submit.disabled = true;
      submit.querySelector('span').textContent = 'Sending request…';
      // Same as the current site: no delivery backend is wired up yet.
      setTimeout(() => {
        form.reset();
        submit.disabled = false;
        submit.querySelector('span').textContent = 'Send request';
        status.hidden = false;
        status.focus();
      }, 900);
    });
  }
})();
