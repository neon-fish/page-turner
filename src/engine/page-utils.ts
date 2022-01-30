import { DeepPartial, GameSettings } from "./types";
import { NextPageDef, Page, PageChoice, PageImageDef } from "./types";

export class PageUtils {

  static patchGameSettings(settings: GameSettings, patch: DeepPartial<GameSettings>): GameSettings {

    // Use Object.assign() as a default, then explicitly patch all nested object
    const merged: GameSettings = {
      ...Object.assign({}, settings, patch),
      choices: Object.assign(settings.choices, patch.choices),
      content: Object.assign(settings.content, patch.content),
      images: Object.assign(settings.images, patch.images),
      theme: Object.assign(settings.theme, patch.theme),
    };

    return merged;
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

  static pageContent(page: Page) {
    const textArr: string[] = [];

    for (let i = 0; i < (page.content ?? []).length; i++) {
      const c = (page.content ?? [])[i];

      const text = typeof c === "string"
        ? c
        : typeof c === "function"
          ? c()
          : "?";
      textArr.push(text);
    }

    return textArr;
  }

  static choiceText(choice: PageChoice): string {
    const text = typeof choice === "string"
      ? choice
      : typeof choice.text === "function"
        ? choice.text()
        : choice.text;
    return text;
  }

  /**
   * Finds the index of the target page
   * @param pages The list of all pages
   * @param nextPage The definition of the next page
   * @returns the index of the next page, or -1 if the target page was not found
   */
  static targetPageIndex(pages: Page[], nextPage?: NextPageDef): number {

    if (nextPage === undefined) return -1;

    const target = typeof nextPage === "function"
      ? nextPage()
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

}
