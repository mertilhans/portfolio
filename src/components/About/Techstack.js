import React from "react";
import { Col, Row } from "react-bootstrap";
import { CgCPlusPlus } from "react-icons/cg";

import {
    SiCsharp,
    SiSwift,
    SiPython
} from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
        <Col xs={4} md={2} className="tech-icons">
            <SiCsharp />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <CgCPlusPlus />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiPython />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiSwift />
        </Col>
    </Row>
  );
}

export default Techstack;
