import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/od_avatar.png";
import Tilt from "react-parallax-tilt";
import {
  AiFillGithub,
  AiOutlineTwitter,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

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
              <i><b className="purple"> I wrote my first code in 2019. </b></i> Between 2020
              and 2023, I worked on frontend and backend development in Mobile Application and Web areas. Towards the end of 2023, I met artificial intelligence and since then I have been actively developing artificial intelligence projects.
               <i><b className="purple"> Software Developer </b></i> for about <i><b className="purple"> 4 years </b></i> now.
              <br/>
              <br/>I am fluent in
              <i><b className="purple"> C, Python </b></i>
              <br />
              <br />
                I have been actively involved in dozens of artificial intelligence projects so far. Although I mostly work as a programmer, I have also taken on the role of team leader in many teams. 
              <i><b className="purple"> Project Management </b></i>, <i><b className="purple"> Strong Communication </b></i> and <i><b className="purple"> Being a Good Teammate </b></i> are the qualities I am proud of.
            </p>
          </Col>
          <Col md={4} className="myAvtar">
            <Tilt>
              <img src={myImg} className="img-fluid" alt="avatar" />
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
                  href="https://www.linkedin.com/in/mert-ilhan-b1408b26a/"
                  target="_blank"
                  rel="noreferrer"
                  className="icon-colour  home-social-icons"
                >
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
