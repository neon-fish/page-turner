
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

  playerName: string = "Player";
  rivalName: string = "Gary";

  get cargoReport(): string[] {
    const report: string[] = [];

    if ([].length === 0) {
      report.push("The cargo hold is currently empty.");
    } else {
      [].forEach(c => {
        report.push(`> ${c.qty} x ${c.name}`);
      });
    }

    return report;
  }

};
export const state = new State();

// export type S = typeof state;
