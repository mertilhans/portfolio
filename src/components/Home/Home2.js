import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/od_avatar.png";
import Tilt from "react-parallax-tilt";
import { AiFillGithub, AiFillInstagram, AiOutlineMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

// Deneyim suresi sabit yazilinca her yil eskiyordu ("4 years" 2026'da
// yanlisti). 2021 ilk kodun yazildigi yil.
const YEARS_DEVELOPING = new Date().getFullYear() - 2021;

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col md={8} className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              <i><b className="purple"> I wrote my first code in 2021. </b></i> Between 2021
              and 2023, I worked on frontend and backend development in Mobile Application and Web areas. Towards the end of 2023, I met artificial intelligence and since then I have been actively developing artificial intelligence projects.
               <i><b className="purple"> Software Developer </b></i> for about <i><b className="purple"> {YEARS_DEVELOPING} years </b></i> now.
              <br/>
              <br/>Today I am a student at
              <i><b className="purple"> 42 Kocaeli</b></i>, the peer-to-peer
              coding school ranked 3rd in the world for innovation, where
              most of my work is systems programming in
              <i><b className="purple"> C and C++</b></i>.
              <br/>
              <br/>I am fluent in
              <i><b className="purple"> C, C++, Python </b></i>
              <br />
              <br />
                I have been actively involved in dozens of artificial intelligence projects so far. Although I mostly work as a programmer, I have also taken on the role of team leader in many teams. 
              <i><b className="purple"> Project Management </b></i>, <i><b className="purple"> Strong Communication </b></i> and <i><b className="purple"> Being a Good Teammate </b></i> are the qualities I am proud of.
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="Mert Ilhan" />
            </Tilt>
          </Col>
        </Row>
        <Row>
          <Col md={12} className="home-about-social">
            <h1>FIND ME ON</h1>
            <p>
              Feel free to <span className="purple">connect </span>with me
            </p>
            <ul className="home-about-social-links">
              <li className="social-icons">
                <a
                  href="https://github.com/mertilhans"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <AiFillGithub />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/mertilhans"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.instagram.com/mertilhans"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour home-social-icons"
                >
                  <AiFillInstagram />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="mailto:mertilhanbv@gmail.com"
                  className="icon-colour home-social-icons"
                  aria-label="Email"
                >
                  <AiOutlineMail />
                </a>
              </li>
            </ul>
            <p className="home-contact-email">
              <a href="mailto:mertilhanbv@gmail.com">mertilhanbv@gmail.com</a>
            </p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
