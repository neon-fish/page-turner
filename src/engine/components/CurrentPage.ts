import m from "mithril";
import { PageUtils } from "../page-utils";
import { ChoicesSettings, ContentSettings, GameSettings, Page, PageChoice, PageImageDef } from "../types";
import { PageImage } from "./PageImage";
import { TypeText } from "./TypeText";
import { TypeWord } from "./TypeWord";

export const CURRENT_PAGE_ID = "current-page";
const CONTENT_PANEL_ID = "page-content";
const CHOICES_PANEL_ID = "page-choices";

/**
 * The story page currently being displayed
 */
export const CurrentPage: m.Component<{
  settings: GameSettings,
  page: Page,
  contentLine: number,
  bgImage?: PageImageDef,
  next: () => any,
  selectChoice: (choice: PageChoice, index: number) => any,
}, {
  lastPage: Page | undefined,
  highlightChoiceIndex: number | undefined,
}> = {

  oninit() {
    this.lastPage = undefined;
    this.highlightChoiceIndex = undefined;
  },

  onupdate({ dom }) {
    const contentPanel = dom.querySelector(`#${CONTENT_PANEL_ID}`);
    // console.log(`Updated CurrentPage, scrolling panel: ${contentPanel}`);
    if (contentPanel) {
      contentPanel.scrollTop = contentPanel.scrollHeight;
    }
  },

  view({ attrs }) {
    const { settings, page, contentLine } = attrs;

    // If the page has changed, reset state
    if (this.lastPage !== page) {
      this.lastPage = page;
      this.highlightChoiceIndex = undefined;
    }

    const bgImage = PageUtils.findBgImage(page) ?? attrs.bgImage;

    const allContent = PageUtils.pageContent(page);
    const currContent = allContent[contentLine];
    const prevContent = allContent.slice(0, contentLine);
    const contentFinished = prevContent.length === allContent.length;

    const contentSettings: ContentSettings = Object.assign({}, settings.content, page.contentSettings ?? {});
    const choicesSettings: ChoicesSettings = Object.assign({}, settings.choices, page.choicesSettings ?? {});

    // console.log(`drawing page, curr content: ${currContent}`);

    return m(".h-full.w-full.relative", {
      id: CURRENT_PAGE_ID,
      style: ``,
      class: `noselect`,
      tabindex: 0,
      onclick: (ev: MouseEvent) => {
        const target = ev.target as HTMLElement;
        if (target.tagName !== "BUTTON") attrs.next();
      },
      onkeydown: (ev: KeyboardEvent) => {
        const target = ev.target as HTMLElement;
        const hasChoices = page.choices && page.choices.length > 0;

        // Advance page with Space or Enter
        if (target.tagName !== "BUTTON") {
          if (ev.code === "Space" || ev.code === "Enter") attrs.next();
        }

        // Move highlighted choice with arrow keys
        if (hasChoices && ev.code === "ArrowDown") {
          this.highlightChoiceIndex = Math.min(this.highlightChoiceIndex !== undefined ? this.highlightChoiceIndex + 1 : 0, page.choices!.length - 1);
        }
        if (hasChoices && ev.code === "ArrowUp") {
          this.highlightChoiceIndex = Math.max(this.highlightChoiceIndex !== undefined ? this.highlightChoiceIndex - 1 : 0, 0);
        }

        // Choose the highlighted choice with Enter
        if (ev.code === "Enter" && this.highlightChoiceIndex !== undefined) {
          const selected = page.choices?.[this.highlightChoiceIndex];
          if (selected) attrs.selectChoice(selected, this.highlightChoiceIndex);
        }
      },
    }, [

      // Images
      m(".absolute", {
        id: "page-images",
        style: `inset: 0px;`,
      }, [
        bgImage ? m("img.w-full.h-full", {
          style: `object-fit: cover;`,
          src: bgImage.url,
        }) : [],
        (page.images ?? []).map(imageDef => {
          return m(PageImage, { imageDef });
        }),
      ]),

      // Content & Choices
      m(".absolute", {
        id: `page-content-choices`,
        style: `inset: 0px;`,
      }, [

        // Content panel
        m(".p-4.absolute.flex.flex-col.space-y-2.overflow-y-auto.scroller", {
          id: CONTENT_PANEL_ID,
          class: `text-white whitespace-pre-wrap ${contentSettings.blur ? "backdrop-blur-sm" : ""}`,
          style: `top: ${contentSettings.top}; height: ${contentSettings.height}; left: 0; right: 0;
            text-shadow: black 0px 0px 4px, black 0px 0px 4px;`,
        }, [
          prevContent.map(c => {
            return m("p", c);
          }),
          currContent
            ? (contentSettings.fast
              ? m(TypeWord, {
                class: "block",
                text: currContent,
                delay: settings.content.delay,
                showAll: settings.content.instant,
              })
              : m(TypeText, {
                class: "block",
                text: currContent,
                delay: settings.content.delay,
                showAll: settings.content.instant,
              })
            ) : [],
        ]),

        // Choices panel
        (page.choices && contentFinished)
          ? m(".p-4.absolute.flex.flex-col.space-y-4.overflow-y-auto.scroller", {
            id: CHOICES_PANEL_ID,
            style: `top: ${choicesSettings.top}; height: ${choicesSettings.height}; left: 0; right: 0;`,
            class: `${choicesSettings.blur ? "backdrop-blur-sm" : ""}`,
          }, [
            (page.choices ?? []).map((c, i) => {
              const text = PageUtils.choiceText(c);
              const isHighlighted = this.highlightChoiceIndex === i;

              return m("button.px-2.py-1.text-left.bg-white.border.rounded.shadow", {
                // class: `shadow-blue-300 hover:border-blue-300 hover:shadow-md hover:shadow-blue-300`,
                // class: `hover:ring hover:shadow-lg`,
                class: `hover:shadow-lg hover:shadow-blue-500 hover:border-blue-500 ${isHighlighted ? "shadow-lg shadow-blue-500 border-blue-500" : ""}`,
                onmouseover: (ev: MouseEvent) => this.highlightChoiceIndex = i,
                onclick: () => attrs.selectChoice(c, i),
              }, text);
            }),
          ])
          : [],

      ]),

    ]);

  }

};
