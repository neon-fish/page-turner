import { DeepPartial, GameSettings } from "../../engine";
import { theme } from "./theme";

export const settings: DeepPartial<GameSettings> = {
  containerEl: "#page-turner",
  debug: true,
  content: {
    top: "5%",
    height: "45%",
    // blur: true,
    // tint: true,
    // autoNext: true,
    delay: 20,
  },
  choices: {
    tint: true,
    left: "calc((100% - min(80%, 600px)) / 2)",
    width: "min(80%, 600px)",
    top: "calc(100% - min(35%, 250px))",
    height: "min(35%, 250px)",
    // autoDisplay: false,
  },
  // images: {
  //   // defaultBgImage: IMAGE_URL.cyberpunkStreet,
  // },
  theme: theme,
};