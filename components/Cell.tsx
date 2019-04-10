// @flow
import * as React from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { difference, shuffle } from "lodash";
import {
  State,
  exposeAll,
  exposeCell,
  selectMineStatus,
  selectNeighbors,
  setExposedCells,
} from "../store";

export interface Props {
  adjacentMinesCount: number;
  exposeAll: typeof exposeAll;
  exposeCell: typeof exposeCell;
  isMined: boolean;
  row: number;
  col: number;
  isExposed: boolean;
  neighbors: string[];
  setExposedCells: typeof setExposedCells;
}

function Cell(props: Props) {
  const {
    adjacentMinesCount,
    exposeAll,
    exposeCell,
    setExposedCells,
    isExposed,
    row,
    col,
    isMined,
    neighbors,
  } = props;
  if (!isExposed) {
    return (
      <Button
        onClick={() => {
          if (isMined) {
            return exposeAll();
          }

          exposeCell(row, col);

          if (!isMined && adjacentMinesCount === 0) {
            setExposedCells(neighbors);
          }
        }}
        color="danger"
      >
        :)
      </Button>
    );
  }
  return <span>{isMined ? "B" : adjacentMinesCount}</span>;
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
    return {
      adjacentMinesCount:
        state.gameConfig.numMines -
        difference(state.mineCells, selectNeighbors(state, ownProps)).length,
      isMined: selectMineStatus(state, ownProps),
      isExposed:
        state.allExposed ||
        state.exposedCells.includes(`${ownProps.row},${ownProps.col}`),
      neighbors: selectNeighbors(state, ownProps),
    };
  },
  { exposeAll, exposeCell, setExposedCells },
)(Cell);
