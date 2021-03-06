import m from "mithril";
import { PageTurner } from "../page-turner";
import { PageUtils } from "../page-utils";
import { ChoicesSettings, ContentSettings, GameSettings, Page, PageChoice, PageContent, PageImageDef } from "../types";
import { PageImage } from "./PageImage";
import { TypeText } from "./TypeText";
import { TypeWord } from "./TypeWord";

export const CURRENT_PAGE_ID = "pt-page";
const IMAGES_PANEL_ID = "pt-page-images";
const CONTENT_PANEL_ID = "pt-page-content";
const CHOICES_PANEL_ID = "pt-page-choices";

/**
 * The story page currently being displayed
 */
export const CurrentPage: m.Component<{
  pt: PageTurner,
  settings: GameSettings,
  page: Page,
  content: PageContent[],
  choices: PageChoice[],
  contentLine: number,
  images: PageImageDef[],
  next: () => any,
  hoverChoice: (choice: PageChoice, index: number) => any,
  selectChoice: (choice: PageChoice, index: number) => any,
  contentLineFinished: () => any,
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
    if (contentPanel) {
      contentPanel.scrollTop = contentPanel.scrollHeight;
    }
  },

  view({ attrs }) {
    const { pt, settings, page, content, choices, contentLine, images } = attrs;

    // If the page has changed, reset state
    if (this.lastPage !== page) {
      this.lastPage = page;
      this.highlightChoiceIndex = undefined;
      // settings.debug && console.log(`Reset CurrentPage state`);
    }

    const allContent = PageUtils.pageContent(pt, page);
    const currContent = allContent[contentLine];
    const prevContent = allContent.slice(0, contentLine);
    const contentFinished = prevContent.length === allContent.length;
    // console.log(`Drawing content:`, allContent);

    // const allChoices = PageUtils.pageChoices(pt, page);

    const contentSettings: ContentSettings = Object.assign({}, settings.content, page.contentSettings ?? {});
    const choicesSettings: ChoicesSettings = Object.assign({}, settings.choices, page.choicesSettings ?? {});

    return m("", {
      id: CURRENT_PAGE_ID,
      style: ``,
      class: `no-select page-${page.id}`,
      tabindex: 0,
      onclick: (ev: MouseEvent) => {
        const target = ev.target as HTMLElement;
        if (target.tagName !== "BUTTON") attrs.next();
      },
      onkeydown: (ev: KeyboardEvent) => {
        const target = ev.target as HTMLElement;
        const hasChoices = choices && choices.length > 0;

        // Advance page with Space or Enter
        if (target.tagName !== "BUTTON") {
          if (ev.code === "Space" || ev.code === "Enter") {
            ev.preventDefault();
            attrs.next();
          }
        }

        // Move highlighted choice with arrow keys
        if (hasChoices && ev.code === "ArrowDown") {
          ev.preventDefault();
          this.highlightChoiceIndex = Math.min(this.highlightChoiceIndex !== undefined ? this.highlightChoiceIndex + 1 : 0, choices!.length - 1);
          const highlighted = choices?.[this.highlightChoiceIndex];
          if (highlighted && attrs.hoverChoice) attrs.hoverChoice(highlighted , this.highlightChoiceIndex);
        }
        if (hasChoices && ev.code === "ArrowUp") {
          ev.preventDefault();
          this.highlightChoiceIndex = Math.max(this.highlightChoiceIndex !== undefined ? this.highlightChoiceIndex - 1 : 0, 0);
          const highlighted = choices?.[this.highlightChoiceIndex];
          if (highlighted && attrs.hoverChoice) attrs.hoverChoice(highlighted , this.highlightChoiceIndex);
        }

        // Choose the highlighted choice with Enter
        if (ev.code === "Enter" && this.highlightChoiceIndex !== undefined) {
          const selected = choices?.[this.highlightChoiceIndex];
          if (selected) attrs.selectChoice(selected, this.highlightChoiceIndex);
        }
      },
    }, [

      // ===== Images =====
      m("", {
        id: IMAGES_PANEL_ID,
        style: `position: absolute; inset: 0px;`,
      }, [
        // bgImage ? m("img", {
        //   style: `height: 100%; width: 100%; object-fit: cover;`,
        //   src: bgImage.url,
        // }) : [],
        (images ?? []).map(imageDef => {
          return m(PageImage, { imageDef });
        }),
      ]),

      // ===== Content =====
      m(".", {
        id: CONTENT_PANEL_ID,
        style: `top: ${contentSettings.top}; height: ${contentSettings.height};
          left: ${contentSettings.left}; width: ${contentSettings.width};`,
        class: `scroller ${contentSettings.blur ? "bd-blur-4" : ""} ${contentSettings.tint ? "bg-tint-2" : ""}`,
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
              showAll: settings.content.instantLine,
              onFinished: () => attrs.contentLineFinished(),
            })
            : m(TypeText, {
              class: "block",
              text: currContent,
              delay: settings.content.delay,
              showAll: settings.content.instantLine,
              onFinished: () => attrs.contentLineFinished(),
            })
          ) : [],
      ]),

      // ===== Choices =====
      ((choices ?? []).length > 0 && contentFinished)
        ? m("", {
          id: CHOICES_PANEL_ID,
          style: `top: ${choicesSettings.top}; height: ${choicesSettings.height};
            left: ${choicesSettings.left}; width: ${choicesSettings.width};`,
          class: `scroller ${choicesSettings.blur ? "bd-blur-4" : ""} ${choicesSettings.tint ? "bg-tint-2" : ""}`,
        }, [
          m("", {
            class: "choices-panel-internal",
            style: `justify-content: ${PageUtils.choicePanelJustify(choicesSettings)};`,
          }, [
          (choices ?? []).map((c, i) => {
            const text = PageUtils.choiceText(pt, c);
            const isHighlighted = this.highlightChoiceIndex === i;

            return m("button", {
              class: `${isHighlighted ? "highlight" : ""}`,
              onmouseover: (ev: MouseEvent) => {
                this.highlightChoiceIndex = i;
                attrs.hoverChoice?.(c, i);
              },
              onclick: () => attrs.selectChoice(c, i),
            }, text);
          }),
        ]),
        ])
        : [],

    ]);

  }

};
