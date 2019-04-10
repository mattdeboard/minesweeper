import React from "react";
import { connect } from "react-redux";
import { Table } from "reactstrap";
import {
  BombCell,
  GameConfig,
  State,
  initializeGame,
  setBombCell,
  selectGameBoard,
} from "../store";
import Cell from "../components/Cell";

interface Props {
  gameBoard: BombCell[][];
  initializeGame: typeof initializeGame;
  setBombCell: typeof setBombCell;
  selectGameBoard: typeof selectGameBoard;
}

class Index extends React.PureComponent<Props & GameConfig> {
  componentDidMount() {
    this.props.initializeGame();
  }

  render() {
    const { gameBoard } = this.props;
    return (
      <Table>
        <tbody>
          {gameBoard.map((row, rowIdx) => {
            return (
              <tr key={`row-${rowIdx}`}>
                {row.map((_, colIdx) => {
                  return (
                    <td key={`row-${rowIdx}-cell-${colIdx}`}>
                      <Cell row={rowIdx} col={colIdx} />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </Table>
    );
  }
}

export default connect(
  (state: State) => ({
    gameBoard: selectGameBoard(state),
  }),
  { initializeGame, setBombCell },
)(Index);
