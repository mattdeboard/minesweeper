import React from "react";
import { connect } from "react-redux";
import { chunk } from "lodash";
import { Table } from "reactstrap";
import { GameConfig, State } from "../store";
import Cell, {
  Props as CellProps,
  generateCellProps,
} from "../components/Cell";

function Index(props: GameConfig) {
  const { numBombs, numRows, numCols } = props;
  const rows = chunk(generateCellProps(numBombs, numRows * numCols), numRows);
  return (
    <Table>
      <tbody>
        {rows.map((row: CellProps[], rowIdx: number) => {
          return (
            <tr key={`row-${rowIdx}`}>
              {row.map((cellProps, colIdx) => {
                return (
                  <td key={`row-${rowIdx}-cell-${colIdx}`}>
                    <Cell
                      adjacentBombCount={0}
                      row={rowIdx}
                      col={colIdx}
                      {...cellProps}
                    />
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

export default connect((state: State) => ({
  ...state.gameConfig,
}))(Index);
