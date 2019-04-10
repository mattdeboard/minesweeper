import React from "react";
import { connect } from "react-redux";
import { Container, Jumbotron, Row, Col } from "reactstrap";
import { initializeGame } from "../store";
import Game from "../components/Game";
import GameConfigForm from "../components/GameConfigForm";
import "bootstrap/dist/css/bootstrap.min.css";

interface Props {
  initializeGame: typeof initializeGame;
}

class Index extends React.PureComponent<Props> {
  componentDidMount() {
    this.props.initializeGame();
  }

  render() {
    return (
      <Container fluid style={{ width: "100%" }} className="m-3 p-2">
        <Jumbotron>
          <h1 className="text-center">Minesweeping</h1>
        </Jumbotron>
        <Row>
          <Col>
            <GameConfigForm />
          </Col>
          <Col>
            <Game />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default connect(
  null,
  { initializeGame },
)(Index);
