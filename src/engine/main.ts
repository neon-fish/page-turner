
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

  }

}
