import { Page, Utils } from "../../engine";

/** Define IDs for pages so they can be easily targetted */
export const PAGE = {
  START: Utils.id,
  BAD: Utils.id,
};

export const pages: Page[] = [
  {
    id: PAGE.START,
    // By default, content lines are displayed one after the other
    content: [
      "Howdy! (click to continue)",
      "These lines of content appear one after the other.",
      "What do you think?\n(Click to reveal choices)",
    ],
    choices: [
      // If a next page is not specified, the next page to be displayed is the next in the list of all pages
      { text: "Cool!" },
      // Define a next page in a choice to jump to that page if the choice is clicked
      { text: "I'm not impressed.", next: PAGE.BAD },
    ],
    // Define a background image. By default, all images are "held" between pages,
    // so they do not need to be re-specified on following pages
    images: [
      { slot: "bg", url: "https://images.pexels.com/photos/548084/pexels-photo-548084.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940" },
    ],
  },
  {
    content: [
      "I'm very glad you like it!",
      "You can make your own story as well!",
    ],
    choices: [
      // Arbitrary functions can be executed in response to selecting a choice
      { text: "OK! Lets go!", onSelect: () => window.location.href = "https://github.com/neon-fish/page-turner" },
      // If no next page is specified, the choice uses the page's "next page" definition
      { text: "Not just yet." },
    ],
    next: PAGE.START,
  },
  {
    id: PAGE.BAD,
    content: [
      "I'm sorry to hear that.",
      "Are you sure I can't change your mind?",
    ],
    choices: [
      { text: "No. I'd rather watch YouTube.", onSelect: () => window.location.href = "https://youtu.be/dQw4w9WgXcQ" },
      { text: "I prefer Ren'Py.", onSelect: () => window.location.href = "https://www.renpy.org/" },
      // No next page is specified, and the page has no next page either.
      // However, the page list wraps round, so the "next" page after the last page is the first page.
      { text: "Well, maybe..." },
    ],
  },
];
