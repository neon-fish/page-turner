import { PageTurner } from "./page-turner";

export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface ContentSettings {

  /** The top of the content panel as a CSS expression (e.g. "10%") */
  top: string,
  /** The height of the content panel as a CSS expression (e.g. "40%") */
  height: string,
  /** The left of the content panel as a CSS expression (e.g. "0%") */
  left: string,
  /** The width of the content panel as a CSS expression (e.g. "100%") */
  width: string,

  /** Blur the content panel background */
  blur: boolean,
  /** Apply a tint to the content panel background */
  tint: boolean,
  /** Delay to wait before adding the next letter */
  delay: number,
  /** Add content to the page one word at a time instead of one letter at a time */
  fast: boolean,
  /** Display the next content line as soon as the current one has finished drawing */
  autoNext: boolean,
  /** Add each new line instantly */
  instantLine: boolean,
  /** Display all the content in a page at once */
  instantPage: boolean,

}

export interface ChoicesSettings {

  /** The top of the choices panel as a CSS expression (e.g. "50%") */
  top: string,
  /** The height of the choices panel as a CSS expression (e.g. "40%") */
  height: string,
  /** The left of the choices panel as a CSS expression (e.g. "0%") */
  left: string,
  /** The width of the choices panel as a CSS expression (e.g. "100%") */
  width: string,

  /** Blur the choices panel background */
  blur: boolean,
  /** Apply a tint to the choices panel background */
  tint: boolean,
  /** How to align the choices within the panel if there is space left over */
  align: "start" | "end" | "center" | "space",

  /** If the page choices should be displayed immediately after the content has finished drawing */
  autoDisplay: boolean,

  /** Default function to call on hovering over any choice */
  onHoverDefault?: PageHook,
  /** Default function to call after selecting any choice */
  onSelectDefault?: PageHook,

}

/** A collection of styling settings */
export interface Theme {

  /** The colour of content text */
  contentColourText: string,
  /** The colour of the shadow behind content text */
  contentColourShadow: string,
  /** The gap between text lines */
  contentGap: string,
  /** The radius of the content panel */
  contentBorderRadius: string,

  /** The colour of the text on choice buttons */
  choiceColourFg: string,
  /** The colour of the background are of choice buttons */
  choiceColourBg: string,
  /** The colour of the border of choice buttons */
  choiceColourBorder: string,
  /** The colour to apply to choice borders and shadows when the choice is highlighted */
  choiceColourHighlight: string,
  /** The gap between choices */
  choiceGap: string,
  /** The radius of the choices panel */
  choiceBorderRadius: string,

  /** The colour of the scrollbar "handle" (the part that moves) */
  scrollColourFg: string,
  /** The colour of the scrollbar "track" (the background that doesn't move) */
  scrollColourBg: string,
}

export interface GameSettings {

  /** Element containing the game, as an element or selector */
  containerEl: string | HTMLElement,
  /** The page to start the game at */
  startAt: NextPageDef,
  /** Log debugging messages to the console */
  debug: boolean,
  /** Default settings for the content panel */
  content: ContentSettings,
  /** Default settings for the choices panel */
  choices: ChoicesSettings,
  // /** Settings defining how images should behave */
  // images: {
  //   /** If a page does not specifiy a BG image, use the last-displayed BG image */
  //   holdBgImage: boolean,
  //   /** An optional BG image to display as a fallback */
  //   defaultBgImage?: string,
  // },
  /** Image slots to automatically "hold" once an image has been showm */
  holdImageSlots: PageImageSlotSetting | PageImageSlotSetting[],
  /** The current theme settings */
  theme: Theme,

}

// export type PageType =
//   | "title" // use image for formatting?
//   | "text" // text
//   | "image" // <- positioned image
//   | "video" // <- type of image?
//   | "dialogue" // text?
//   | "choice" // text with options?
//   | "mainmenu" // made out of choice page?
//   | "settings" // made out of choice page?
//   ;

export type PageContent =
  | string
  | ((pt: PageTurner) => string)
  // | { [speaker: string]: string }
  // | { [speaker: string]: () => string }
  ;

/**
 * The definition of a choice
 */
export type PageChoice = {
  /** The text to display in the choice */
  text: string | ((pt: PageTurner) => string),
  /** Call a hook on hovering over the choice */
  onHover?: PageHook,
  /** Call a hook after selecting the choice */
  onSelect?: PageHook,
  /** The choice can navigate directly to another page */
  next?: NextPageDef,
};

/** Page image slot value */
export type PageImageSlot =
  | "bg"
  | "fg"
  | "left"
  | "right"
  | "centre"
  | "custom";

/** Page image slot value as a target for slot settings or clearing commands */
export type PageImageSlotSetting =
  | PageImageSlot
  | "all";

