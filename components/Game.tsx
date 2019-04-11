import * as React from "react";
import { Table } from "reactstrap";
import { connect } from "react-redux";
import { coordinateKey, MineCell, selectGameBoard, State } from "../store";
import Cell from "../components/Cell";

interface Props {
  gameBoard: MineCell[][];
}

function Game(props: Props) {
  const { gameBoard } = props;
  return (
    <Table bordered>
      <tbody>
        {gameBoard.map((row, rowIdx) => {
          return (
            <tr key={`row-${rowIdx}`}>
              {row.map((_, colIdx) => {
                return (
                  <Cell
                    key={coordinateKey({ row: rowIdx, col: colIdx })}
                    row={rowIdx}
                    col={colIdx}
                  />
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default connect((state: State) => ({
  gameBoard: selectGameBoard(state),
}))(Game);
