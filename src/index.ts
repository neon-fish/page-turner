import { MCGE } from './engine/mcge';
import { pages } from './game';
import './styles.css';

// Entry point into the app from index.html

const game = new MCGE({
  settings: {
    containerEl: "#app",
  },
  pages: pages,
});
