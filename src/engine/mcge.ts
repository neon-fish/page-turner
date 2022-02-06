import m from "mithril";
import { PageContent, PageHook } from "./types";
import { McgeAudio } from "./audio";
import { CurrentPage, CURRENT_PAGE_ID } from "./components/CurrentPage";
import { PageUtils } from "./page-utils";
import { McgeState } from "./state";
import { DEFAULT_THEME } from "./themes";
import { DeepPartial, GameSettings, NextPageDef, Page, PageChoice, PageImageDef, Theme } from "./types";
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
    left: "0%",
    width: "100%",
    blur: false,
    tint: false,
    autoNext: false,
    delay: 0,
    fast: false,
    instantLine: false,
    instantPage: false,
  },
  choices: {
    top: "65%",
    height: "30%",
    left: "0%",
    width: "100%",
    blur: true,
    tint: false,
    align: "center",
    autoDisplay: true,
  },
  images: {
    holdBgImage: true,
  },
  theme: DEFAULT_THEME,
};

export class Mcge<TState extends object = {}> {

  settings: GameSettings;
  get debug() { return this.settings.debug; }

  pages: Page[] = [];

  private currPageIndex: number = 0;
  get currPage(): Page {
    return this.pages[this.currPageIndex];
  }
  /** The list of content lines for the current page */
  private currPageContent: PageContent[] = [];
  /** The list of choices for the current page */
  private currPageChoices: PageChoice[] = [];
  /** The settings for the current page */
  private currPageSettings: GameSettings;
  /** The index of the urrent content line to display, between 0 and the length of the content array inclusive */
  private contentIndex: number = 0;
  /** If the current line of content has finished drawing in */
  private contentLineFinished: boolean = false;
  /** Whether all the lines for the current page have finished being drawn */
  get allLinesDrawn(): boolean {
    return (this.contentIndex === this.currPageContent.length) ||
      (this.contentLineFinished && (this.contentIndex === this.currPageContent.length - 1));
  }

  lastBgImage?: PageImageDef;

  audio: McgeAudio = new McgeAudio();

  state: McgeState<TState>;

