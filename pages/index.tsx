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
      <Container fluid style={{ width: "90%" }}>
        <Jumbotron>
          <h1 className="text-center">Minesweeping</h1>
        </Jumbotron>
        <Row className="p-4">
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
