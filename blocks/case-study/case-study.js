/**
 * Case study: one row per project, with three cells found by content:
 * the one with a picture (media), the one with a heading (title, client, role, context,
 * contributions list, optional result) and the remaining one with a list (stack).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const cases = [...block.children].map((row) => {
    const cells = [...row.children];
    const mediaCell = cells.find((cell) => cell.querySelector('picture'));
    const bodyCell = cells.find((cell) => cell.querySelector('h2, h3, h4'));
    const stackCell = cells.find((cell) => cell !== mediaCell && cell !== bodyCell);

    const article = document.createElement('article');
    article.className = 'case';

    if (mediaCell) {
      mediaCell.className = 'case-media';
      article.append(mediaCell);
    }

    if (bodyCell) {
      bodyCell.className = 'case-body';
      const [client, role, context, ...rest] = bodyCell.querySelectorAll(':scope > p');
      client?.classList.add('case-client');
      role?.classList.add('case-role');
      context?.classList.add('case-context');
      rest.forEach((p) => p.classList.add('case-result'));
      bodyCell.querySelector(':scope > ul')?.classList.add('case-contributions');

      const stack = stackCell?.querySelector('ul');
      if (stack) {
        stack.className = 'case-stack';
        stack.setAttribute('aria-label', 'Stack');
        bodyCell.append(stack);
      }
      article.append(bodyCell);
    }
    return article;
  });
  block.replaceChildren(...cases);
}
