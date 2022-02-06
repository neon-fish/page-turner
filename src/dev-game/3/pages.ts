import { Page, Utils } from "../../engine";
import { IMAGE_URL } from "./assets";
import { state } from "./state";

// Definition of the game pages

/** Definitions of Page IDs */
export const PAGE = {
  mainMenu: Utils.id,

};

export const pages: Page[] = [

  {
    id: PAGE.mainMenu,
    content: [
      "This demo shows how to create an adventure game with turn-based combat mechanics, similar to the Pokémon games.",
      " ",
      "Main Menu",
    ],
    contentSettings: {
      top: "10%",
      width: "min(60%, 400px)",
      left: "calc((100% - min(60%, 400px)) / 2)",
      instantPage: true,
    },
    choices: [
      { text: "New Game", next: PAGE.mainMenu },
      { text: "Load Game", next: PAGE.mainMenu },
      { text: "Settings", next: PAGE.mainMenu },
    ],
    choicesSettings: {
      width: "min(60%, 400px)",
      left: "calc((100% - min(60%, 400px)) / 2)",
      height: "50%",
      top: "50%",
      align: "start",
      // autoDisplay: true,
    },
    images: [
      { pos: "bg", url: IMAGE_URL.introBg },
    ],
  },

  new Page(`
  Hello there!
  Welcome to the world of Pokémon!
  My name is Oak!
  People call me the Pokémon Prof!
  This world is inhabited by creatures called Pokémon!
  For some people, Pokémon are pets.
  Other use them for fights.
  Myself… I study Pokémon as a profession.
  First, what is your name?
  Right! So your name is <player>!
  This is my grandson. He's been your rival since you were a baby.
  …Erm, what is his name again?
  That's right! I remember now! His name is <rival>!
  <player>! Your very own Pokémon legend is about to unfold!
  A world of dreams and adventures with Pokémon awaits!
  Let's go!"
  `, {
    images: [
      { pos: "bg", url: IMAGE_URL.oakIntroBg },
    ],
  }),


];
