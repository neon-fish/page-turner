import m from "mithril";

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
export const CurrentPage: m.Component<{}> = {
  view() {
    return m(".h-full.w-full.relative", {
      id: "current-page",
      style: ``,
      class: ``,
    }, [

      // Images
      m(".absolute", {
        id: "page-images",
        style: `inset: 0px;`,
      }, [
        m("img.w-full.h-full", {
          style: `object-fit: cover;`,
          src: cyberpunkStreet,
        }),
      ]),

      // Content
      m(".absolute", {
        id: "page-content",
        style: `inset: 0px;`,
      }, [

        m(".p-4", {
          id: "content-top",
          style: `height: 60%;`,
        }, []),

        m(".p-4.flex.flex-col.space-y-4.overflow-y-auto.scroller", {
          id: "content-bottom",
          style: `height: 40%;`,
          class: `backdrop-blur-sm`,
        }, [
          testChoices.map(c => {
            return m("button.px-2.py-1.text-left.bg-white.border.rounded.shadow", {
              // class: `shadow-blue-300 hover:border-blue-300 hover:shadow-md hover:shadow-blue-300`,
              // class: `hover:ring hover:shadow-lg`,
              class: `hover:shadow-lg hover:shadow-blue-500 hover:border-blue-500`,
              onclick: () => {}
            }, c);
          }),
        ]),

      ]),

    ]);
  }
};
