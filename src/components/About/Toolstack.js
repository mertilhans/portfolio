import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudio,
    SiRider,
  SiMacos, 
    SiUnrealengine,SiTrello, SiFigma, SiGithub, SiXcode, SiNotion, SiAdobeillustrator, SiAdobepremierepro
} from "react-icons/si";
import {
    DiUnitySmall,
    DiIllustrator, DiVisualstudio,

} from "react-icons/di";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
        <Col xs={4} md={2} className="tech-icons">
            <DiUnitySmall />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiUnrealengine />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiVisualstudio />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiTrello />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiFigma />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiGithub />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiXcode />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiNotion />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiAdobeillustrator />
        </Col>
        <Col xs={4} md={2} className="tech-icons">
            <SiAdobepremierepro />
        </Col>
        
    </Row>
  );
}

export default Toolstack;
