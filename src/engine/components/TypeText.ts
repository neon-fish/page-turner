import m from "mithril";

export const TypeText: m.Component<{
  text: string,
  delay: number,
  showAll: boolean,

  style?: string,
  class?: string,
}, {
  currText: string,
  index: number,
}> = {

  oninit() {
    this.currText = "";
    this.index = 0;
  },

  oncreate() {
    // Kick update to fire at least once
    m.redraw();
  },

  onupdate({ attrs, dom }) {
    if (this.index < this.currText.length) {
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
      if (attrs.showAll) {
        this.index = this.currText.length;
      }
    }

    return m("span", {
      style: `${attrs.style ?? ""}`,
      class: `${attrs.class ?? ""}`,
    }, text.slice(0, this.index));
  }

};
