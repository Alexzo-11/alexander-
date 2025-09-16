 // Helpers
    const qs = s => document.querySelector(s);
    const qsa = s => Array.from(document.querySelectorAll(s));

    // Mobile nav
    const burger = qs('.burger');
    const mobile = qs('#mobile-nav');
    burger?.addEventListener('click', () => {
      const open = mobile.hasAttribute('hidden') === false;
      mobile.toggleAttribute('hidden', open);
      burger.setAttribute('aria-expanded', String(!open));
      mobile.style.display = open ? 'none' : 'block';
    });

    // Smooth close mobile on link click
    qsa('#mobile-nav a').forEach(a => a.addEventListener('click', () => {
      mobile?.setAttribute('hidden', '');
      mobile.style.display = 'none';
      burger?.setAttribute('aria-expanded', 'false');
    }));

    // Year
    qs('#year').textContent = new Date().getFullYear();

    // Skills animate on load
    const animateBars = () => qsa('.fill').forEach(el => {
      const pct = el.getAttribute('data-fill') || 0;
      el.animate([{width:'0%'},{width:pct+'%'}], {duration:900, fill:'forwards', easing:'ease-out'});
    });
    if (document.readyState !== 'loading') animateBars(); else document.addEventListener('DOMContentLoaded', animateBars);

    // Project filters
    const grid = qs('#project-grid');
    const chips = qsa('.chip');
    chips.forEach(chip => chip.addEventListener('click', e => {
      const filter = chip.getAttribute('data-filter');
      chips.forEach(c => c.classList.toggle('active', c===chip));
      qsa('.project').forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.style.display = match ? '' : 'none';
      });
    }));

    // Modal preview (image/video placeholder). Replace data-modal-src with real URLs when available.
    const modal = qs('#preview-modal');
    const modalTitle = qs('#modal-title');
    const modalBody = qs('#modal-body');
    const modalDesc = qs('#modal-desc');

    qsa('[data-open-modal]').forEach(btn => btn.addEventListener('click', e => {
      e.preventDefault();
      const t = e.currentTarget;
      const type = t.getAttribute('data-modal-type');
      const title = t.getAttribute('data-modal-title') || 'Preview';
      const src = t.getAttribute('data-modal-src');
      const desc = t.getAttribute('data-modal-desc') || '';

      modalTitle.textContent = title;
      modalDesc.textContent = desc;
      modalBody.innerHTML = '';

      if (type === 'video'){
        const video = document.createElement('video');
        video.setAttribute('controls','');
        video.setAttribute('playsinline','');
        video.style.width = '100%';
        video.style.borderRadius = '12px';
        if (src) {
          const source = document.createElement('source');
          source.src = src;
          source.type = 'video/mp4';
          video.appendChild(source);
        } else {
          video.innerHTML = '<source src="" type="video/mp4">';
        }
        const hint = document.createElement('div');
        hint.className = 'muted';
        hint.style.marginTop = '8px';
        hint.textContent = src ? '' : 'Add your MP4 URL to data-modal-src on the project button to play the real video.';
        modalBody.appendChild(video);
        modalBody.appendChild(hint);
      } else {
        const frame = document.createElement('div');
        frame.style.aspectRatio = '16/10';
        frame.style.border = '1px solid #5e2a2aff';
        frame.style.borderRadius = '12px';
        frame.style.background = 'linear-gradient(135deg,#1b2152,#0f1434)';
        frame.style.display = 'grid';
        frame.style.placeItems = 'center';
        frame.textContent = src ? '' : 'Replace with your image — set data-modal-src';
        if (src){
          const img = document.createElement('img');
          img.src = src; img.alt = title; img.style.width = '100%'; img.style.borderRadius = '12px';
          frame.innerHTML = ''; frame.appendChild(img);
        }
        modalBody.appendChild(frame);
      }
      if (typeof modal.showModal === 'function') modal.showModal();
      else modal.setAttribute('open','');
    }));

    // Close modal on background click (for <dialog>)
    modal?.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const clickedInDialog = (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom);
      if (!clickedInDialog) modal.close();
    });

    // Contact form (demo validation only)
    qs('#contact-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const data = Object.fromEntries(new FormData(form));
      const status = qs('#form-status');

      if (!data.name || !data.email || !data.message){
        status.textContent = 'Please complete all required fields.';
        return;
      }
      // Replace with your backend endpoint (e.g., using fetch to Netlify Functions, Node/Express, etc.)
      status.textContent = 'Thanks! Your message has been queued. I will reply within 24–48 hours.';
      form.reset();
    });