import { cyberpunkStreetUrl } from './assets';
import { MCGE } from './engine/mcge';
import './engine/styles.css';
import { pages } from './pages';

// Entry point into the app from index.html

const game = new MCGE({
  settings: {
    containerEl: "#mcge",
    // startAt: PAGE.WRAP,
    // contentDelay: 30,
    content: {
      height: "40%",
      top: "10%",
      // instant: true,
    },
    images: {
      defaultBgImage: cyberpunkStreetUrl,
    },
  },
  pages: pages,
});
