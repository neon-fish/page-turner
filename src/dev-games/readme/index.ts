import { PageTurner } from '../../engine';
import { pages } from './pages';

const game = new PageTurner({
  settings: {                    // All these settings come with default values, but can be overridden here
    containerEl: "#page-turner", // A selector for the element to contain the PageTurner game
    content: {                   // These percentages are in terms of the container element's dimensions
      height: "40%",
      top: "10%",
    },
    choices: {
      height: "30%",
      top: "60%",
    },
  },
  pages: pages, // The list of pages defining the story
});
