
export type ShipState =
  | "docked"
  | "orbit"
  | "travelling"
  ;

export interface CargoItem {
  name: string,
  qty: number,
  desc: string,
}

export class State {

  shipStatus: ShipState = "travelling";

  travelSource = "Mars orbit";
  travelPosition = "interplanetary space";
  travelPosSystem = "the Solar system";
  travelDest = "Huygens Station, orbiting Titan";

  cargo: CargoItem[] = [
    {
      name: "Case of Widgets",
      qty: 6,
      desc: "A hardened flight case full of regular-sized Widgets.\nNot rated for exposure to vacuum.",
    },
  ];

  inspectCargo: CargoItem | undefined = undefined;

  get cargoReport(): string[] {
    const report: string[] = [];

    if (this.cargo.length === 0) {
      report.push("The cargo hold is currently empty.");
    } else {
      this.cargo.forEach(c => {
        report.push(`> ${c.qty} x ${c.name}`);
      });
    }

    return report;
  }

};
export const state = new State();

// export type S = typeof state;
