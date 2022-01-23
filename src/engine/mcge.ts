import m from "mithril";
import { CurrentPage } from "./components/CurrentPage";
import { PageUtils } from "./page-utils";
// import { Layout } from "./components/Layout";
import { NextPageDef, Page, PageChoice, PageImageDef } from "./types";
import { Utils } from "./utils";

export interface Settings {
  /** Element containing the game, as an element or selector */
  containerEl: string | HTMLElement,
  holdBgImage: boolean,
}

export const DEFAULT_SETTINGS: Settings = {
  containerEl: "#app",
  holdBgImage: true,
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

    this.gotoPage(this.pages[0]);

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
            bgImage: this.lastBgImage,

            next: async () => {
              const isFinished = this.advanceContent();
              if (isFinished && Utils.isEmptyOrUndefined(this.currPage.choices)) {
                await this.gotoPage(this.currPage.next);
              }
              m.redraw();
            },

            selectChoice: (index) => {
              this.selectChoice(this.currPage, index);
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

  async gotoPage(nextPage?: NextPageDef) {

    const targetIndex = await PageUtils.targetPageIndex(this.pages, nextPage);

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
    // Reset the
    this.contentIndex = 0;

    // If the background image should be held, update it if a new one is defined
    if (this.settings.holdBgImage) {
      const pageBgImage = PageUtils.findBgImage(this.currPage);
      if (pageBgImage) this.lastBgImage = pageBgImage;
    }
  }

  selectChoice(page: Page, index: number) {
    const selected: PageChoice | undefined = (page.choices ?? [])[index];

    if (!selected) {
      this.gotoPage();
      return;
    }

    const r = selected.onSelect?.();
    if (selected.nextPage) {
      this.gotoPage(selected.nextPage);
    }
  }

}
