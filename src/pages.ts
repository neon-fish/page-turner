import { cyberpunkStreetUrl } from "./assets";
import { Page } from "./engine/types";
import { Utils } from "./engine/utils";

// Definition of the game pages

/** Definitions of Page IDs */
export const PAGE = {
  START: Utils.id,
  TALL: Utils.id,
  WRAP: Utils.id,
};

export const pages: Page[] = [
  {
    id: PAGE.START,
    images: [
      { pos: "bg", url: cyberpunkStreetUrl },
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
      { text: "Continue to next page (tall test)" },
      { text: "Back to the start", nextPage: PAGE.START },
      { text: "Choice 3" },
      { text: "Choice 4" },
      { text: "Choice 5" },
      { text: "Choice 6" },
    ],
  },
  {
    id: PAGE.TALL,
    // showAllContent: true,
    content: [
      "Test the vertical scrolling of content.",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "That's the end!",
      "How does it look? Both options only continue to the next page!"
    ],
    choices: [
      { text: "Looks OK" },
      { text: "Looks terrible" },
    ]
  },
  {
    id: PAGE.WRAP,
    content: [
      "This is a test of multi-line text.",
      `This text has a line break here:
... and then continues on another line.`,
      `This text has two line breaks here:

... and then continues on another line.`,
      "There is an empty line of content here:",
      "",
      "And this is a normal line again.",
      "How was that?",
    ],
    choices: [
      { text: "OK" },
    ]
  }
];
