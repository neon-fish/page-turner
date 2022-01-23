
export class Utils {

  /**
   * Determines if a given value is undefined, null, or empty
   * @param value 
   * @returns 
   */
  static isEmptyOrUndefined(value: any) {

    if (value === undefined) return true;
    if (value === null) return true;

    if (typeof value === "string" && value.length === 0) return true;
    if ("length" in value && value.length === 0) return true;

    return false;
  }

  /** Generates and returns a new random(ish) ID string */
  static get id(): string {
    return Math.random().toString();
  }

}
