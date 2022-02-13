import { PageTurner } from '../engine';
import '../engine/styles.css';
import { pages } from './3/pages';
import { settings } from './3/settings';
import "./3/styles.css";

// Entry point into the app from index.html

const game = new PageTurner({
  settings: settings,
  pages: pages,
  state: {}, // state,
});

let isBig = false;
const btnToggleFullscreen = document.getElementById("btn-toggle-fullscreen") as HTMLButtonElement;
btnToggleFullscreen.addEventListener("click", () => {
  isBig = !isBig;
  const ptEl = document.getElementById("page-turner") as HTMLDivElement;
  ptEl.style.width = isBig ? `calc(${window.innerWidth}px - 2rem)` : "800px";
  ptEl.style.height = isBig ? `calc(${window.innerHeight}px - 10rem)` : "600px";
});
