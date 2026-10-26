/**
 * Delayed phase: the block inspector. "Show blocks" outlines every block with its name,
 * the phase it loaded in and when it finished (data-* set in scripts.js), like the
 * overlays of the AEM editor. Styles live in lazy-styles.css.
 */
const toggle = document.querySelector('.block-inspector-toggle');

if (toggle) {
  toggle.hidden = false;
  toggle.addEventListener('click', () => {
    const on = toggle.getAttribute('aria-pressed') !== 'true';
    toggle.setAttribute('aria-pressed', String(on));
    document.body.classList.toggle('show-blocks', on);
  });
}
