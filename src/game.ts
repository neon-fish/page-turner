import { cyberpunkStreetUrl } from './assets';
import { MCGE } from './engine/mcge';
import { PAGE, pages } from './pages';
import './engine/styles.css';

// Entry point into the app from index.html

const game = new MCGE({
  settings: {
    containerEl: "#mcge",
    defaultBgImage: cyberpunkStreetUrl,
    // startAt: PAGE.WRAP,
    // contentDelay: 30,
    contentPanel: {
      // height: "40%",
      // top: "10%",
    },
  },
  pages: pages,
});
