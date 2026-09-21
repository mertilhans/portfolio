import React from "react";
import { Row, Col } from "react-bootstrap";
import { AiOutlineSafetyCertificate } from "react-icons/ai";
import certifications from "./certificationData";

function Certifications() {
  if (certifications.length === 0) return null;

  return (
    <>
      <h1 className="project-heading certifications-heading">
        <strong className="purple">Certifications</strong>
      </h1>

      <Row style={{ justifyContent: "center", paddingBottom: "40px" }}>
        {certifications.map((cert) => {
          const body = (
            <div className="certification-card">
              <AiOutlineSafetyCertificate className="certification-icon" />
              <div className="certification-body">
                <h3>{cert.title}</h3>
                <p className="certification-meta">
                  {cert.issuer}
                  {cert.year && <span> · {cert.year}</span>}
                </p>
                <div className="project-tags">
                  {cert.skills.map((skill) => (
                    <span className="project-tag" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );

          return (
            <Col md={4} className="certification-col" key={cert.id}>
              {/* Dogrulama linki verilmisse kart tiklanabilir olur. */}
              {cert.credential ? (
                <a
                  href={cert.credential}
                  target="_blank"
                  rel="noreferrer"
                  className="certification-link"
                >
                  {body}
                </a>
              ) : (
                body
              )}
            </Col>
          );
        })}
      </Row>
    </>
  );
}

export default Certifications;
