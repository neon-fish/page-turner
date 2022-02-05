import { Page, Utils } from "../../engine";
import { IMAGE_URL } from "./assets";
import { state } from "./state";

// Definition of the game pages

/** Definitions of Page IDs */
export const PAGE = {
  start: Utils.id,

  orders: Utils.id,
  orderPos: Utils.id,
  orderDest: Utils.id,
  orderDestDetail: Utils.id,
  orderCargo: Utils.id,
  orderCargoDetail: Utils.id,
  orderInspect: Utils.id,

};

export const pages: Page[] = [

  new Page(`
  Welcome Captain.
  We continue on our previous heading, we will arrive in approximately 3 days.
  Nothing to report.
  `, {
    id: PAGE.start,
    images: [
      { pos: "bg", url: IMAGE_URL.bridge },
    ],
  }),

  new Page(`What are your orders?`, [
    { text: "What is our current position?", next: PAGE.orderPos },
    { text: "What is our destination?", next: PAGE.orderDest },
    { text: "Give me a report of our current cargo.", next: PAGE.orderCargo },
    { text: "Carry on, I'm going to inspect the ship.", next: PAGE.orderInspect },
  ], { id: PAGE.orders }),

  {
    id: PAGE.orderPos,
    content: [
      () => `We are currently ${state.travelPosition} in ${state.travelPosSystem}.`,
    ],
    next: PAGE.orders,
  },

  {
    id: PAGE.orderDest,
    content: [
      (mcge) => `We are heading towards ${state.travelDest}.`,
      () => `We will arrive in ${"3 days, 17 hours"}.`,
    ],
    choices: [
      { text: () => `Tell me more about ${state.travelDest}`, next: PAGE.orderDestDetail },
      { text: `Very good.`, next: PAGE.orders },
    ],
    // next: PAGE.orders,
  },
  {
    id: PAGE.orderDestDetail,
    content: [
      () => `Our destination is ${state.travelDest}.`,
      `[destination detail]`,
    ],
    choices: [
      { text: `Very good.`, next: PAGE.orders },
    ],
  },

  {
    id: PAGE.orderCargo,
    contentSettings: {

    },
    content: [
      () => [
        `Cargo report:`,
        ...state.cargoReport,
        "End of report.",
      ].join("\n"),
    ],
    choices: [
      { text: "Very good.", next: PAGE.orders },
      ...state.cargo.length === 0
        ? []
        : state.cargo.map(c => {
          return {
            text: `Tell me about the ${c.name}`,
            onSelect: () => { state.inspectCargo = c; },
            next: PAGE.orderCargoDetail,
          };
        }),
    ].flat(),
    next: PAGE.orders,
  },
  {
    hookStart: () => {
      // Ensure cargo is selected
      if (state.inspectCargo === undefined) return { redirect: PAGE.orderCargo };
    },
    content: () => [
      `Detailed report for: ${state.inspectCargo.name}`,
      state.inspectCargo.desc
    ],
    next: PAGE.orderCargo
  },

  new Page(`
  [inspecting the ship]
  `, { id: PAGE.orderInspect }),

];
