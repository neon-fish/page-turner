import m from "mithril";
import { PageImageDef } from "../types";

export const PageImage: m.Component<{
  imageDef: PageImageDef,
}> = {
  view({ attrs }) {
    const { imageDef } = attrs;

    let posStyle = "inset: 0px;";
    if (imageDef.slot === "bg") "inset: 0px;";
    if (imageDef.slot === "left") posStyle = "left: 0; top: 0; bottom: 0; width: 50%;";
    if (imageDef.slot === "centre") posStyle = "left: 25%; top: 0; bottom: 0; right: 25%;";
    if (imageDef.slot === "right") posStyle = "left: 50%; top: 0; bottom: 0; right: 0;";
    if (imageDef.slot === "fg") posStyle = "left: 25%; top: 25%; bottom: 25%; right: 25%;";
    if (imageDef.slot === "custom") posStyle = `inset: 0px;`;
    if (imageDef.pos !== undefined) {
      posStyle = "";
      if (imageDef.pos?.t) posStyle += ` top: ${imageDef.pos.t};`;
      if (imageDef.pos?.l) posStyle += ` left: ${imageDef.pos.l};`;
      if (imageDef.pos?.r) posStyle += ` right: ${imageDef.pos.r};`;
      if (imageDef.pos?.b) posStyle += ` bottom: ${imageDef.pos.b};`;
      if (imageDef.pos?.w) posStyle += ` width: ${imageDef.pos.w};`;
      if (imageDef.pos?.h) posStyle += ` height: ${imageDef.pos.h};`;
    }

    const objectFit = imageDef.fit ?? (imageDef.slot === "bg" ? "cover" : "contain");

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
