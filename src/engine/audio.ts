import { Utils } from ".";
import { PageAudioDef } from "./types";

export class McgeAudio {

  private playing: { def: PageAudioDef, elem: HTMLAudioElement }[] = [];

  constructor() { }

  startMusic(audioDef: PageAudioDef) {
    const audio = new Audio(audioDef.url);
    if (audioDef.volume !== undefined) {
      audio.volume = audioDef.volume;
    }
    audio.loop = true;
    audio.play();
    this.playing.push({ def: audioDef, elem: audio });
    console.log(`AUDIO: started music: ${Utils.truncate(audioDef.url, 100)}`);
    console.log(audio.src);
  }

  replaceMusic(audioDef: PageAudioDef) {
    if (this.isMusicPlaying(audioDef)) return;
    console.log(`AUDIO: replacing music`);
    this.stopAllMusic();
    this.startMusic(audioDef);
  }

  stopAllMusic() {
    for (let i = 0; i < this.playing.length; i++) {
      const p = this.playing[i];
      p.elem.pause();
      p.elem.remove();
    }
    this.playing = [];
  }

  stopMusic(toStop: number | string | PageAudioDef) {

    for (let i = this.playing.length - 1; i >= 0; i--) {
      const p = this.playing[i];

      const stop = (typeof toStop === "number" && i === toStop) ||
        (typeof toStop === "string" && toStop === p.def.url) ||
        (typeof toStop === "object" && toStop.url === p.def.url);

      if (stop) {
        p.elem.pause();
        p.elem.remove();
        this.playing = this.playing.splice(i, 1);
      }
    }

  }

  isMusicPlaying(audioDef: PageAudioDef): boolean {
    const found = this.playing.find(p => p.def.url === audioDef.url);
    const isPlaying = found !== undefined;
    return isPlaying;
  }

  playAudio(audioDef: PageAudioDef) {
    const audio = new Audio(audioDef.url);
    if (audioDef.volume !== undefined) {
      audio.volume = audioDef.volume;
    }
    audio.play();
  }

}
