import m from "mithril";
import { PageImageDef } from "../types";

export const PageImage: m.Component<{
  imageDef: PageImageDef,
}> = {
  view({ attrs }) {
    const { imageDef } = attrs;

    const posStyle = imageDef.pos === "bg" ? "inset: 0px;" :
      imageDef.pos === "left" ? "left: 0; top: 0; bottom: 0; width: 50%;" :
        imageDef.pos === "centre" ? "left: 25%; top: 0; bottom: 0; right: 25%;" :
          imageDef.pos === "right" ? "left: 50%; top: 0; bottom: 0; right: 0;" :
            imageDef.pos === "fg" ? "left: 25%; top: 25%; bottom: 25%; right: 25%;" :
              imageDef.pos === "custom" ? `` :
                "inset: 0px;";

    const objectFit = imageDef.fit ?? (imageDef.pos === "bg" ? "cover" : "contain");

    return m("", {
      style: `position: absolute; ${posStyle}`,
    }, [
      m("img", {
        src: imageDef.url,
        style: `width: 100%; height: 100%; object-fit: ${objectFit}; ${imageDef.style ?? ""}`,
      }),
    ]);
  }
};
