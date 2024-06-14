import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi, I am <span className="purple">Mert ilhan </span>
            from <span className="purple"> Tekirdag , Turkey.</span>
            <br />
            Buraya birseyler ekle
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight/> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight/> Writing Tech Blogs
            </li>
            <li className="about-activity">
              <ImPointRight/> Creating AI Agent
            </li>
            <li className="about-activity">
              <ImPointRight/> Travelling
            </li>
            <li className="about-activity">
              <ImPointRight/> Playing Electro Guitar
            </li>
          </ul>

          <p style={{color: "rgb(155 126 172)"}}>
            "Işık yaradan sızar"{" "}
          </p>
          <footer className="blockquote-footer">Mevlana</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
