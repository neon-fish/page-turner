
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface ContentSettings {
  /** The top of the content panel as a CSS expression (e.g. "10%") */
  top: string,
  /** The height of the content panel as a CSS expression (e.g. "40%") */
  height: string,
  /** Blur the content panel background */
  blur: boolean,
  /** Delay to wait before adding the next letter */
  delay: number,
  /** Add content to the page one word at a time instead of one letter at a time */
  fast: boolean,
  /** Add each new line instantly */
  instantLine: boolean,
  /** Display all the content in a page at once */
  instantPage: boolean,
}

export interface ChoicesSettings {
  /** The top of the choices panel as a CSS expression (e.g. "10%") */
  top: string,
  /** The height of the choices panel as a CSS expression (e.g. "40%") */
  height: string,
  /** Blur the chocies panel background */
  blur: boolean,
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
  /** Settings defining how images should behave */
  images: {
    /** If a page does not specifiy a BG image, use the last-displayed BG image */
    holdBgImage: boolean,
    /** An optional BG image to display as a fallback */
    defaultBgImage?: string,
  },
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
  | (() => string)
  | { [speaker: string]: string }
  | { [speaker: string]: () => string }
  ;

/**
 * The definition of a choice
 */
export type PageChoice = {
  /** The text to display in the choice */
  text: string | (() => string),
  /** Call a hook on hovering over the choice */
  onHover?: PageHook,
  /** Call a hook after selecting the choice */
  onSelect?: PageHook,
  /** The choice can navigate directly to another page */
  nextPage?: NextPageDef,
};

export type PageImagePos =
  | "bg"
  | "fg"
  | "left"
  | "right"
  | "centre"
  | "custom";

export interface PageImageDef {
  url: string,
  pos: PageImagePos,
  /** Optionally override the default value for the `object-fit` style on the `<img>` tag */
  fit?: "contain" | "cover" | "fill" | "none",
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
export type PageHook = () => PromiseLike<void | { redirect: string }>;

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
  | (() => number | string | Page)
  ;

export interface Page {
  // type: PageType,

  id?: string,

  /** The content to display in the page. The only required value. */
  content: PageContent[],
  /** Optionally override the game settings for the content panel for this page */
  contentSettings?: Partial<ContentSettings>,

  /** The choices to display in the page */
  choices?: PageChoice[],
  /** Optionally override the default settings for the choices panel */
  choicesSettings?: Partial<ChoicesSettings>,

  images?: PageImageDef[],

  music?: PageAudioDef,
  soundStart?: PageAudioDef,
  soundEnd?: PageAudioDef,

  animStart?: PageAnimation,
  animEnd?: PageAnimation,

  hookStart?: PageHook,
  hookEnd?: PageHook,

  /**
   * The next page to display. One of:
   * - the ID of the page
   * - the next page object itself
   * - a function returning the page ID or object
   * - `undefined` to advance to the next defined page in the list
   */
  next?: NextPageDef,

}
