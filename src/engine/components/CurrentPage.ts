import m from "mithril";
import { PageUtils } from "../page-utils";
import { Page, PageImageDef } from "../types";
import { TypeText } from "./TypeText";

const content: string[] = [
  "",
];

const testChoices: string[] = [
  "Choice 1",
  "Choice 2",
  "Choice 3",
  "Choice 4",
  "Choice 5",
  "Choice 6",
];

const fantasyTree = `https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallup.net%2Fwp-content%2Fuploads%2F2018%2F09%2F29%2F666764-fantasy-landscape-art-artwork-nature-scenery.jpg&f=1&nofb=1`;
const cyberpunkStreet = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F68%2Fb4%2F46%2F68b446bbbabb02b6d91630943582c610.png&f=1&nofb=1";

/**
 * The story page currently being displayed
 */
export const CurrentPage: m.Component<{
  page: Page,
  contentLine: number,
  bgImage?: PageImageDef,
  next: () => any,
  selectChoice: (index: number) => any,
}, {}> = {

  oninit() { },

  view({ attrs }) {
    const { page, contentLine } = attrs;

    const bgImage = PageUtils.findBgImage(page) ?? attrs.bgImage;

    const allContent = PageUtils.pageContent(page);
    const currContent = allContent[contentLine];
    const prevContent = allContent.slice(0, contentLine);
    const contentFinished = prevContent.length === allContent.length;

    // console.log(`drawing page, curr content: ${currContent}`);

    return m(".h-full.w-full.relative", {
      id: "current-page",
      style: ``,
      class: `noselect`,
      tabindex: 0,
      onclick: (ev: MouseEvent) => attrs.next(),
      onkeydown: (ev: KeyboardEvent) => {
        if (ev.code === "Space" || ev.code === "Enter") attrs.next();
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
        id: "page-content",
        style: `inset: 0px;`,
      }, [

        m(".p-4", {
          id: "content-top",
          class: `space-y-2 text-white`,
          style: `height: 60%;`,
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

        (page.choices && contentFinished) ? m(".p-4.flex.flex-col.space-y-4.overflow-y-auto.scroller", {
          id: "content-bottom",
          style: `height: 40%;`,
          class: `backdrop-blur-sm`,
        }, [
          (page.choices ?? []).map(c => {
            const text = PageUtils.choiceText(c);

            return m("button.px-2.py-1.text-left.bg-white.border.rounded.shadow", {
              // class: `shadow-blue-300 hover:border-blue-300 hover:shadow-md hover:shadow-blue-300`,
              // class: `hover:ring hover:shadow-lg`,
              class: `hover:shadow-lg hover:shadow-blue-500 hover:border-blue-500`,
              onclick: () => { },
            }, text);
          }),
        ]) : [],

      ]),

    ]);

  }

};
