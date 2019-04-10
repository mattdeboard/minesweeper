import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { union } from "lodash";

export interface GameConfig {
  numBombs: number;
  numRows: number;
  numCols: number;
}
export interface State {
  exposedCells: string[];
  gameConfig: GameConfig;
}

const initialState = {
  exposedCells: [],
  gameConfig: {
    numBombs: 5,
    numCols: 10,
    numRows: 10,
  },
};

export const reducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case "SET_GAME_CONFIG":
      return {
        ...state,
        gameConfig: action.gameConfig,
      };

    case "EXPOSE_CELL":
      return {
        ...state,
        exposedCells: union(state.exposedCells, [action.coordinates]),
      };

    default:
      return state;
  }
};

export function setGameConfig(gameConfig: GameConfig) {
  return {
    type: "SET_GAME_CONFIG",
    gameConfig,
  };
}

export function exposeCell(row: number, col: number) {
  return {
    type: "EXPOSE_CELL",
    coordinates: `${row},${col}`,
  };
}

export function initializeStore(state: State = initialState) {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware()));
}
