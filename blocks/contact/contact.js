/**
 * Contact: one row per channel. Cells: label | link. Rendered as a description list.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const dl = document.createElement('dl');
  // A cell's content, without the <p> that wrapTextNodes() or the authoring tool adds
  const content = (cell) => (cell?.querySelector(':scope > p') || cell)?.childNodes ?? [];
  [...block.children].forEach((row) => {
    const [label, value] = row.children;
    if (!value) return;
    const dt = document.createElement('dt');
    const dd = document.createElement('dd');
    dt.append(...content(label));
    dd.append(...content(value));
    dl.append(dt, dd);
  });
  block.replaceChildren(dl);
}
