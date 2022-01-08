import m from "mithril";
import { CurrentPage } from "./CurrentPage";

/**
 * 
 */
export const Layout: m.Component<{}> = {
  view() {
    return m("", {}, [
      m(CurrentPage, {}),
    ]);
  }
};
