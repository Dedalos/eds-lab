/**
 * Skills: one row per group. Cells: group name | list of skills.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.className = 'skills-group';
    const [name, list] = row.children;
    name?.classList.add('skills-name');
    list?.classList.add('skills-list');
  });
}
