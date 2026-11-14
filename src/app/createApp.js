export function createApp(root) {
  const title = document.createElement('h1');
  title.textContent = 'Corpo em Órbita';
  root.replaceChildren(title);
  return { root };
}