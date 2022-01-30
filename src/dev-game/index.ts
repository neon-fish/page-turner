import { Mcge } from '../engine';
import '../engine/styles.css';
import { IMAGE_URL } from './2/assets';
import { pages } from './2/pages';
// import { state } from './2/state';
import { theme } from './2/theme';

// Entry point into the app from index.html

const game = new Mcge({
  settings: {
    containerEl: "#mcge",
    debug: true,
    content: {
      top: "5%",
      height: "45%",
      // blur: true,
      // tint: true,
      // autoNext: true,
      delay: 20,
    },
    choices: {
      tint: true,
      left: "calc((100% - min(80%, 600px)) / 2)",
      width: "min(80%, 600px)",
      top: "calc(100% - min(35%, 250px))",
      height: "min(35%, 250px)",
    },
    images: {
      // defaultBgImage: IMAGE_URL.cyberpunkStreet,
    },
    theme: theme,
  },
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
