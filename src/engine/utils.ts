
export class Utils {

  static isEmptyOrUndefined(value: any) {

    if (value === undefined) return true;
    if (value === null) return true;

    if (typeof value === "string" && value.length === 0) return true;
    if ("length" in value && value.length === 0) return true;

    return false;
  }

}
