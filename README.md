
# PageTurner

[![npm version](https://badge.fury.io/js/@neonfish%2Fpage-turner.svg)](https://badge.fury.io/js/@neonfish%2Fpage-turner)

An engine to build web-based games or stories where the primary interaction method is a multiple-choice selection.

## What is it?

PageTurner is a simple engine to build web-based games or stories where the main way the player interacts is using multiple-choice selections. While this is similar to [text adventures](https://en.wikipedia.org/wiki/Interactive_fiction) or [visual novels](https://en.wikipedia.org/wiki/Visual_novel), PageTurner aims to provide authors with the ability to easily define custom logic to run in response to player choices, resulting in a complex graph of pages rather than a tree.

It is not intended to have all visual the bells and whistles one could imagine. It intentionally provides few built-in primitives and options to encourage constraint-based design and interactivity via the page choices.

## Why?

The design of PageTurner is driven by the question:

> What sort of games could you make if everything were a page?

A "page" in this context is a single page in the "story book", containing:
- some lines of text
- (optional) a number of mutually-exclusive choices
- (optional) background images
- (optional) background music & sound effects

## Basic Usage

The `PageTurner` class is the entry point into the engine. Both Javascript and Typescript are supported.

See the following template projects to get up and running quickly:
- [Javascript template](https://github.com/neon-fish/page-turner-js-template)
- [Typescript template](https://github.com/neon-fish/page-turner-ts-template)

A basic setup might look like this:

> index.html

```html
<body>
  <div id="page-turner" style="width: 800px; height: 600px;"></div>
  <!-- This script reference will change depending on your build system and project structure -->
  <script type="module" src="/src/index.ts"></script>
</body>
```

> src/index.ts

```ts
import { PageTurner } from '@neonfish/page-turner';
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
```

> src/pages.ts

```ts
import { Page, Utils } from "@neonfish/page-turner";

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
```

## Development

([Internal design doc](https://docs.google.com/document/d/16yhF2b2kGbcrEN4Bgnc-3G-urajoE7mC61nCpX3Njt8/edit))

- Requires [Node](https://nodejs.org)
- Install dependencies with `npm install`
- Start a hot-reloading dev server with `npm run dev`

### TODO

- [x] Displaying images in other image slots
- [x] Selecting choices with keyboard
- [x] Positioning content and choices
- [x] Playing music
- [x] Playing sounds
- [x] Add options for blurring the background of the content panel
- [x] Styling/theming options (inc. choices, content text)
- [x] Fix bug skipping the end of last content line on next()
- [ ] Page enter/exit animations
- [ ] Simple image animations
- [ ] "Speaker" labels for content strings

## Deployment

PageTurner is available as an NPM package, available [here](https://www.npmjs.com/package/@neonfish/page-turner).

To update the package, update the version in `package.json` then run `npm run release`
