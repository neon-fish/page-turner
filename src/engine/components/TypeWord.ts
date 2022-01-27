import m from "mithril";

export const TypeWord: m.Component<{
  text: string,
  delay: number,
  showAll: boolean,

  style?: string,
  class?: string,
}, {
  currText: string,
  currWords: string[],
  index: number,
  // displayingText: string;
}> = {

  oninit() {
    this.currText = "";
    this.currWords = [],
    this.index = 0;
    // this.displayingText = "";
  },

  oncreate() {
    // Kick update to fire at least once
    m.redraw();
  },

  onupdate({ attrs, dom }) {
    if (this.index < this.currWords.length) {
      this.index++;

      const delay = attrs.delay;
      if (delay === 0) {
        m.redraw();
      } else {
        setTimeout(() => m.redraw(), delay);
      }
    }

    // dom.scrollIntoView(false);
  },

  view({ attrs }) {
    const text = attrs.text ?? "";

    // If the input value has changed, reset the component
    if (text !== this.currText) {
      this.index = 0;
      this.currText = text;
      this.currWords = this.currText.split(" ");
      // this.displayingText = "";
      if (attrs.showAll) {
        this.index = this.currWords.length;
      }
    }

    return m("span", {
      style: `${attrs.style ?? ""}`,
      class: `${attrs.class ?? ""}`,
    }, this.currWords.slice(0, this.index).join(" "));
  }

};
