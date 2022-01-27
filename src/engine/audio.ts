import { PageAudioDef } from "./types/types";

export class McgeAudio {

  private playing: HTMLAudioElement[] = [];

  constructor() { }

  startMusic(audioDef: PageAudioDef) {
    const audio = new Audio(audioDef.url);
    if (audioDef.volume !== undefined) {
      audio.volume = audioDef.volume;
    }
    audio.loop = true;
    audio.play();
    this.playing.push(audio);
  }

  replaceMusic(audioDef: PageAudioDef) {
    if (this.isMusicPlaying(audioDef)) return;
    this.stopAllMusic();
    this.startMusic(audioDef);
  }

  stopAllMusic() {
    for (let i = 0; i < this.playing.length; i++) {
      const p = this.playing[i];
      p.pause();
      p.remove();
    }
    this.playing = [];
  }

  stopMusic(toStop: number | string | PageAudioDef) {

    for (let i = this.playing.length - 1; i >= 0; i--) {
      const p = this.playing[i];

      const stop = (typeof toStop === "number" && i === toStop) ||
        (typeof toStop === "string" && toStop === p.src) ||
        (typeof toStop === "object" && toStop.url === p.src);

      if (stop) {
        p.pause();
        p.remove();
        this.playing = this.playing.splice(i, 1);
      }
    }

  }

  isMusicPlaying(audioDef: PageAudioDef): boolean {
    const found = this.playing.find(p => p.src === audioDef.url);
    return found !== undefined;
  }

  playAudio(audioDef: PageAudioDef) {
    const audio = new Audio(audioDef.url);
    if (audioDef.volume !== undefined) {
      audio.volume = audioDef.volume;
    }
    audio.play();
  }

}
