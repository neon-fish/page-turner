import m from "mithril";
import { McgeAudio } from "./audio";
import { CurrentPage, CURRENT_PAGE_ID } from "./components/CurrentPage";
import { PageUtils } from "./page-utils";
import { DeepPartial, GameSettings, NextPageDef, Page, PageChoice, PageImageDef } from "./types";
import { Utils } from "./utils";

export const DEFAULT_SETTINGS: GameSettings = {
  containerEl: "#app",
  holdBgImage: true,
  startAt: 0,
  contentPanel: {
    top: "0%",
    height: "60%",
    blur: false,
  },
  choicesPanel: {
    top: "60%",
    height: "40%",
    blur: true,
  },
};

export class MCGE {

  settings: GameSettings;
  pages: Page[] = [];

  private currPageIndex: number = 0;
  get currPage(): Page {
    return this.pages[this.currPageIndex];
  }
  private contentIndex: number = 0;

  lastBgImage?: PageImageDef;

  audio = new McgeAudio();

  constructor(params: {
    settings: DeepPartial<GameSettings>,
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

            settings: this.settings,
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

  // ========== Pages, content, and choices ==========

  advanceContent(): boolean {
    const prevIndex = this.contentIndex;
    this.contentIndex = Math.min(this.contentIndex + 1, this.currPage.content.length);

    // Return whether the content index has reached the end of the content list
    return this.contentIndex === this.currPage.content.length;
  }

  gotoPage(nextPage?: NextPageDef) {

    const targetIndex = PageUtils.targetPageIndex(this.pages, nextPage);

    if (targetIndex > -1) {
      // this.currPageIndex = targetIndex;
      this.initialisePageIndex(targetIndex);
      return;
    }

    this.gotoNextPage();
  }

  /**
   * Advance to the next page in the list
   */
  gotoNextPage() {

    let nextPageIndex = this.currPageIndex + 1;

    // Wrap around the page list in case the index falls off the end
    if (nextPageIndex >= this.pages.length) {
      nextPageIndex = 0;
    }

    this.initialisePageIndex(nextPageIndex);
  }

  /**
   * Called after the new current page has been selected, this initialises
   * the new current page
   */
  private initialisePageIndex(index: number) {

    this.currPageIndex = index;

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