/** The definition of the position of an image */
export interface PageImagePos {
  /** Top */
  t?: string,
  /** Bottom */
  b?: string,
  /** Height */
  h?: string,
  /** Left */
  l?: string,
  /** Right */
  r?: string,
  /** Width */
  w?: string,
}

export interface PageImageDef {
  /** The URL of the image */
  url: string,
  /** The positioning slot for the image */
  slot: PageImageSlot,
  /** Specific positioning for images in the "custom" slot */
  pos?: PageImagePos,
  /** Optionally override the default value for the `object-fit` style on the `<img>` tag */
  fit?: "contain" | "cover" | "fill" | "none",
  /** If the image should only be displayed for the current page, regardless of image hold settings */
  once?: boolean,
  /** If the image should be held for multiple pages, regardless of image hold settings */
  hold?: boolean,
  /** Optional CSS styles to apply to the `<img>` element */
  style?: string,
  // /** Optional additional  */
  // class?: string,
}

export interface PageAudioDef {
  url: string,
  /** Optional volume multiplier, 1 = no change, 0.5 = half volume */
  volume?: number,
  // /** Music is looped by default, sounds are not */
  // loop?: boolean,
  // /**  */
  // mode?: "once" | "?",
}

/**
 * The built-in types of page animation
 */
export type PageAnimation =
  | "dissolve"
  | "fade";

/**
 * A function to be called at various points throughout the application,
 * to execute arbitrary logic at particular times
 */
export type PageHook = (pt: PageTurner) => (void | { redirect: string });
/**
 * An async function to be called at various points throughout the application,
 * to execute arbitrary logic at particular times
 */
export type PageHookAsync = (pt: PageTurner) => PromiseLike<(void | { redirect: string })>;

/**
 * A definition of the next page to display. One of:
 * - The index of the page in the list of all pages
 * - The ID of the next Page as a string
 * - The target page object itself
 * - A function that returns one of the other types
 */
export type NextPageDef =
  | number
  | string
  | Page
  | ((pt: PageTurner) => number | string | Page)
  ;

export type PartialPage = Partial<Page>;

export type PageLayoutSettings = {
  content?: Partial<ContentSettings>,
  choices?: Partial<ChoicesSettings>,
};

export interface Page {
  // type: PageType,

  id?: string,

  /** The content to display in the page. The only required value. */
  content: PageContent[] | ((pt: PageTurner) => PageContent[]),
  /** Optionally override the game settings for the content panel for this page */
  contentSettings?: Partial<ContentSettings>,

  /** The choices to display in the page */
  choices?: PageChoice[] | ((pt: PageTurner) => PageChoice[]),
  /** Optionally override the default settings for the choices panel */
  choicesSettings?: Partial<ChoicesSettings>,

  /** Images to display */
  images?: PageImageDef[],
  /** Clear any held images in the specified slots */
  clearImageSlots?: PageImageSlotSetting[],

  music?: PageAudioDef,
  soundStart?: PageAudioDef,
  soundEnd?: PageAudioDef,

  animStart?: PageAnimation,
  animEnd?: PageAnimation,

  /** Function called just after this page has become the current page. */
  onStart?: PageHook,
  /** Function called just before this page will stop being the current page. */
  onEnd?: PageHook,

  /**
   * The next page to display. One of:
   * - the ID of the page
   * - the next page object itself
   * - a function returning the page ID or object
   * - `undefined` to advance to the next defined page in the list
   */
  next?: NextPageDef,

  /**
   * Optionally include the settings from another Page object as a set of defaults
   * before the settings defined in this Page are applied.
   * 
   * Useful for reusing common content/choices settings without setting them as game
   * default settings.
   */
  useDefaults?: PartialPage,

}

export class Page {

  /**
   * Create a new Page
   * @param content The content for the page. The string is split on new line characters to get the lines of content in the page.
   * @param choices The optional list of choices in the page
   * @param page Any other settings for the page
   */
  constructor(content: string,)
  constructor(content: string, choices: PageChoice[])
  constructor(content: string, page: Partial<Page>)
  constructor(content: string, choices: PageChoice[] | Partial<Page>, page: Partial<Page>)
  constructor(content: string, choicesOrPage?: PageChoice[] | Partial<Page>, page?: Partial<Page>) {

    // Assign any specified settings
    if (page) {
      Object.assign(this, page);
    }

    // Assign any specified page settings or choices (whatever's in the second parameter)
    if (choicesOrPage) {
      if (choicesOrPage instanceof Array) {
        this.choices = choicesOrPage;
      } else {
        Object.assign(this, choicesOrPage);
      }
    }

    // Split the given content string into lines
    const contentLines = content.split("\n")
      .map(l => l.trim())
      .filter(l => Boolean(l.trim()));
    this.content = contentLines;

  }

}
