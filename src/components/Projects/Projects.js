import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Particle from "../Particle";
import ProjectCard from "./ProjectCard";
import projects, { categories } from "./projectData";
import { fetchStats, readCache } from "./githubStats";
import Certifications from "./Certifications";
import LiveDemos from "./LiveDemos";

function Projects() {
  const [active, setActive] = useState("all");
  const [stats, setStats] = useState(() => readCache() || {});

  useEffect(() => {
    let cancelled = false;

    fetchStats()
      .then((data) => {
        if (!cancelled) setStats(data);
      })
      .catch(() => {
        /* API kapali veya limit doldu: kartlar rozetsiz gosterilir */
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const visible = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.category === active),
    [active]
  );

  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          My Recent <strong className="purple">Works</strong>
        </h1>
        <p style={{ color: "white" }}>
          Here are a few projects I've worked on recently.
        </p>

        <LiveDemos />

        <div className="project-filter">
          {/* Icinde proje kalmayan kategori hic gosterilmiyor; liste
              projectData'dan turedigi icin yeni proje eklenince ilgili
              buton kendiliginden geri gelir. */}
          {categories
            .map((category) => ({
              ...category,
              count:
                category.id === "all"
                  ? projects.length
                  : projects.filter((p) => p.category === category.id).length,
            }))
            .filter((category) => category.count > 0)
            .map((category) => {
            return (
              <button
                key={category.id}
                type="button"
                className={
                  active === category.id
                    ? "project-filter-btn active"
                    : "project-filter-btn"
                }
                onClick={() => setActive(category.id)}
              >
                {category.label}
                <span className="project-filter-count">{category.count}</span>
              </button>
            );
          })}
        </div>

        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          {visible.map((project) => (
            <Col md={4} className="project-card" key={project.id}>
              <ProjectCard project={project} stats={project.repo ? stats[project.repo] : null} />
            </Col>
          ))}
        </Row>

        <Certifications />
      </Container>
    </Container>
  );
}

export default Projects;
