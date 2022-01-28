
const DEFAULT_LOCAL_STORAGE_KEY = "mcge-state";

export class McgeState<GameState extends object = {}> {

  private _engine = {};

  private _game: GameState;

  /** State used by the engine itself */
  get engine() {
    return this._engine;
  }

  /** State used by the game running on the engine */
  get game() {
    return this._game;
  }

  constructor(params: {
    initialGameState: GameState,
  }) {
    this._game = params.initialGameState;
  }

  /**
   * Save the current game and engine state to local storage
   * @param params 
   */
  saveToLocalStorage(params?: { storageKey?: string }) {
    const toSave = JSON.stringify({
      engine: this.engine,
      game: this.game,
    });
    localStorage.setItem(params?.storageKey ?? DEFAULT_LOCAL_STORAGE_KEY, toSave);
  }

  /**
   * Load any stored state from local storage
   * @param params 
   */
  loadFromLocalStorage(params?: { storageKey?: string }) {
    const { engine, game } = this.readFromLocalStorage(params);
    if (engine) this._engine = engine;
    if (game) this._game = game;
  }

  private readFromLocalStorage(params?: { storageKey?: string }): { game: any, engine: any } {
    const state = {
      game: undefined,
      engine: undefined,
    };
    const loadedString = localStorage.getItem(params?.storageKey ?? DEFAULT_LOCAL_STORAGE_KEY);
    try {
      if (loadedString !== null) {
        const loadedJson = JSON.parse(loadedString);
        state.engine = loadedJson.engine;
        state.game = loadedJson.game;
      }
    } catch (error) {
      console.error(`Could not read state from local storage`);
    }
    return state;
  }

  downloadFromLocalStorage(params?: { storageKey?: string }) {
    const state = this.loadFromLocalStorage(params);
    // TODO: download JSON
  }

}
