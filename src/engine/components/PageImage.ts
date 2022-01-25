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

    return m(".absolute", {
      style: `${posStyle}`,
    }, [
      m("img.w-full.h-full", {
        src: imageDef.url,
        style: `object-fit: ${objectFit}; ${imageDef.style ?? ""}`,
      })
    ]);
  }
};
