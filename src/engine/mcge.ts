import m from "mithril";
import { Theme } from ".";
import { McgeAudio } from "./audio";
import { CurrentPage, CURRENT_PAGE_ID } from "./components/CurrentPage";
import { PageUtils } from "./page-utils";
import { DEFAULT_THEME } from "./themes";
import { DeepPartial, GameSettings, NextPageDef, Page, PageChoice, PageImageDef } from "./types";
import { Utils } from "./utils";

/**
 * Default values for all MCGE settings, overridden to settings provided in the constructor
 */
export const DEFAULT_SETTINGS: GameSettings = {
  containerEl: "#app",
  startAt: 0,
  debug: false,
  content: {
    top: "0%",
    height: "60%",
    blur: false,
    tint: false,
    delay: 0,
    fast: false,
    instantLine: false,
    instantPage: false,
  },
  choices: {
    top: "60%",
    height: "40%",
    blur: true,
    tint: false,
  },
  images: {
    holdBgImage: true,
  },
  theme: DEFAULT_THEME,
};

export class MCGE {

  settings: GameSettings;
  get debug() { return this.settings.debug; }

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

    this.settings = PageUtils.patchGameSettings(DEFAULT_SETTINGS, params.settings);
    this.debug && console.log("MCGE constructor, settings:", this.settings);

    this.pages = params.pages;

    this.currPageIndex = PageUtils.targetPageIndex(this.pages, this.settings.startAt);
    this.gotoPage(this.currPageIndex);

    this.init();
  }

  private init() {
    this.reloadTheme();
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

  /**
   * Set the CSS variables to the associated values defined in the current theme
   */
  private reloadTheme() {
    // Ensure all theme values have valid values
    const theme = Object.assign({}, this.settings.theme, DEFAULT_THEME);

    this.setCssVariable("--mcge-content-text-colour", theme.contentColourText);
    this.setCssVariable("--mcge-content-shadow-colour", theme.contentColourShadow);

    this.setCssVariable("--mcge-choice-colour-fg", theme.choiceColourFg);
    this.setCssVariable("--mcge-choice-colour-bg", theme.choiceColourBg);
    this.setCssVariable("--mcge-choice-colour-border", theme.choiceColourBorder);
    this.setCssVariable("--mcge-choice-colour-highlight", theme.choiceColourHighlight);

    this.setCssVariable("--mcge-scroll-fg", theme.scrollColourFg);
    this.setCssVariable("--mcge-scroll-bg", theme.scrollColourBg);
  }

  private setCssVariable(variable: string, value: string) {
    variable = variable.startsWith("--") ? variable : `--${variable}`;
    const root = document.querySelector(":root") as HTMLElement;
    root.style.setProperty(variable, value);
  }

  /**
   * Apply a patch to the current theme settings, then reload the current theme
   * @param theme 
   */
  patchTheme(theme: Partial<Theme>) {
    Object.assign(this.settings.theme, theme);
    this.reloadTheme();
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
    this.debug && console.log(`Go to page, target index: ${targetIndex}`);

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
    this.debug && console.log(`Transitioning to page index ${index}...`);

    if (this.currPage?.soundEnd) {
      this.audio.playAudio(this.currPage.soundEnd);
    }

    // CHANGE PAGE
    this.currPageIndex = index;

    // Reset the index of the current line of content to display
    this.contentIndex = 0;
    const instantPage = this.currPage.contentSettings?.instantPage ?? this.settings.content.instantPage;
    if (instantPage) {
      this.contentIndex = this.currPage.content.length;
    }

    // If the background image should be held, update it if a new one is defined
    if (this.settings.images.holdBgImage) {
      const pageBgImage = PageUtils.findBgImage(this.currPage);
      if (pageBgImage) {
        this.lastBgImage = pageBgImage;
        this.debug && console.log(`Updated held BG image (${Utils.truncate(pageBgImage.url, 100)})`);
      }
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
