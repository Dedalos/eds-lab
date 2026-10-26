import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * Header: loads /nav (or the `nav` metadata) as a fragment.
 * The nav document holds: a paragraph with the home link (brand), a list of section links and,
 * optionally, a paragraph without a link with the label of the block inspector button.
 * Styles live in styles/styles.css, shared with the portfolio's server-rendered header.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);
  block.textContent = '';
  if (!fragment) return;

  const paragraphs = [...fragment.querySelectorAll('p')];
  const brand = paragraphs.map((p) => p.querySelector('a')).find(Boolean);
  // Before the brand link is moved out, which would leave its paragraph without a link
  const label = paragraphs.find((p) => !p.querySelector('a'));
  if (brand) {
    brand.className = 'brand';
    brand.removeAttribute('title');
    block.append(brand);
  }

  const links = [...fragment.querySelectorAll('li a')];
  if (links.length) {
    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Sections');
    links.forEach((a) => a.removeAttribute('title'));
    nav.append(...links);
    block.append(nav);
  }

  // Wired in scripts/delayed.js
  const toggle = document.createElement('button');
  toggle.className = 'block-inspector-toggle';
  toggle.type = 'button';
  toggle.hidden = true;
  toggle.setAttribute('aria-pressed', 'false');
  toggle.textContent = label ? label.textContent.trim() : 'Show blocks';
  block.append(toggle);
}
