/**
 * Beyond code: a row of text and link, and a row with one photo per cell (in any order).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = row.querySelector('picture') ? 'beyond-code-photos' : 'beyond-code-text';
  });
}
