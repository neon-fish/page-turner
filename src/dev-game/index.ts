import { MCGE } from '../engine';
import '../engine/styles.css';
import { IMAGE_URL } from './assets';
import { pages } from './pages';

// Entry point into the app from index.html

const game = new MCGE({
  settings: {
    containerEl: "#mcge",
    debug: true,
    content: {
      // top: "10%",
      height: "40%",
      // blur: true,
      // tint: true,
    },
    choices: {
      tint: true,
      left: "10%",
      width: "80%",
    },
    images: {
      defaultBgImage: IMAGE_URL.cyberpunkStreet,
    },
    theme: {
      // choiceGap: "0.5rem",
      // choiceBorderRadius: "1rem",
    },
  },
  pages: pages,
});

let isBig = false;
const btnToggleFullscreen = document.getElementById("btn-toggle-fullscreen") as HTMLButtonElement;
btnToggleFullscreen.addEventListener("click", () => {
  isBig = !isBig;
  const mcgeEl = document.getElementById("mcge") as HTMLDivElement;
  mcgeEl.style.width = isBig ? `calc(${window.innerWidth}px - 2rem)` : "800px";
  mcgeEl.style.height = isBig ? `calc(${window.innerHeight}px - 10rem)` : "600px";
});
