import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Home2 from "./Home2";
import Type from "./Type";
import HeroTerminal from "./HeroTerminal";

function Home() {
  return (
    <section>
      <Container fluid className="home-section" id="home">
        <Container className="home-content">
          <Row>
            <Col md={7} className="home-header">
              <span className="home-kicker">
                <span className="home-kicker-dot" />
                42 Kocaeli · Systems &amp; AI
              </span>
              <p className="heading">
                Hi there{" "}
                <span className="wave" role="img" aria-label="waving hand">
                  👋🏻
                </span>{" "}
                I'm
              </p>

              <h1 className="heading-name">
                <strong className="main-name">Mert Ilhan</strong>
              </h1>

              <div style={{ padding: 50, textAlign: "left" }}>
                <Type />
              </div>
            </Col>

            <Col md={5} className="hero-terminal-col">
              <HeroTerminal />
            </Col>
          </Row>
        </Container>
      </Container>
      <Home2 />
    </section>
  );
}

export default Home;
