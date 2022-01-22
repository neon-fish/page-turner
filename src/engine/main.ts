import m from "mithril";
import { Layout } from "./components/Layout";

export interface Settings {
  /** Element containing the game, as an element or selector */
  containerEl: string | HTMLElement,
}

export const DEFAULT_SETTINGS: Settings = {
  containerEl: "#app",
};

export class MCGE {

  settings: Settings;

  constructor(initial: Partial<Settings>) {

    this.settings = DEFAULT_SETTINGS;
    Object.assign(this.settings, initial);

    this.init();
  }

  private init() {

    const appEl = typeof this.settings.containerEl === "string"
      ? document.querySelector<HTMLDivElement>(this.settings.containerEl)!
      : this.settings.containerEl;

    m.mount(appEl, Layout);

  }

}
