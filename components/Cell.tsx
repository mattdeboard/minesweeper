// @flow
import * as React from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import {
  exposeAll,
  exposeCell,
  selectMineStatus,
  selectNeighbors,
  setExposedCells,
  State,
  selectAdjacentMinesCount,
  selectIsExposed,
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
      <td style={{ textAlign: "center" }}>
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
    <td style={{ textAlign: "center" }} key={`row-${row}-cell-${col}`}>
      <span>{isMined ? "B" : adjacentMinesCount}</span>
    </td>
  );
}

export default connect(
  (state: State, ownProps: Props) => {
    return {
      adjacentMinesCount: selectAdjacentMinesCount(state, ownProps),
      isMined: selectMineStatus(state, ownProps),
      isExposed: selectIsExposed(state, ownProps),
      neighbors: selectNeighbors(state, ownProps),
    };
  },
  { exposeAll, exposeCell, setExposedCells },
)(Cell);
