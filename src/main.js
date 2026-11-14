import './styles/tokens.css';
import './styles/base.css';
import './styles/ui.css';
import { createApp } from './app/createApp.js';
import { createServices } from './app/createServices.js';

async function start() {
  const services = await createServices();
  await createApp(document.querySelector('#app'), services);
}

start();