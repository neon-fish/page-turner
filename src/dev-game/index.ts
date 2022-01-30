import { MCGE } from '../engine';
import '../engine/styles.css';
import { IMAGE_URL } from './assets';
import { pages } from './pages';

// Entry point into the app from index.html

const game = new MCGE({
  settings: {
    containerEl: "#mcge",
    // startAt: PAGE.WRAP,
    // contentDelay: 30,
    content: {
      // top: "10%",
      height: "40%",
      // blur: true,
      // tint: true,
    },
    choices: {
      tint: true,
    },
    images: {
      defaultBgImage: IMAGE_URL.cyberpunkStreet,
    },
    debug: true,
  },
  pages: pages,
});
