import m from "mithril";
import { CurrentPage } from "./CurrentPage";

/**
 * 
 */
export const Layout: m.Component<{}> = {
  view() {
    return m(".h-full.w-full", {
      id: "layout",
    }, [
      m(CurrentPage, {}),
    ]);
  }
};
