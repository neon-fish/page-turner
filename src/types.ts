
export type PageType =
  | "title"
  | "text"
  | "image"
  | "video"
  | "dialogue"
  | "choice"
  | "mainmenu"
  | "settings"
  ;

export type PageImagePos =
  | "bg"
  | "fg"
  | "left"
  | "right"
  | "centre"
  | "coords"
  ;

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
}

export type PageAnimation =
  | "dissolve"
  | "fade"
  ;

export type PageHook = () => PromiseLike<void | { redirect: string }>;

export interface Page {
  type: PageType,

  id?: string,

  bgImage?: ImageDef,
  otherImages?: ImageDef[],

  bgMusic?: AudioDef,
  soundStart?: AudioDef,
  soundEnd?: AudioDef,

  animStart?: PageAnimation,
  animEnd?: PageAnimation,

  hookStart?: PageHook,
  hookEnd?: PageHook,

  /**
   * The next page to display. Defined as:
   * - the ID of the page
   * - the page object itself
   * - a function returning the page ID or object
   * - `undefined` to advance to the next defined page
   */
  nextPage: undefined | string | Page | (() => PromiseLike<string | Page>),

}
