import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { chunk, union } from "lodash";
import { Props as CellProps, generateCellProps } from "./components/Cell";
import { createSelector } from "reselect";
export interface GameConfig {
  numMines: number;
  numRows: number;
  numCols: number;
}
export interface State {
  allExposed: boolean;
  mineCells: string[];
  exposedCells: string[];
  gameBoard: MineCell[];
  gameConfig: GameConfig;
}

export interface MineCell {
  isMined: boolean;
}

const initialState = {
  allExposed: false,
  mineCells: [],
  exposedCells: [],
  gameBoard: [],
  gameConfig: {
    numMines: 10,
    numCols: 10,
    numRows: 10,
  },
};

export const reducer = (state: State = initialState, action: any) => {
  switch (action.type) {
    case "INIT_GAME": {
      const { numMines, numRows, numCols } = state.gameConfig;
      const cells = generateCellProps(numMines, numRows * numCols);
      const mineCells = cells.reduce((acc: string[], cell, idx) => {
        const coordKey = coordinateKey(oneDToTwoD(idx, numCols));

        if (cell.isMined) {
          return acc.concat(coordKey);
        }

        return acc;
      }, []);

      return {
        ...state,
        mineCells,
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
        mineCells: union(state.mineCells, [action.coordinates]),
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

export function setMineCell(row: number, col: number) {
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
export const selectCells = createSelector<State, number, number, MineCell[]>(
  state => state.gameConfig.numMines,
  state => state.gameConfig.numRows * state.gameConfig.numCols,
  (numMines, numCells) => generateCellProps(numMines, numCells),
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

export const selectMineStatus = createSelector(
  (state: State) => state.mineCells,
  (_: any, props: CellProps) => props.row,
  (_, props: CellProps) => props.col,
  (mineCells, row, col) => mineCells.includes(coordinateKey({ row, col })),
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
  (_: any, props: CellProps) => props.row,
  (_: any, props: CellProps) => props.col,
  getNeighbors,
);
