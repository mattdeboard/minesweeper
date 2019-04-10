// @flow
import * as React from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { difference, shuffle } from "lodash";
import {
  State,
  exposeAll,
  exposeCell,
  selectBombStatus,
  selectNeighbors,
  setExposedCells,
} from "../store";

export interface Props {
  adjacentBombCount: number;
  exposeAll: typeof exposeAll;
  exposeCell: typeof exposeCell;
  hasBomb: boolean;
  row: number;
  col: number;
  isExposed: boolean;
  neighbors: string[];
  setExposedCells: typeof setExposedCells;
}

export interface BombCell {
  hasBomb: boolean;
}

function Cell(props: Props) {
  const {
    adjacentBombCount,
    exposeAll,
    exposeCell,
    setExposedCells,
    isExposed,
    row,
    col,
    hasBomb,
    neighbors,
  } = props;
  if (!isExposed) {
    return (
      <Button
        onClick={() => {
          if (hasBomb) {
            return exposeAll();
          }

          exposeCell(row, col);

          if (!hasBomb && adjacentBombCount === 0) {
            setExposedCells(neighbors);
          }
        }}
        color="danger"
      >
        :)
      </Button>
    );
  }
  return <span>{hasBomb ? "B" : adjacentBombCount}</span>;
}

export function generateCellProps(
  numBombs: number,
  numCells: number,
): { hasBomb: boolean }[] {
  const bombArray = [...Array(numBombs).keys()];
  return shuffle(
    [...Array(numCells).keys()].map(i => {
      return {
        hasBomb: bombArray.includes(i) ? true : false,
      };
    }),
  );
}

export default connect(
  (state: State, ownProps: Props) => {
    return {
      adjacentBombCount:
        state.gameConfig.numBombs -
        difference(state.bombCells, selectNeighbors(state, ownProps)).length,
      hasBomb: selectBombStatus(state, ownProps),
      isExposed:
        state.allExposed ||
        state.exposedCells.includes(`${ownProps.row},${ownProps.col}`),
      neighbors: selectNeighbors(state, ownProps),
    };
  },
  { exposeAll, exposeCell, setExposedCells },
)(Cell);
