/**
 * Hero: a photo, the lines before the heading (name), the heading, an intro, buttons
 * (bold or italic links) and a list of facts. Pieces are found by type, not by position,
 * so authors can move or leave out cells.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const heading = block.querySelector('h1, h2');
  if (!heading) return;
  const body = heading.parentElement;
  const picture = block.querySelector('picture');
  const facts = body.querySelector(':scope > ul');
  const actions = [...body.querySelectorAll(':scope > .button-wrapper')];
  const before = [];
  const after = [];
  [...body.children].forEach((el) => {
    if (el === heading || el === facts || actions.includes(el) || el.contains(picture)) return;
    // eslint-disable-next-line no-bitwise
    if (el.compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING) before.push(el);
    else after.push(el);
  });

  const id = document.createElement('div');
  id.className = 'hero-id';
  const idText = document.createElement('div');
  before.forEach((el) => el.classList.add('hero-name'));
  if (facts) facts.className = 'hero-facts';
  idText.append(...before, ...(facts ? [facts] : []));
  if (picture) id.append(picture);
  id.append(idText);

  if (after[0]) after[0].classList.add('hero-intro');

  const buttons = document.createElement('div');
  buttons.className = 'hero-actions';
  buttons.append(...actions);

  block.replaceChildren(
    ...(picture || idText.children.length ? [id] : []),
    heading,
    ...after,
    ...(actions.length ? [buttons] : []),
  );
}
