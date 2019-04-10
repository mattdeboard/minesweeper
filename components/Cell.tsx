// @flow
import * as React from "react";
import { connect } from "react-redux";
import { Button } from "reactstrap";
import { shuffle } from "lodash";
import { State, exposeCell } from "../store";

export interface Props {
  adjacentBombCount: number;
  exposeCell: typeof exposeCell;
  hasBomb: boolean;
  row: number;
  col: number;
  isExposed: boolean;
}

// eslint-disable-next-line no-unused-vars
function Cell(props: Props) {
  if (!props.isExposed) {
    return (
      <Button
        onClick={() => props.exposeCell(props.row, props.col)}
        color="danger"
      >
        Danger!
      </Button>
    );
  }
  return <span>{props.adjacentBombCount}</span>;
}

export function generateCellProps(numBombs: number, numCells: number): Props[] {
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
  (state: State, ownProps: Props) => ({
    isExposed: state.exposedCells.includes(`${ownProps.row},${ownProps.col}`),
  }),
  { exposeCell },
)(Cell);
