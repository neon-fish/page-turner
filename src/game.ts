import { Page } from "./engine/types";

// Definition of the game pages

const fantasyTree = `https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2018%2F09%2F29%2F666764-fantasy-landscape-art-artwork-nature-scenery.jpg&f=1&nofb=1`;
const cyberpunkStreet = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F68%2Fb4%2F46%2F68b446bbbabb02b6d91630943582c610.png&f=1&nofb=1";

export const pages: Page[] = [
  {
    images: [
      { pos: "bg", url: cyberpunkStreet },
    ],
    content: [
      "Hello there!",
      "Well howdy!",
      "This is a much longer piece of text to test how the content text is drawn in. After this is just filler. Text text text text text text text text text text text text text text text text text text.",
      "To the next page!",
    ],
  },
  {
    content: [
      "Another page!",
      "This page has choices.",
      "If choices are defined, one must be chosen to advance the page."
    ],
    choices: [
      { text: "Choice 1" },
      { text: "Choice 2" },
      { text: "Choice 3" },
      { text: "Choice 4" },
      { text: "Choice 5" },
      { text: "Choice 6" },
    ],
  },
];
