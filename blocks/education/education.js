/**
 * Education: one row per degree or certification. Cells: years | title, place, notes.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'education-item';
    const [when, body] = row.children;
    when?.classList.add('education-when');
    body?.classList.add('education-body');
  });
}
