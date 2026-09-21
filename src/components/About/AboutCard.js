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
            I wrote my first line of code in <span className="purple">2021</span> and
            have been building software ever since — these days mostly in
            <span className="purple"> C and C++</span>, alongside
            <span className="purple"> artificial intelligence</span> projects.
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
            "Talk is cheap. Show me the code."{" "}
          </p>
          <footer className="blockquote-footer">Linus Torvalds</footer>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
