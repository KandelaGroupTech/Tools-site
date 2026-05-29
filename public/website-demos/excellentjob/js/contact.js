'use strict';
/* ============================================================
   JOURNEY OFFICE BUILDERS — Contact Form JS
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const fields = [
    { id: 'contact-name',    required: true,  msg: 'Please enter your name.' },
    { id: 'contact-email',   required: true,  msg: 'Please enter a valid email address.', type: 'email' },
    { id: 'contact-message', required: true,  msg: 'Please enter your message.' },
  ];

  function validateEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  function setError(fieldId, msg) {
    const input = document.getElementById(fieldId);
    const group = input?.closest('.form-group');
    const errEl = group?.querySelector('.form-error');
    if (group) group.classList.add('has-error');
    if (errEl) errEl.textContent = msg;
  }

  function clearError(fieldId) {
    const input = document.getElementById(fieldId);
    const group = input?.closest('.form-group');
    if (group) group.classList.remove('has-error');
  }

  // Real-time validation on blur
  fields.forEach(({ id, type }) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener('blur', () => {
      const val = input.value.trim();
      if (!val) {
        setError(id, `This field is required.`);
      } else if (type === 'email' && !validateEmail(val)) {
        setError(id, 'Please enter a valid email address.');
      } else {
        clearError(id);
      }
    });
    input.addEventListener('input', () => clearError(id));
  });

  // Submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let valid = true;

    fields.forEach(({ id, required, msg, type }) => {
      const input = document.getElementById(id);
      if (!input) return;
      const val = input.value.trim();

      if (required && !val) {
        setError(id, msg);
        valid = false;
      } else if (type === 'email' && val && !validateEmail(val)) {
        setError(id, 'Please enter a valid email address.');
        valid = false;
      } else {
        clearError(id);
      }
    });

    if (!valid) return;

    const submitBtn = form.querySelector('#contact-submit');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    // Simulate sending (replace with real Formspree/EmailJS call)
    setTimeout(() => {
      const successEl = document.getElementById('contact-success');
      if (successEl) successEl.classList.add('visible');
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
      setTimeout(() => successEl?.classList.remove('visible'), 6000);
    }, 1200);
  });
});
