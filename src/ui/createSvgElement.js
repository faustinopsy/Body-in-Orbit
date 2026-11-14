const SVG_NAMESPACE = 'http://www.w3.org/2000/svg';

export function createSvgElement(tag, attributes = {}, ...children) {
  const element = document.createElementNS(SVG_NAMESPACE, tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === false) continue;
    element.setAttribute(name, String(value));
  }
  element.append(...children);
  return element;
}