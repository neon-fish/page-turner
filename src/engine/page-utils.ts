import { NextPageDef, Page, PageChoice, PageImageDef } from "./types";

export class PageUtils {

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
  static async targetPageIndex(pages: Page[], nextPage?: NextPageDef): Promise<number> {

    if (!nextPage) return -1;

    const target = typeof nextPage === "function"
      ? await nextPage()
      : nextPage;
    if (!target) return -1;

    const targetIndex = typeof target === "string"
      ? pages.findIndex(p => p.id === target)
      : pages.findIndex(p => p.id === target.id);

    return targetIndex;
  }

}
