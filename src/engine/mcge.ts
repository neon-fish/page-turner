import m from "mithril";
import { McgeAudio } from "./audio";
import { CurrentPage, CURRENT_PAGE_ID } from "./components/CurrentPage";
import { PageUtils } from "./page-utils";
import { DeepPartial, GameSettings, NextPageDef, Page, PageChoice, PageImageDef } from "./types";
import { Utils } from "./utils";

export const DEFAULT_SETTINGS: GameSettings = {
  containerEl: "#app",
  startAt: 0,
  content: {
    top: "0%",
    height: "60%",
    blur: false,
    delay: 0,
    fast: false,
    instant: false,
  },
  choices: {
    top: "60%",
    height: "40%",
    blur: true,
  },
  images: {
    holdBgImage: true,
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

    this.setCssVariable("--mcge-content-text-colour", "white");
    this.setCssVariable("--mcge-content-shadow-colour", "black");

    this.setCssVariable("--mcge-choice-colour-fg", "black");
    this.setCssVariable("--mcge-choice-colour-bg", "white");
    this.setCssVariable("--mcge-choice-colour-border", "#64748b");
    this.setCssVariable("--mcge-choice-colour-highlight", "#3b82f6");

    this.setCssVariable("--mcge-scroll-fg", "#3b82f6");
    this.setCssVariable("--mcge-scroll-bg", "#cbd5e1");

    this.mountLayout();
  }

  private mountLayout() {

    const appEl = typeof this.settings.containerEl === "string"
      ? document.querySelector<HTMLDivElement>(this.settings.containerEl)!
      : this.settings.containerEl;

    const Layout: m.Component = {
      view: () => {
        return m("", {
          id: "layout",
          style: "width: 100%; height: 100%;",
        }, [
          m(CurrentPage, {

            settings: this.settings,
            page: this.currPage,
            contentLine: this.contentIndex,
            bgImage: this.lastBgImage ?? this.getDefaultBgImage(),

            next: async () => {
              // console.log("calling next()...");
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

  private setCssVariable(variable: string, value: string) {
    variable = variable.startsWith("--") ? variable : `--${variable}`;
    const root = document.querySelector(":root") as HTMLElement;
    root.style.setProperty(variable, value);
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
      this.processPageTransition(targetIndex);
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

    this.processPageTransition(nextPageIndex);
  }

  /**
   * Called after the new current page has been selected, this initialises
   * the new current page
   */
  private processPageTransition(index: number) {

    if (this.currPage?.soundEnd) {
      this.audio.playAudio(this.currPage.soundEnd);
    }

    // CHANGE PAGE
    this.currPageIndex = index;

    // Reset the index of the current line of content to display
    this.contentIndex = 0;
    if (this.currPage.showAllContent) {
      this.contentIndex = this.currPage.content.length;
    }

    // If the background image should be held, update it if a new one is defined
    if (this.settings.images.holdBgImage) {
      const pageBgImage = PageUtils.findBgImage(this.currPage);
      if (pageBgImage) this.lastBgImage = pageBgImage;
    }

    // If the page specifies music, start it if it is not already playing
    if (this.currPage.music) {
      this.audio.replaceMusic(this.currPage.music);
    }

    if (this.currPage.soundStart) {
      this.audio.playAudio(this.currPage.soundStart);
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
    const bgImageDef: PageImageDef | undefined = this.settings.images.defaultBgImage
      ? { pos: "bg", url: this.settings.images.defaultBgImage }
      : undefined;
    return bgImageDef;
  }

}
