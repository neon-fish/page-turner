
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

  /**
   * Truncates strings longer than the given length and appends "...".
   * Strings shorter than the length are returned unmodified.
   * @param str 
   * @param maxLength 
   * @returns 
   */
   static truncate(str: string, maxLength: number) {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + "...";
  }

}
