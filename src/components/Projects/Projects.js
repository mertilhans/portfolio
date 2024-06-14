import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import zenith from "../../Assets/Projects/zenith.png";
import liveCorp from "../../Assets/Projects/liveCorp.png";
import viroots from "../../Assets/Projects/viroots.png";
import tombHunter from "../../Assets/Projects/tombHunter.png";
import subject42 from "../../Assets/Projects/subject42.png";
import tetris from "../../Assets/Projects/tetris.png";
import jamSimulator from "../../Assets/Projects/jamSimulator.png";
import whoThief from "../../Assets/Projects/whoThief.png";
import siemensKiosk from "../../Assets/Projects/siemensKiosk.png";
import funlary from "../../Assets/Projects/funlary.png";
import tapTap from "../../Assets/Projects/tapTap.png";
import sweetSwap from "../../Assets/Projects/sweetSwap.png";
import flyingBasketball from "../../Assets/Projects/flyingBasketball.png";
import prepareSurgery from "../../Assets/Projects/prepareSurgery.png";
import ballMaster from "../../Assets/Projects/ballMaster.png";
import finagle from "../../Assets/Projects/finagle.png";
import roadPlanner from "../../Assets/Projects/roadPlanner.png";
import coupleMatch from "../../Assets/Projects/coupleMatch.png";
import matchRun from "../../Assets/Projects/sweetSwap.png";
import stuntChaser from "../../Assets/Projects/stuntChaser.png";
import skipIt from "../../Assets/Projects/skipIt.png";
import lostAlien from "../../Assets/Projects/lostAlien.png";
import influenceIt from "../../Assets/Projects/influenceIt.png";
import transformDragons from "../../Assets/Projects/transformDragons.png";
import angryRagdoll from "../../Assets/Projects/angryRagdoll.png";
import celebrityPeeker from "../../Assets/Projects/celebrityPeeker.png";
import escapeBoss from "../../Assets/Projects/escapeBoss.png";
import houseGolf from "../../Assets/Projects/houseGolf.png";
import ballThrow from "../../Assets/Projects/ballThrow.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      
      <Container>
        <h1 className="project-heading">
          My PC <strong className="purple"> Games </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few PC game projects I've worked.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={zenith}
              isBlog={false}
              title="Zenith"
              description="Zenith is a 2D, turn-based, online strategy game that revolves around players defeating their opponents with personalized characters. The characters in the game are inspired by Stoicism and Hedonism philosophies. This game, which you can play online with your friends, promises an enjoyable experience and a competitive environment where you can spend hours battling it out."
              //ghLink="https://github.com/soumyajit4419/Chatify"
              //demoLink="https://chatify-49.web.app/"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={liveCorp}
              isBlog={false}
              title="Live Corp: The Portal Experiment"
              description="Live Corp has been carefully crafted to offer you a unique experience. The rule is simple: Solve puzzles, Go through the portals, Listen to (not) the manager?"
              ghLink="https://github.com/oguzhandelibas/Live-Corp-The-Experiment"
              demoLink="https://oguzhandelibas.itch.io/live-corp-the-portal-experiment"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={viroots}
              isBlog={false}
              title="Viroots"
              description="We play as an evil alien race traveling from planet to planet, extracting core energies while facing resistance from the Innocent Locals. Our goal is to reach each planet's core before they destroy our machinery. Through strategic defense and weapon upgrades, we aim to secure our resource extraction operations."
              ghLink="https://github.com/oguzhandelibas/ggj23-roots"
              demoLink="https://oguzhandelibas.itch.io/viroots"              
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={tombHunter}
              isBlog={false}
              title="Tomb Hunter"
              description="Our character, who fights against the Forces of Evil, must defeat enemies encountered along the way while trying to find their path. In this demo project, where we can develop our skill tree with earned experiences and gradually become more powerful, defeating the boss will not be easy."
              // ghLink="https://github.com/soumyajit4419/Plant_AI"
              demoLink="https://oguzhandelibas.itch.io/tomb-hunter"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={subject42}
              isBlog={false}
              title="Subject-42"
              description="Using 'Natural Launguage Processing' for the detection of suicide-related posts and user's suicide ideation in cyberspace  and thus helping in sucide prevention."
              //ghLink="https://github.com/soumyajit4419/AI_For_Social_Good"
              demoLink="https://www.youtube.com/watch?v=GNDLiwaRTk0&t=48s"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={tetris}
              isBlog={false}
              title="Tetris"
              description="It is a classic Tetris game written in C++."
              ghLink="https://github.com/oguzhandelibas/Tetris-Game"
              // demoLink="https://blogs.soumya-jit.tech/"      <--------Please include a demo link here 
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={jamSimulator}
                isBlog={false}
                title="Jam Simulator"
                description="In a game simulating a Jam environment, we attempt to manipulate Jam participants to win the competition. Can you execute all manipulation tasks before time runs out and emerge as the winner?"
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://oguzhandelibas.itch.io/jam-simulator"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={whoThief}
                isBlog={false}
                title="Who is the Thief"
                description="In this puzzle-based game, we control our detective character using a turn-based special movement system. There's a case we're trying to solve, and there are many household residents to question! Interrogate the characters and unravel the plot before time runs out!"
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://globalgamejam.org/2021/games/missing-artifact-1"
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <h1 className="project-heading">
          My <strong className="purple"> Corporate </strong> Projects
        </h1>
        <p style={{ color: "white" }}>
          Here are a few corporate projects I've worked.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={10} className="project-card">
            <ProjectCard
                imgPath={siemensKiosk}
                isBlog={false}
                title="Siemens Kiosk"
                description={"This project was developed to be offered to customers in Siemens physical stores. Its purpose is to enable users to easily review the list of Siemens products. In the project, functions such as dynamic product management and measuring user preferences are supported by the backend structure."}
            />
          </Col>
        </Row>
      </Container>
      <Container>
        <h1 className="project-heading">
          My Mobile <strong className="purple"> Games </strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few Mobile game projects I've worked.
        </p>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={funlary}
                isBlog={false}
                title="Funlary: Join & Joy"
                //   description="Personal Chat Room or Workspace to share resources and hangout with friends build with react.js, Material-UI, and Firebase. Have features which allows user for realtime messaging, image sharing as well as supports reactions on messages."
                //ghLink="https://github.com/soumyajit4419/Chatify"
                demoLink="https://play.google.com/store/apps/details?id=com.ODProjects.Funlary"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={tapTap}
                isBlog={false}
                title="Tap Tap: Loop Time!"
                //   description="My personal blog page build with Next.js and Tailwind Css which takes the content from makdown files and renders it using Next.js. Supports dark mode and easy to write blogs using markdown."
                //ghLink="https://github.com/soumyajit4419/Bits-0f-C0de"
                demoLink="https://play.google.com/store/apps/details?id=com.ODProjects.TapTap"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={sweetSwap}
                isBlog={false}
                title="Sweet Swap: Match Fruit"
                //  description="Online code and markdown editor build with react.js. Online Editor which supports html, css, and js code with instant view of website. Online markdown editor for building README file which supports GFM, Custom Html tags with toolbar and instant preview.Both the editor supports auto save of work using Local Storage"
                //ghLink="https://github.com/soumyajit4419/Editor.io"
                demoLink="https://play.google.com/store/apps/details?id=com.odprojects.SweetSwap"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={flyingBasketball}
                isBlog={false}
                title="Flying Basketball"
                // description="Used the plant disease dataset from Kaggle and trained a image classifer model using 'PyTorch' framework using CNN and Transfer Learning with 38 classes of various plant leaves. The model was successfully able to detect diseased and healthy leaves of 14 unique plants. I was able to achieve an accuracy of 98% by using Resnet34 pretrained model."
                //ghLink="https://github.com/soumyajit4419/Plant_AI"
                demoLink="https://play.google.com/store/apps/details?id=com.surajit.flyingbasketball"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={prepareSurgery}
                isBlog={false}
                title="Prepare for Surgery"
                //   description="Using 'Natural Launguage Processing' for the detection of suicide-related posts and user's suicide ideation in cyberspace  and thus helping in sucide prevention."
                //ghLink="https://github.com/soumyajit4419/AI_For_Social_Good"
                demoLink="https://apps.apple.com/us/app/prepare-for-surgery/id1623560652"
            />
          </Col>

          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={ballMaster}
                isBlog={false}
                title="Ball Master!"
                //  description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/ball-master/id1615972868"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={finagle}
                isBlog={false}
                title="Finagle"
                //   description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://www.linkedin.com/feed/update/urn:li:activity:6982393763516018688/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={roadPlanner}
                isBlog={false}
                title="Road Planner"
                //   description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/road-planner/id1612267438"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={coupleMatch}
                isBlog={false}
                title="Couple Match 3D"
                //   description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/couple-match-3d/id1603422944"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={matchRun}
                isBlog={false}
                title="Match Run!"
                //    description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/match-run/id1597629769"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={stuntChaser}
                isBlog={false}
                title="Stunt Chaser"
                //   description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/stunt-chaser/id1580141976"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={skipIt}
                isBlog={false}
                title="Skip It 3D"
                //    description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/skip-it-3d/id1586519803"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={lostAlien}
                isBlog={false}
                title="Lost Alien"
                //description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://oguzhandelibas.itch.io/lost-alien"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={influenceIt}
                isBlog={false}
                title="Influence It!"
                //description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/influence-it/id1590837931"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={transformDragons}
                isBlog={false}
                title="Transform Dragons"
                // description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/transform-dragons/id1587031993"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={angryRagdoll}
                isBlog={false}
                title="Angry Ragdoll"
                //description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/angry-ragdolls/id1566367462"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={celebrityPeeker}
                isBlog={false}
                title="Celebrity Peeker"
                //description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/celebrity-peeker/id1568694384"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={escapeBoss}
                isBlog={false}
                title="Escape the Boss"
                //description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/escape-the-boss/id1568984743"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={houseGolf}
                isBlog={false}
                title="House Golf"
                //description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                //ghLink="https://github.com/soumyajit4419/Face_And_Emotion_Detection"
                demoLink="https://apps.apple.com/us/app/house-golf/id1570025175"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
                imgPath={ballThrow}
                isBlog={false}
                title="Ball Throw 3D"
                //description="Trained a CNN classifier using 'FER-2013 dataset' with Keras and tensorflow backened."
                ghLink="https://github.com/cihanturker-ux/BallThrow3D"
                //demoLink="https://apps.apple.com/us/app/house-golf/id1570025175"
            />
          </Col>
        </Row>
      </Container>
    
    </Container>
  );
}

export default Projects;
