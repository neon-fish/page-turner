import { DeepPartial, GameSettings, Mcge, PageLayoutSettings } from "../../engine";
import { AUDIO, AUDIO_URL } from "./assets";
import { theme } from "./theme";

export const settings: DeepPartial<GameSettings> = {
  containerEl: "#mcge",
  debug: true,
  content: {
    // top: "5%",
    // height: "45%",
    // blur: true,
    // tint: true,
    // autoNext: true,
    // delay: 20,
  },
  choices: {
    tint: false,
    blur: false,
    // left: "calc((100% - min(80%, 600px)) / 2)",
    // width: "min(80%, 600px)",
    // top: "calc(100% - min(35%, 250px))",
    // height: "min(35%, 250px)",
    // autoDisplay: false,
    onSelectDefault: (mcge: Mcge) => mcge.audio.playAudio(AUDIO.sfxPressAB),
  },
  // images: {
  //   // defaultBgImage: IMAGE_URL.cyberpunkStreet,
  // },
  theme: theme,
};

export const pageLayout: { [key: string]: PageLayoutSettings } = {
  /** Page layout settings for menus */
  menu: {
    content: {
      top: "0",
      height: "50%",
      width: "min(60%, 400px)",
      left: "calc((100% - min(60%, 400px)) / 2)",
      instantPage: true,
      tint: false,
      blur: false,
    },
    choices: {
      width: "min(60%, 400px)",
      left: "calc((100% - min(60%, 400px)) / 2)",
      height: "50%",
      top: "50%",
      align: "start",
      tint: false,
      blur: false,
      // autoDisplay: true,
    },
  },
  conversation: {
    content: {
      top: "60%",
      height: "35%",
      width: "min(80%, 800px)",
      left: "calc((100% - min(80%, 800px)) / 2)",
      instantPage: false,
      tint: true,
      blur: true,
    },
    choices: {
      height: "60%",
      top: "0%",
      width: "min(80%, 800px)",
      left: "calc((100% - min(80%, 800px)) / 2)",
      align: "center",
      blur: false,
      tint: false,
    },
  },
};