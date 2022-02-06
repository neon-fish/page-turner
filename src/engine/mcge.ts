import m from "mithril";
import { McgeAudio } from "./audio";
import { CurrentPage, CURRENT_PAGE_ID } from "./components/CurrentPage";
import { McgeImages } from "./images";
import { PageUtils } from "./page-utils";
import { McgeState } from "./state";
import { DEFAULT_THEME } from "./themes";
import { DeepPartial, GameSettings, NextPageDef, Page, PageChoice, PageContent, PageHook, PageImageDef, PageLayoutSettings, Theme } from "./types";
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
  holdImageSlots: "all",
  theme: DEFAULT_THEME,
};

export class Mcge<TState extends object = {}> {

  settings: GameSettings;
  get debug() { return this.settings.debug; }

  pages: Page[] = [];

  /**
   * The index in the pages list of the page being currently displayed.
   * Must only be set in processPageTransition()
   */
  private currPageIndex: number = 0;
  /**
   * The current page object being displayed.
   * Must only be set in processPageTransition()
   */
  private currPage: Page;
  // {
  //   return this.pages[this.currPageIndex];
  // }
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
  /** The list of un-held images for the current page */
  currPageImages: PageImageDef[] = [];

  audio: McgeAudio = new McgeAudio();
  images: McgeImages = new McgeImages();

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
    this.currPage = this.pages[this.currPageIndex];
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
            images: [...this.images.all, ...this.currPageImages],

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

  patchSettings(settings: DeepPartial<GameSettings>) {
    this.settings = PageUtils.patchGameSettings(this.settings, settings);
  }

  /**
   * Set layout settings to the given values, or the default values where a layout value is not specified
   * @param layout 
   */
  setLayout(layout: PageLayoutSettings) {
    const toSet: PageLayoutSettings = {
      content: Object.assign({}, DEFAULT_SETTINGS.content, layout.content),
      choices: Object.assign({}, DEFAULT_SETTINGS.choices, layout.choices),
    };
    this.settings = PageUtils.patchGameSettings(this.settings, toSet);
  }

  /**
   * Patch the current layout settings with the given layout settings
   * @param layout 
   */
  patchLayout(layout: PageLayoutSettings) {
    // const toSet: PageLayoutSettings = {
    //   content: Object.assign({}, DEFAULT_SETTINGS.content, layout.content),
    //   choices: Object.assign({}, DEFAULT_SETTINGS.choices, layout.choices),
    // };
    this.settings = PageUtils.patchGameSettings(this.settings, layout);
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

    // ===== CHANGE PAGE =====
    this.currPageIndex = index;
    this.currPage = PageUtils.pageWithAppliedDefaults(this.pages[this.currPageIndex]);

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
    if (this.currPageSettings.content.instantPage) {
      this.contentIndex = this.currPageContent.length;
      this.contentLineFinished = true;
    }

    // Clear any specified image slots to clear
    this.currPageImages = [];
    if (this.currPage.clearImageSlots !== undefined) {
      this.images.clearSlots(...this.currPage.clearImageSlots);
      this.debug && console.log(`Clearing image slots for new page: ${this.currPage.clearImageSlots}`);
    }

    // For pages in the new current page, either hold them or add them to the volatile list
    if (this.currPage.images !== undefined) {
      const { held, once } = PageUtils.findHeldImages(this.currPage.images, this.settings.holdImageSlots);
      this.debug && console.log(`New page images: ${held.length} held, ${once.length} once`);
      this.images.holdImages(...held);
      this.currPageImages = once;
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

}
