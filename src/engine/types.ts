
export type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

export interface PanelSettings {
  top: string,
  height: string,
  blur: boolean,
}

export interface GameSettings {
  /** Element containing the game, as an element or selector */
  containerEl: string | HTMLElement,
  startAt: NextPageDef,
  holdBgImage: boolean,
  contentPanel: PanelSettings,
  choicesPanel: PanelSettings,
  defaultBgImage?: string,
  contentDelay?: number,
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
  /** If all content should be drawn immediately on opening the page */
  showAllContent?: boolean,

  choices?: PageChoice[],

  images?: PageImageDef[],

  music?: PageAudioDef,
  soundStart?: PageAudioDef,
  soundEnd?: PageAudioDef,

  animStart?: PageAnimation,
  animEnd?: PageAnimation,

  /** Optionally override the default settings for the content panel */
  contentPanel?: Partial<PanelSettings>,
  /** Optionally override the default settings for the choices panel */
  choicesPanel?: Partial<PanelSettings>,

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
