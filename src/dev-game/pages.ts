import { Page, Utils } from "../engine";
import { AUDIO_URL, IMAGE_URL } from "./assets";

// Definition of the game pages

/** Definitions of Page IDs */
export const PAGE = {
  START: Utils.id,
  TALL: Utils.id,
  WRAP: Utils.id,
  CLASS: Utils.id,
};

export const pages: Page[] = [

  new Page(`This is an easier way of writing content.
  You can just type into a multi-line string as the first parameter of the Page class.
  Wow! So efficient!`, [], { id: PAGE.CLASS }),

  {
    id: PAGE.CLASS,
    content: [
      "This is an easier way of writing content.",
      "You can just type into a multi-line string as the first parameter of the Page class.",
      "Wow! So efficient!",
    ],
  },

  {
    id: PAGE.START,
    images: [
      // { pos: "bg", url: IMAGE_URL.cyberpunkStreet },
      { pos: "bg", url: IMAGE_URL.fantasyTree },
      // { pos: "left", url: IMAGE_URL.cyberpunk2077Character },
      // { pos: "right", url: IMAGE_URL.cyberpunk2077Character, style: "transform: scalex(-1);", fit: "cover" },
    ],
    // music: {
    //   url: AUDIO_URL.electronicPunch,
    //   // url: AUDIO_URL.darkSynthRetrowave,
    //   // url: AUDIO_URL.synthwaveRetroElectroCyberpunk,
    //   volume: 0.2,
    // },
    content: [
      "Hello there!",
      "Well howdy!",
      "This is a much longer piece of text to test how the content text is drawn in. After this is just filler. Text text text text text text text text text text text text text text text text text text.",
      "To the next page!",
    ],
  },

  {
    // soundStart: { url: AUDIO_URL.maleYeah, volume: 0.5 },
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
    // contentSettings: { height: "40%", top: "0" },
    // choicesSettings: { top: "40%", height: "40%" },
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
      "This is some long loong looong loooong looooong loooooong looooooong loooooooong looooooooong loooooooooong looooooooooong loooooooooooong looooooooooooong loooooooooooooong text!",
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
