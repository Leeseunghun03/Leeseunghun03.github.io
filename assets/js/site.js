(() => {
  const header = document.querySelector('.site-header');
  const sectionLinks = [...document.querySelectorAll('nav a[data-section]')];
  const sections = sectionLinks.map(link => document.getElementById(link.dataset.section));
  const updateHeaderOffset = () => {
    if (header) document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight + 24}px`);
  };
  updateHeaderOffset();
  window.addEventListener('resize', updateHeaderOffset);
  if (document.querySelector('.site-main--home') && sections.every(Boolean)) {
    const updateSection = () => {
      const cutoff = (header?.offsetHeight || 80) + 28;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= cutoff) current = section;
      }
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
      for (const link of sectionLinks) {
        if (link.dataset.section === current.id) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    };
    let frame = null;
    const scheduleUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(() => { frame = null; updateSection(); });
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('load', updateSection);
    updateSection();
  }
  const copyStatus = document.querySelector('[data-copy-status]');
  const copyTimers = new WeakMap();
  const copying = new WeakSet();
  const copyText = async (text) => {
    if (navigator.clipboard?.writeText) {
      let timeout;
      try {
        await Promise.race([
          navigator.clipboard.writeText(text),
          new Promise((_, reject) => {
            timeout = setTimeout(() => reject(new Error('Clipboard did not respond')), 2000);
          })
        ]);
        return;
      } catch {} finally {
        clearTimeout(timeout);
      }
    }
    const previousFocus = document.activeElement;
    const input = document.createElement('textarea');
    input.value = text;
    input.readOnly = true;
    input.tabIndex = -1;
    input.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px';
    document.body.append(input);
    let payloadWritten = false;
    const onCopy = (event) => {
      if (!event.clipboardData) return;
      event.clipboardData.setData('text/plain', text);
      event.preventDefault();
      payloadWritten = true;
    };
    document.addEventListener('copy', onCopy);
    let copied = false;
    try {
      input.focus({ preventScroll: true });
      input.select();
      input.setSelectionRange(0, text.length);
      copied = document.execCommand?.('copy') === true && payloadWritten;
    } finally {
      document.removeEventListener('copy', onCopy);
      input.remove();
      previousFocus?.focus({ preventScroll: true });
    }
    if (!copied) throw new Error('Clipboard unavailable');
  };
  for (const button of document.querySelectorAll('[data-citation-id]')) {
    button.addEventListener('click', async () => {
      const source = document.getElementById(button.dataset.citationId);
      const help = document.getElementById(button.dataset.citationId + '-help');
      if (!source || copying.has(button)) return;
      copying.add(button);
      clearTimeout(copyTimers.get(button));
      button.setAttribute('aria-busy', 'true');
      button.textContent = 'Copying…';
      if (copyStatus) copyStatus.textContent = '';
      try {
        await copyText(source.textContent.trim() + '\n');
        source.hidden = true;
        if (help) help.hidden = true;
        button.setAttribute('aria-expanded', 'false');
        button.textContent = 'Copied!';
        if (copyStatus) copyStatus.textContent = button.getAttribute('aria-label').replace('Copy BibTeX for ', 'BibTeX copied for ');
        button.focus({ preventScroll: true });
        copyTimers.set(button, setTimeout(() => { button.textContent = 'BibTeX'; }, 2000));
      } catch {
        source.hidden = false;
        if (help) help.hidden = false;
        button.setAttribute('aria-expanded', 'true');
        source.tabIndex = 0;
        source.focus({ preventScroll: true });
        const range = document.createRange();
        range.selectNodeContents(source);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        button.textContent = 'Copy manually';
        if (copyStatus) copyStatus.textContent = 'Automatic copy is unavailable. Copy the selected BibTeX below or download the citation.';
      } finally {
        copying.delete(button);
        button.removeAttribute('aria-busy');
      }
    });
  }
  const previews = [...document.querySelectorAll('video[data-preview]')];
  if (!previews.length) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const observer = new IntersectionObserver((entries) => {
    for (const { target: video, isIntersecting } of entries) {
      if (!isIntersecting || reducedMotion.matches || document.hidden) {
        video.pause();
        video.classList.remove('is-playing');
        continue;
      }
      if (!video.src) video.src = video.dataset.preview;
      video.play().then(() => video.classList.add('is-playing')).catch(() => {});
    }
  }, { threshold: 0.2 });
  const update = () => {
    for (const video of previews) {
      observer.unobserve(video);
      video.pause();
      video.classList.remove('is-playing');
      if (!reducedMotion.matches && !document.hidden) observer.observe(video);
    }
  };
  reducedMotion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  update();
})();
