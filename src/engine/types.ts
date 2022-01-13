
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
  | (() => string | void)
  | { [speaker: string]: string }
  ;

export type PageChoice = {
  text: string | (() => string),
};

export type PageImagePos =
  | "bg"
  | "fg"
  | "left"
  | "right"
  | "centre"
  | "coords";

export interface ImageDef {
  url: string,
  pos: PageImagePos,
  coords?: {
    l: number,
    t: number,
    w: number,
    h: number,
  },
}

export interface AudioDef {
  url: string,
  /** Optional volume multiplier, 1 = no change, 0.5 = half volume */
  volume?: number,
  /** Music is looped by default, sounds are not */
  loop?: boolean,
  /**  */
  mode?: "once" | "?",
}

export type PageAnimation =
  | "dissolve"
  | "fade";

export type PageHook = () => PromiseLike<void | { redirect: string }>;

export type NextPageDef =
  | string
  | Page
  | (() => PromiseLike<string | Page>)
  ;

export interface Page {
  // type: PageType,

  id?: string,

  content: PageContent[],

  choices?: PageChoice[],

  // bgImage?: ImageDef,
  images?: ImageDef[],

  music?: AudioDef,
  soundStart?: AudioDef,
  soundEnd?: AudioDef,

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
