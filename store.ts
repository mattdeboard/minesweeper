import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { chunk, union } from "lodash";
import { Props as CellProps, generateCellProps } from "./components/Cell";
import { createSelector } from "reselect";
export interface GameConfig {
  numBombs: number;
  numRows: number;
  numCols: number;
}
export interface State {
  allExposed: boolean;
  bombCells: string[];
  exposedCells: string[];
  gameBoard: string[][];
  gameConfig: GameConfig;
}

export interface BombCell {
  hasBomb: boolean;
}

const initialState = {
  allExposed: false,
  bombCells: [],
  exposedCells: [],
  gameBoard: [],
  gameConfig: {
    numBombs: 10,
    numCols: 10,
    numRows: 10,
  },
};

export const reducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case "INIT_GAME": {
      const { numBombs, numRows, numCols } = state.gameConfig;
      const cells = generateCellProps(numBombs, numRows * numCols);
      const bombCells = cells.reduce((acc: string[], cell, idx) => {
        const coordKey = coordinateKey(oneDToTwoD(idx, numCols));

        if (cell.hasBomb) {
          return acc.concat(coordKey);
        }

        return acc;
      }, []);

      return {
        ...state,
        bombCells,
        gameBoard: cells,
      };
    }

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

    case "SET_BOMB_CELL":
      return {
        ...state,
        bombCells: union(state.bombCells, [action.coordinates]),
      };

    case "SET_EXPOSED_CELLS":
      return {
        ...state,
        exposedCells: union(state.exposedCells, action.coordinates),
      };

    case "EXPOSE_ALL":
      return {
        ...state,
        allExposed: true,
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

export function setBombCell(row: number, col: number) {
  return {
    type: "SET_BOMB_CELL",
    coordinates: `${row},${col}`,
  };
}

export function setExposedCells(coordinateKeys: string[]) {
  return {
    type: "SET_EXPOSED_CELLS",
    coordinates: coordinateKeys,
  };
}

export function initializeGame() {
  return {
    type: "INIT_GAME",
  };
}

export function exposeAll() {
  return { type: "EXPOSE_ALL" };
}

export function initializeStore(state: State = initialState) {
  return createStore(reducer, state, composeWithDevTools(applyMiddleware()));
}

// Selectors
export const selectCells = createSelector<State, number, number, BombCell[]>(
  state => state.gameConfig.numBombs,
  state => state.gameConfig.numRows * state.gameConfig.numCols,
  (numBombs, numCells) => generateCellProps(numBombs, numCells),
);

export const selectCellChunks = createSelector(
  selectCells,
  state => state.gameConfig.numCols,
  (cells, numCols) => chunk(cells, numCols),
);

export const selectGameBoard = createSelector(
  (state: State) => state.gameConfig.numCols,
  state => state.gameBoard,
  (numCols, gameBoard) => chunk(gameBoard, numCols),
);

export const selectBombStatus = createSelector(
  (state: State) => state.bombCells,
  (_, props: CellProps) => props.row,
  (_, props: CellProps) => props.col,
  (bombCells, row, col) => bombCells.includes(coordinateKey({ row, col })),
);

export function coordinateKey(coordinates: { row: number; col: number }) {
  return `${coordinates.row},${coordinates.col}`;
}

export function coordsFromKey(key: string) {
  return key.split(",").map(s => parseInt(s));
}

export function oneDToTwoD(i: number, width: number) {
  return {
    row: Math.floor(i / width),
    col: i % width,
  };
}

export function getNeighbors(row: number, col: number) {
  const offsets = [
    [0, -1],
    [0, 1],
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  return offsets.reduce((acc: string[], [x, y]) => {
    if (col + x >= 0 && row + y >= 0) {
      return acc.concat(coordinateKey({ row: row + y, col: col + x }));
    }
    return acc;
  }, []);
}

export const selectNeighbors = createSelector(
  (_, props: CellProps) => props.row,
  (_, props: CellProps) => props.col,
  getNeighbors,
);
