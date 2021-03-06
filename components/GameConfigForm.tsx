import * as React from "react";
import { connect } from "react-redux";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import {
  setGameConfig,
  GameConfig,
  initializeGame,
  State as AppState,
} from "../store";

interface Props {
  gameConfig: GameConfig;
  initializeGame: typeof initializeGame;
  setGameConfig: typeof setGameConfig;
}

class GameConfigForm extends React.PureComponent<Props> {
  render() {
    const { numMines } = this.props.gameConfig;
    return (
      <Form>
        <FormGroup>
          <Label for="numMines"># of Mines:</Label>
          <Input
            id="numMines"
            name="mines"
            onChange={this.handleMines}
            style={{ minWidth: 80, width: "30%" }}
            type="textarea"
            value={numMines}
          />
        </FormGroup>
        <FormGroup>
          <Label for="numRows"># of Rows:</Label>
          <Input
            type="select"
            id="dimensions"
            name="dimensions"
            onChange={this.handleDimensions}
            style={{ minWidth: 100, width: "30%" }}
          >
            <option value="10">10x10</option>
            <option value="8">8x8</option>
          </Input>
        </FormGroup>
        <div className="my-2">
          <Button color="primary" onClick={() => this.props.initializeGame()}>
            Restart Game
          </Button>
        </div>
      </Form>
    );
  }

  handleDimensions = (e: { target: { value: string } }) => {
    const numRows = parseInt(e.target.value);
    const numCols = parseInt(e.target.value);
    this.props.setGameConfig({
      ...this.props.gameConfig,
      numCols,
      numRows,
    });
    this.props.initializeGame();
  };

  handleMines = (e: { target: { id: string; value: string } }) => {
    this.props.setGameConfig({
      ...this.props.gameConfig,
      [e.target.id]: parseInt(e.target.value),
    });
    this.props.initializeGame();
  };
}

export default connect(
  (state: AppState) => ({
    gameConfig: state.gameConfig,
  }),
  { initializeGame, setGameConfig },
)(GameConfigForm);
