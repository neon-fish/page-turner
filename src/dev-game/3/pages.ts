import { Mcge, Page, Utils } from "../../engine";
import { IMAGE_URL } from "./assets";
import { pageLayout } from "./settings";
import { state } from "./state";

// Definition of the game pages

/** Definitions of Page IDs */
export const PAGE = {
  mainMenu: Utils.id,
  setUpNewGame: Utils.id,
  loadGame: Utils.id,
  gameSettings: Utils.id,
  playerNameInput: Utils.id,
  rivalNameInput: Utils.id,
};

export const pages: Page[] = [

  {
    id: PAGE.mainMenu,
    content: [
      "This demo shows how to create an adventure game with turn-based combat mechanics, similar to the Pokémon games.",
      " ",
      "Main Menu",
    ],
    choices: [
      { text: "New Game", next: PAGE.setUpNewGame },
      { text: "Load Game", next: PAGE.loadGame },
      { text: "Settings", next: PAGE.gameSettings },
    ],
    images: [
      { slot: "bg", url: IMAGE_URL.introBg },
    ],
    hookStart: (mcge) => {
      mcge.setLayout(pageLayout.menu);
    },
  },

  {
    id: PAGE.gameSettings,
    content: [
      "Game Settings",
    ],
    contentSettings: {
      instantPage: true,
    },
    choices: [
      { text: "[setting button]", next: PAGE.gameSettings },
      { text: "[setting button]", next: PAGE.gameSettings },
      { text: "[setting button]", next: PAGE.gameSettings },
      { text: "Main Menu", next: PAGE.mainMenu },
    ],
  },

  {
    id: PAGE.loadGame,
    content: [
      "Load game",
    ],
    choices: [
      { text: "Slot 1: [no data]", next: PAGE.loadGame },
      { text: "Slot 2: [no data]", next: PAGE.loadGame },
      { text: "Slot 3: [no data]", next: PAGE.loadGame },
      { text: "Slot 4: [no data]", next: PAGE.loadGame },
      { text: "Slot 5: [no data]", next: PAGE.loadGame },
      { text: "Main Menu", next: PAGE.mainMenu },
    ],
  },

  {
    id: PAGE.setUpNewGame,
    content: [],
    hookStart: (mcge: Mcge) => {

      // set up game state
      // TODO

      // Set conversation layout
      mcge.setLayout(pageLayout.conversation);

      // Immediately advance pages
      mcge.gotoNextPage();
    },
  },

  new Page(`
    Hello there!
    Welcome to the world of Pokémon!
    My name is Oak!
    People call me the Pokémon Prof!
  `, {
    clearImageSlots: ["all"],
    images: [
      { slot: "bg", url: IMAGE_URL.oakIntroBg },
      { slot: "right", url: IMAGE_URL.oak },
    ],
  }),
  new Page(`
    This world is inhabited by creatures called Pokémon!
    For some people, Pokémon are pets.
    Other use them for fights.
    Myself… I study Pokémon as a profession.
  `, {
    images: [
      // { slot: "bg", url: IMAGE_URL.oakIntroBg },
      // { slot: "right", url: IMAGE_URL.oak },
      { url: IMAGE_URL.pikachuWave, once: true, slot: "custom", pos: { t: "35%", l: "10%", w: "30%", h: "30%" } },
    ],
  }),
  {
    content: [
      "First, what is your name?",
    ],
    hookEnd: () => {
      const name = prompt("What is your name?", state.playerName);
      state.playerName = name;
    },
  },
  {
    content: () => [
      `Right! So your name is ${state.playerName}!`,
    ],
  },
  new Page(`
    This is my grandson. He's been your rival since you were a baby.
  `, {
    images: [
      { slot: "left", url: IMAGE_URL.gary },
    ],
  }),
  {
    content: [
      "…Erm, what is his name again?",
    ],
    hookEnd: () => {
      const name = prompt("What was his name again?", state.rivalName);
      state.rivalName = name;
    },
  },
  {
    content: [
      () => `That's right! I remember now! His name is ${state.rivalName}!`,
    ],
  },
  {
    clearImageSlots: ["left"],
    content: () => [
      `${state.playerName}! Your very own Pokémon legend is about to unfold!`,
      `A world of dreams and adventures with Pokémon awaits!`,
      `Let's go!`,
    ],
  },


];