  constructor(params: {
    settings: DeepPartial<GameSettings>,
    pages: Page[],
    state: TState,
  }) {

    this.settings = PageUtils.patchGameSettings(DEFAULT_SETTINGS, params.settings);
    this.currPageSettings = Utils.dereference(this.settings);
    this.debug && console.log("MCGE constructor, settings:", this.settings);

    const initialState: TState = params.state ?? {};
    this.state = new McgeState<TState>({ initialGameState: initialState });
    this.debug && console.log("MCGE constructor, state:", this.state);

    this.pages = params.pages;

    this.currPageIndex = PageUtils.targetPageIndex(this, this.pages, this.settings.startAt);
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

            mcge: this,
            settings: this.settings,
            page: this.currPage,
            content: this.currPageContent,
            choices: this.currPageChoices,
            contentLine: this.contentIndex,
            bgImage: this.lastBgImage ?? this.getDefaultBgImage(),

            next: async () => {
              this.debug && console.log("calling next()...");
              // const isFinished = this.advanceContent();
              const isFinished = this.allLinesDrawn;
              this.advanceContent();
              if (isFinished && Utils.isEmptyOrUndefined(this.currPage.choices)) {
                this.gotoPage(this.currPage.next);
              }
              m.redraw();
            },

            hoverChoice: (choice, index) => {
              this.callPageHook(this.settings.choices.onHoverDefault);
              this.callPageHook(choice.onHover);
            },

            selectChoice: (choice, index) => {
              this.callPageHook(this.settings.choices.onSelectDefault);
              this.selectChoice(this.currPage, choice, index);
            },

            contentLineFinished: () => {
              this.debug && console.log("Content line finished");
              this.contentLineFinished = true;
              const autoNext = this.currPage.contentSettings?.autoNext ?? this.settings.content.autoNext;
              const autoChoices = this.currPage.choicesSettings?.autoDisplay ?? this.settings.choices.autoDisplay;
              const advanceToChoices = autoChoices && (this.allLinesDrawn && (this.currPageChoices.length > 0));
              if (autoNext || advanceToChoices) {
                this.debug && console.log("Advancing content automatically");
                this.advanceContent();
                m.redraw();
              }
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
    const theme = Object.assign({}, DEFAULT_THEME, this.settings.theme);

    this.setCssVariable("--mcge-content-text-colour", theme.contentColourText);
    this.setCssVariable("--mcge-content-shadow-colour", theme.contentColourShadow);
    this.setCssVariable("--mcge-content-gap", theme.contentGap);
    this.setCssVariable("--mcge-content-border-radius", theme.contentBorderRadius);

    this.setCssVariable("--mcge-choice-colour-fg", theme.choiceColourFg);
    this.setCssVariable("--mcge-choice-colour-bg", theme.choiceColourBg);
    this.setCssVariable("--mcge-choice-colour-border", theme.choiceColourBorder);
    this.setCssVariable("--mcge-choice-colour-highlight", theme.choiceColourHighlight);
    this.setCssVariable("--mcge-choice-gap", theme.choiceGap);
    this.setCssVariable("--mcge-choice-border-radius", theme.choiceBorderRadius);

    this.setCssVariable("--mcge-scroll-fg", theme.scrollColourFg);
    this.setCssVariable("--mcge-scroll-bg", theme.scrollColourBg);
  }

  private setCssVariable(variable: string, value: string) {
    variable = variable.startsWith("--") ? variable : `--${variable}`;
    const root = document.querySelector(":root") as HTMLElement;
    root.style.setProperty(variable, value);
    this.debug && console.log(`Set CSS variable "${variable}" to "${value}"`);
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

  /**
   * Increment the index specifying the current line of content to proceed to the next line.
   * Can be called while a line of content is currently drawing in.
   * @returns 
   */
  advanceContent(): boolean {
    const prevIndex = this.contentIndex;
    this.contentIndex = Math.min(this.contentIndex + 1, this.currPageContent.length);
    this.contentLineFinished = false;

    // Return whether the content index has reached the end of the content list
    const isFinished = this.contentIndex === prevIndex;
    return isFinished;

    // return this.allLinesDrawn;
  }

  gotoPage(nextPage?: NextPageDef) {

    const targetIndex = PageUtils.targetPageIndex(this, this.pages, nextPage);
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

    // Call the end hook if it is defined
    if (this.currPage.hookEnd) {
      const result = this.currPage.hookEnd(this);
      if (result && "redirect" in result) {
        this.gotoPage(result.redirect);
        return;
      }
    }

    // CHANGE PAGE
    this.currPageIndex = index;

    // Call the start hook if it is defined
    if (this.currPage.hookStart) {
      const result = this.currPage.hookStart(this);
      if (result && "redirect" in result) {
        this.gotoPage(result.redirect);
        return;
      }
    }

    // Set the new cached page values
    this.currPageContent = PageUtils.pageContent(this, this.currPage);
    this.currPageChoices = PageUtils.pageChoices(this, this.currPage);
    this.currPageSettings = PageUtils.settingsForPage(this.settings, this.currPage);

    // Reset the index of the current line of content to display
    this.contentIndex = 0;
    this.contentLineFinished = false;
    const instantPage = this.currPage.contentSettings?.instantPage ?? this.settings.content.instantPage;
    if (instantPage) {
      this.contentIndex = this.currPageContent.length;
      this.contentLineFinished = true;
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

    const r = choice.onSelect?.(this);
    if (choice.next) {
      this.gotoPage(choice.next);
    } else {
      this.gotoNextPage();
    }

  }

  callPageHook(hook: PageHook | undefined) {
    if (!hook) return;

    const returned = hook(this);

    if (returned && "redirect" in returned) {
      this.gotoPage(returned.redirect);
    }
  }

  getDefaultBgImage(): PageImageDef | undefined {
    const bgImageDef: PageImageDef | undefined = this.settings.images.defaultBgImage
      ? { pos: "bg", url: this.settings.images.defaultBgImage }
      : undefined;
    return bgImageDef;
  }

}
