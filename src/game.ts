import { cyberpunkStreetUrl } from './assets';
import { Macgyver } from './engine/macgyver';
import { PAGE, pages } from './pages';
import './engine/styles.css';

// Entry point into the app from index.html

const game = new Macgyver({
  settings: {
    containerEl: "#mcge",
    defaultBgImage: cyberpunkStreetUrl,
    // startAt: PAGE.WRAP,
    // contentDelay: 30,
  },
  pages: pages,
});
