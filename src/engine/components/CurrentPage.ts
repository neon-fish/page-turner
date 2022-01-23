import m from "mithril";
import { PageUtils } from "../page-utils";
import { Page, PageChoice, PageImageDef } from "../types";
import { TypeText } from "./TypeText";

export const CURRENT_PAGE_ID = "current-page";
const CONTENT_PANEL_ID = "page-content";
const CHOICES_PANEL_ID = "page-choices";

/**
 * The story page currently being displayed
 */
export const CurrentPage: m.Component<{
  page: Page,
  contentLine: number,
  bgImage?: PageImageDef,
  next: () => any,
  selectChoice: (choice: PageChoice, index: number) => any,
}, {}> = {

  oninit() { },

  onupdate({ dom }) {
    const contentPanel = dom.querySelector(`#${CONTENT_PANEL_ID}`);
    // console.log(`Updated CurrentPage, scrolling panel: ${contentPanel}`);
    if (contentPanel) {
      contentPanel.scrollTop = contentPanel.scrollHeight;
    }
  },

  view({ attrs }) {
    const { page, contentLine } = attrs;

    const bgImage = PageUtils.findBgImage(page) ?? attrs.bgImage;

    const allContent = PageUtils.pageContent(page);
    const currContent = allContent[contentLine];
    const prevContent = allContent.slice(0, contentLine);
    const contentFinished = prevContent.length === allContent.length;

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
        if (target.tagName !== "BUTTON") {
          if (ev.code === "Space" || ev.code === "Enter") attrs.next();
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
      ]),

      // Content
      m(".absolute", {
        id: `page-content-choices`,
        style: `inset: 0px;`,
      }, [

        m(".p-4.flex.flex-col.space-y-2.overflow-y-auto.scroller", {
          id: CONTENT_PANEL_ID,
          class: `text-white whitespace-pre-wrap`,
          style: `height: 60%; text-shadow: black 0px 0px 2px;`,
        }, [
          prevContent.map(c => {
            return m("p", c);
          }),
          currContent ? m(TypeText, {
            class: "block",
            text: currContent,
            delay: 0,
          }) : [],
        ]),

        (page.choices && contentFinished)
          ? m(".p-4.flex.flex-col.space-y-4.overflow-y-auto.scroller", {
            id: CHOICES_PANEL_ID,
            style: `height: 40%;`,
            class: `backdrop-blur-sm`,
          }, [
            (page.choices ?? []).map((c, i) => {
              const text = PageUtils.choiceText(c);

              return m("button.px-2.py-1.text-left.bg-white.border.rounded.shadow", {
                // class: `shadow-blue-300 hover:border-blue-300 hover:shadow-md hover:shadow-blue-300`,
                // class: `hover:ring hover:shadow-lg`,
                class: `hover:shadow-lg hover:shadow-blue-500 hover:border-blue-500`,
                onclick: () => attrs.selectChoice(c, i),
              }, text);
            }),
          ])
          : [],

      ]),

    ]);

  }

};
