/**
 * Cards: one row per card (heading + text, in one or more cells). Rendered as a list.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    [...row.children].forEach((cell) => li.append(...cell.childNodes));
    ul.append(li);
  });
  block.replaceChildren(ul);
}
