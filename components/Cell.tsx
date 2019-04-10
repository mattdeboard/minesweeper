// @flow
import * as React from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { difference, shuffle } from "lodash";
import {
  exposeAll,
  exposeCell,
  selectMineStatus,
  selectNeighbors,
  setExposedCells,
  State,
} from "../store";

export interface Props {
  adjacentMinesCount: number;
  col: number;
  exposeAll: typeof exposeAll;
  exposeCell: typeof exposeCell;
  isExposed: boolean;
  isMined: boolean;
  neighbors: string[];
  row: number;
  setExposedCells: typeof setExposedCells;
}

function Cell(props: Props) {
  const {
    adjacentMinesCount,
    col,
    exposeAll,
    exposeCell,
    isExposed,
    isMined,
    neighbors,
    row,
    setExposedCells,
  } = props;
  if (!isExposed) {
    return (
      <td>
        <Button
          color="danger"
          onClick={() => {
            if (isMined) {
              return exposeAll();
            }

            exposeCell(row, col);

            if (adjacentMinesCount === 0) {
              setExposedCells(neighbors);
            }
          }}
        >
          ❓
        </Button>
      </td>
    );
  }
  return (
    <td style={{ padding: "6px 8px" }} key={`row-${row}-cell-${col}`}>
      <span>{isMined ? "B" : adjacentMinesCount}</span>
    </td>
  );
}

export function generateCellProps(
  numMines: number,
  numCells: number,
): { isMined: boolean }[] {
  const minesArray = [...Array(numMines).keys()];
  return shuffle(
    [...Array(numCells).keys()].map(i => {
      return {
        isMined: minesArray.includes(i) ? true : false,
      };
    }),
  );
}

export default connect(
  (state: State, ownProps: Props) => {
    const neighbors = selectNeighbors(state, ownProps);
    return {
      adjacentMinesCount:
        state.gameConfig.numMines -
        difference(state.mineCells, neighbors).length,
      isMined: selectMineStatus(state, ownProps),
      isExposed:
        state.allExposed ||
        state.exposedCells.includes(`${ownProps.row},${ownProps.col}`),
      neighbors,
    };
  },
  { exposeAll, exposeCell, setExposedCells },
)(Cell);
