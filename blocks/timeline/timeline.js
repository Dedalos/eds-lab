/**
 * Timeline: one row per role. Cells: period | company, role, place, summary?, bullets? | tags.
 * The rows are readable as they are; when the block gets close to the viewport, the React
 * app (timeline-app.js, built with `npm run build:react` from src-react/) takes over and adds
 * the technology filter and the details toggles.
 * @param {Element} block The block element
 */

const text = (el) => (el ? el.textContent.trim() : '');

function readRoles(block) {
  return [...block.children].filter((row) => row.children[1]).map((row) => {
    const [periodCell, bodyCell, tagsCell] = row.children;
    const [role, place, summary] = [...bodyCell.querySelectorAll(':scope > p')].map(text);
    return {
      period: text(periodCell),
      company: text(bodyCell.querySelector('h2, h3, h4')),
      role,
      place,
      summary,
      bullets: [...bodyCell.querySelectorAll('li')].map(text),
      tags: tagsCell ? [...tagsCell.querySelectorAll('li')].map(text) : [],
    };
  });
}

export default function decorate(block) {
  const roles = readRoles(block);

  [...block.children].forEach((row) => {
    row.className = 'timeline-item';
    const [period, body, tags] = row.children;
    period?.classList.add('timeline-period');
    body?.classList.add('timeline-body');
    tags?.classList.add('timeline-tags');
  });

  // Keeps the space of the filter so the list does not move when React mounts
  const controls = document.createElement('div');
  controls.className = 'timeline-controls';
  block.prepend(controls);

  const observer = new IntersectionObserver(async (entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    const { default: mount } = await import('./timeline-app.js');
    mount(block, roles, window.placeholders || {});
  }, { rootMargin: '400px 0px' });
  observer.observe(block);
}
