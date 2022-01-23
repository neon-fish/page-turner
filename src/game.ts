import { cyberpunkStreetUrl } from './assets';
import { MCGE } from './engine/mcge';
import { PAGE, pages } from './pages';
import './styles.css';

// Entry point into the app from index.html

const game = new MCGE({
  settings: {
    containerEl: "#mcge",
    defaultBgImage: cyberpunkStreetUrl,
    startAt: PAGE.WRAP,
  },
  pages: pages,
});
