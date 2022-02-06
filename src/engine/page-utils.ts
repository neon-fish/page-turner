import { Mcge } from "./mcge";
import { ChoicesSettings, DeepPartial, GameSettings, NextPageDef, Page, PageChoice, PageImageDef, PageImageSlotSetting } from "./types";
import { Utils } from "./utils";

export class PageUtils {

  /**
   * Merges a partial settings object into a full settings object without modifying either.
   * Returns a new merged settings object.
   * @param settings 
   * @param patch 
   * @returns 
   */
  static patchGameSettings(settings: GameSettings, patch: DeepPartial<GameSettings>): GameSettings {

    // Use Object.assign() as a default, then explicitly patch all nested object
    const merged: GameSettings = {
      ...Object.assign({}, settings, patch),
      choices: Object.assign({}, settings.choices, patch.choices),
      content: Object.assign({}, settings.content, patch.content),
      theme: Object.assign({}, settings.theme, patch.theme),
    };

    return merged;
  }

  static settingsForPage(settings: GameSettings, page: Page): GameSettings {
    return this.patchGameSettings(settings, {
      content: page.contentSettings,
      choices: page.choicesSettings,
    });
  }

  /**
   * Apply any settings specified in the default settings partial page object
   * @param page 
   * @returns 
   */
  static pageWithAppliedDefaults(page: Page): Page {

    const pageWithDefaults: Page = {
      ...page.useDefaults,
      ...page,
      // Merge content and choices settings partial objects
      contentSettings: Object.assign({}, page.useDefaults?.contentSettings ?? {}, page.contentSettings),
      choicesSettings: Object.assign({}, page.useDefaults?.choicesSettings ?? {}, page.choicesSettings),
    };

    return pageWithDefaults;
  }

  /**
   * Split a given list of page images into those that should be held, and those that should be shown only once
   * @param images 
   * @param holdSlots 
   * @returns 
   */
  static findHeldImages(images: PageImageDef[], holdSlots: PageImageSlotSetting | PageImageSlotSetting[]) {
    const holdSlotsArr = Utils.elemOrArrToArr(holdSlots);

    const held: PageImageDef[] = [];
    const once: PageImageDef[] = [];

    images.forEach(image => {
      if (image.hold === true) {
        held.push(image);
        return;
      }
      if (image.once === true) {
        once.push(image);
        return;
      }
      if (holdSlotsArr.includes("all") || holdSlotsArr.includes(image.slot)) {
        held.push(image);
        return;
      } else {
        once.push(image);
        return;
      }
    });

    return { held, once };
  }

  /**
   * Find the first background image defined in the given page
   * @param page 
   * @returns 
   */
  static findBgImage(page: Page): PageImageDef | undefined {
    const bgImage = (page.images ?? []).find(i => i.slot === "bg");
    return bgImage;
  }

  static pageContent(mcge: Mcge, page: Page): string[] {
    const textArr: string[] = [];

    const pageContent = (typeof page.content === "function"
      ? page.content(mcge)
      : page.content) ?? []

    for (let i = 0; i < (pageContent ?? []).length; i++) {
      const c = (pageContent ?? [])[i];

      const text = typeof c === "string"
        ? c
        : typeof c === "function"
          ? c(mcge)
          : "?";
      textArr.push(text);
    }

    return textArr;
  }

  static pageChoices(mcge: Mcge, page: Page): PageChoice[] {

    if (!page.choices) return [];

    const choices = (typeof page.choices === "function")
      ? page.choices(mcge)
      : page.choices;

    return choices;
  }

  static choiceText(mcge: Mcge, choice: PageChoice): string {
    const text = typeof choice === "string"
      ? choice
      : typeof choice.text === "function"
        ? choice.text(mcge)
        : choice.text;
    return text;
  }

  /**
   * Finds the index of the target page
   * @param pages The list of all pages
   * @param nextPage The definition of the next page
   * @returns the index of the next page, or -1 if the target page was not found
   */
  static targetPageIndex(mcge: Mcge, pages: Page[], nextPage?: NextPageDef): number {

    if (nextPage === undefined) return -1;

    const target = typeof nextPage === "function"
      ? nextPage(mcge)
      : nextPage;
    if (target === undefined) return -1;

    const targetIndex = typeof target === "number"
      ? target
      : typeof target === "string"
        ? pages.findIndex(p => p.id === target)
        : typeof target === "object"
          ? pages.findIndex(p => p.id === target.id)
          : -1;

    return targetIndex;
  }

  static choicePanelJustify(choicesSettings: ChoicesSettings): string {
    return choicesSettings.align === "start" ? "start" :
      choicesSettings.align === "center" ? "center" :
        choicesSettings.align === "end" ? "end" :
          choicesSettings.align === "space" ? "space-around" :
            "center";

  }

}
