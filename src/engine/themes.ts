import { Theme } from "./types";

/** The default theme if no theme is explicitly specified */
export const DEFAULT_THEME: Theme = {
  contentColourText: "white",
  contentColourShadow: "black",
  contentGap: "0.5rem",
  contentBorderRadius: "0px",

  choiceColourFg: "black",
  choiceColourBg: "white",
  choiceColourBorder: "#94a3b8",
  choiceColourHighlight: "#3b82f6",
  choiceGap: "1rem",
  choiceBorderRadius: "0px",

  scrollColourFg: "#e2e8f0",
  scrollColourBg: "#94a3b8",
};

/**
 * https://www.renpy.org/doc/html/gui.html#colors-fonts-and-font-sizes
 */
const renpy_colours = {
  /** This sets the color of the dialogue text. */
  text_color: "#402000",
  /** The color used for the text of unfocused choice buttons. */
  choice_button_text_idle_color: '#888888',
  /** The color used for the text of focused choice buttons. */
  choice_text_hover_color: '#0066cc',

  /** The accent color is used in many places in the GUI, including titles and labels. */
  accent_color: '#000060',
  /** The color used for most buttons when not focused or selected. */
  idle_color: '#606060',
  /** The color used for small text (like the date and name of a save slot, and quick menu buttons) when not hovered. This color often needs to be a bit lighter or darker than idle_color to compensate for the smaller size of the font. */
  idle_small_color: '#404040',
  /** The color used by focused items in the GUI, including the text of of buttons and the thumbs (movable areas) of sliders and scrollbars. */
  hover_color: '#3284d6',
  /** The color used by the text of selected buttons. (This takes priority over the hover and idle colors.) */
  selected_color: '#555555',
  /** The color used by the text of buttons that are insensitive to user input. (For example, the rollback button when no rollback is possible.) */
  insensitive_color: '#8888887f',
  /** The color used by static text in the game interface, such as text on the help and about screens. */
  interface_text_color: '#404040',
  /** Muted colors, used for the sections of bars, scrollbars, and sliders that do not represent the value or visible area. (These are only used when generating images, and will not take effect until images are regenerated in the launcher.) */
  muted_color: '#6080d0',
  /** Muted colors, used for the sections of bars, scrollbars, and sliders that do not represent the value or visible area. (These are only used when generating images, and will not take effect until images are regenerated in the launcher.) */
  hover_muted_color: '#8080f0',
};
