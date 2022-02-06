import { Mcge } from '../engine';
import '../engine/styles.css';
import { pages } from './2/pages';
import { settings } from './2/settings';

// Entry point into the app from index.html

const game = new Mcge({
  settings: settings,
  pages: pages,
  state: {}, // state,
});

let isBig = false;
const btnToggleFullscreen = document.getElementById("btn-toggle-fullscreen") as HTMLButtonElement;
btnToggleFullscreen.addEventListener("click", () => {
  isBig = !isBig;
  const mcgeEl = document.getElementById("mcge") as HTMLDivElement;
  mcgeEl.style.width = isBig ? `calc(${window.innerWidth}px - 2rem)` : "800px";
  mcgeEl.style.height = isBig ? `calc(${window.innerHeight}px - 10rem)` : "600px";
});
