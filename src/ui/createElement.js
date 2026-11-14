export function createElement(tag, attributes = {}, ...children) {
  const element = document.createElement(tag);
  for (const [name, value] of Object.entries(attributes)) {
    if (value === null || value === undefined || value === false) continue;
    element.setAttribute(name, value === true ? '' : value);
  }
  element.append(...children);
  return element;
}