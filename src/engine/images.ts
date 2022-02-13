import { PageImageDef, PageImageSlot, PageImageSlotSetting } from "./types";

export class PageTurnerImages {

  private images: PageImageDef[] = [];

  get all() {
    return this.images;
  }

  constructor() {}

  allInSlot(slot: PageImageSlot) {
    return this.images.filter(i => i.slot === slot);
  }

  holdImages(...images: PageImageDef[]) {
    let numHeld = 0;
    images.forEach(image => {
      const found = this.images.some(i => i.url === image.url && i.slot === image.slot)
      if (!found) {
        this.images.push(image);
        numHeld++;
      }
    });
    console.log(`IMAGES: held ${numHeld} of ${images.length} new images (total ${this.all.length})`);
  }

  /**
   * Clear any held images by URL, either as string or page image definition object
   * @param images 
   */
  clearImages(...images: (string | PageImageDef)[]) {
    const clearedUrls: string[] = images.map(image => typeof image === "string" ? image : image.url);
    this.images = this.images.filter(i => {
      return !clearedUrls.includes(i.url);
    });
    console.log(`IMAGES: cleared ${images.length} images (total ${this.all.length})`);
  }

  clearAll() {
    this.images = [];
  }

  clearSlot(slot: PageImageSlotSetting | undefined) {

    if (slot !== undefined) {
      if (slot === "all") {
        this.images = [];
      } else {
        this.images = this.images.filter(i => i.slot !== slot);
      }
    }

    console.log(`IMAGES: cleared slot: ${slot} (total ${this.all.length})`);
  }

  clearSlots(...slots: PageImageSlotSetting[]) {

    if (slots.includes("all")) {
      this.clearAll();
    } else {
      this.images = this.images.filter(i => {
        return !slots.includes(i.slot);
      });
    }

    console.log(`IMAGES: cleared slots: ${slots} (total ${this.all.length})`);
  }

}
