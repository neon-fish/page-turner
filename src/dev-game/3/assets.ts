// To import static assets
/// <reference types="vite/client" />

import { PageAudioDef } from '../../engine';
import sfxPressAB from './assets/SFX_PRESS_AB.wav';

// Definitions of static assets

export const IMAGE_URL = {

  introBg: `https://i.pinimg.com/736x/df/4e/8b/df4e8ba28f912bf9cdf9fa0dfc196411--wallpaper-pack-beach-wallpaper.jpg`,
  oakIntroBg: `https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/e42b702a-1af0-4496-95c7-9a69c3614a60/d55xmlz-36575942-1d5b-4d61-b741-8c8c6a74bbe3.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcL2U0MmI3MDJhLTFhZjAtNDQ5Ni05NWM3LTlhNjljMzYxNGE2MFwvZDU1eG1sei0zNjU3NTk0Mi0xZDViLTRkNjEtYjc0MS04YzhjNmE3NGJiZTMucG5nIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.OWChHeZNVKaq65Mk88nqxPTgy5o3Z2sn8S5VAqL_WPs`,
  oakLab: "https://pm1.narvii.com/6296/d605756de14e585cc436643796061c2f72db429e_hq.jpg",

  oak: `https://www.nicepng.com/png/full/125-1251389_oak-gary-delia-pokemon-costumes-professor-oak.png`,
  pikachuWave: `https://clipart.world/wp-content/uploads/2021/01/Friendly-Pikachu-clipart-transparent.png`,
  gary: `https://www.pikpng.com/pngl/b/581-5814314_gary-oak-png-pokemon-gary-png-clipart.png`,

};

export const AUDIO_URL = {
  // Music

  // Sounds
  sfxPressAB,

};

export const AUDIO: { [key: string]: PageAudioDef } = {
  sfxPressAB: { url: AUDIO_URL.sfxPressAB, volume: 0.2 },
};
