import { Mcge } from "./mcge";
import { ChoicesSettings, DeepPartial, GameSettings, NextPageDef, Page, PageChoice, PageImageDef } from "./types";

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
      images: Object.assign({}, settings.images, patch.images),
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
   * Find the first background image defined in the given page
   * @param page 
   * @returns 
   */
  static findBgImage(page: Page): PageImageDef | undefined {
    const bgImage = (page.images ?? []).find(i => i.pos === "bg");
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
