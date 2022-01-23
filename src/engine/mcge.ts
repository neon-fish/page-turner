import m from "mithril";
import { CurrentPage, CURRENT_PAGE_ID } from "./components/CurrentPage";
import { PageUtils } from "./page-utils";
// import { Layout } from "./components/Layout";
import { NextPageDef, Page, PageChoice, PageImageDef } from "./types";
import { Utils } from "./utils";

export interface Settings {
  /** Element containing the game, as an element or selector */
  containerEl: string | HTMLElement,
  startAt: NextPageDef,
  holdBgImage: boolean,
  defaultBgImage?: string,
}

export const DEFAULT_SETTINGS: Settings = {
  containerEl: "#app",
  holdBgImage: true,
  startAt: 0,
};

export class MCGE {

  settings: Settings;
  pages: Page[] = [];

  private currPageIndex: number = 0;
  get currPage(): Page {
    return this.pages[this.currPageIndex];
  }
  private contentIndex: number = 0;

  lastBgImage?: PageImageDef;

  constructor(params: {
    settings: Partial<Settings>,
    pages: Page[],
  }) {

    this.settings = DEFAULT_SETTINGS;
    Object.assign(this.settings, params.settings);

    this.pages = params.pages;

    this.currPageIndex = PageUtils.targetPageIndex(this.pages, this.settings.startAt);
    this.gotoPage(this.currPageIndex);

    this.init();
  }

  private init() {
    this.mountLayout();
  }

  private mountLayout() {

    const appEl = typeof this.settings.containerEl === "string"
      ? document.querySelector<HTMLDivElement>(this.settings.containerEl)!
      : this.settings.containerEl;

    const Layout: m.Component = {
      view: () => {
        return m(".h-full.w-full", {
          id: "layout",
        }, [
          m(CurrentPage, {

            page: this.currPage,
            contentLine: this.contentIndex,
            bgImage: this.lastBgImage ?? this.getDefaultBgImage(),

            next: async () => {
              console.log("calling next()...");
              const isFinished = this.advanceContent();
              if (isFinished && Utils.isEmptyOrUndefined(this.currPage.choices)) {
                this.gotoPage(this.currPage.next);
              }
              m.redraw();
            },

            selectChoice: (choice, index) => {
              this.selectChoice(this.currPage, choice, index);
            },

          }),
        ]);
      }
    };

    m.mount(appEl, Layout);
  }

  advanceContent(): boolean {
    const prevIndex = this.contentIndex;
    this.contentIndex = Math.min(this.contentIndex + 1, this.currPage.content.length);

    // Return whether the content index has reached the end of the content list
    return this.contentIndex === this.currPage.content.length;
  }

  gotoPage(nextPage?: NextPageDef) {

    const targetIndex = PageUtils.targetPageIndex(this.pages, nextPage);

    if (targetIndex > -1) {
      this.currPageIndex = targetIndex;
      this.initCurrPage();
      return;
    }

    this.gotoNextPage();
  }

  /**
   * Advance to the next page in the list
   */
  gotoNextPage() {
    this.currPageIndex += 1;

    // Wrap around the page list in case the index falls off the end
    if (this.currPageIndex >= this.pages.length) {
      this.currPageIndex = 0;
    }
    this.initCurrPage();
  }

  /**
   * Called after the new current page has been selected, this initialises
   * the new current page
   */
  initCurrPage() {

    // Reset the index of the current line of content to display
    this.contentIndex = 0;
    if (this.currPage.showAllContent) {
      this.contentIndex = this.currPage.content.length;
    }

    // If the background image should be held, update it if a new one is defined
    if (this.settings.holdBgImage) {
      const pageBgImage = PageUtils.findBgImage(this.currPage);
      if (pageBgImage) this.lastBgImage = pageBgImage;
    }

    const pageEl = document.querySelector(`#${CURRENT_PAGE_ID}`) as HTMLElement | null;
    if (pageEl) pageEl.focus();
  }

  selectChoice(page: Page, choice: PageChoice, index: number) {

    if (!choice) {
      this.gotoPage();
      return;
    }

    const r = choice.onSelect?.();
    if (choice.nextPage) {
      this.gotoPage(choice.nextPage);
    } else {
      this.gotoNextPage();
    }

  }

  getDefaultBgImage(): PageImageDef | undefined {
    const bgImageDef: PageImageDef | undefined = this.settings.defaultBgImage
      ? { pos: "bg", url: this.settings.defaultBgImage }
      : undefined;
    return bgImageDef;
  }

}
