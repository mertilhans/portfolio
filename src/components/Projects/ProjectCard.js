import React from "react";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { AiFillGithub, AiFillStar } from "react-icons/ai";
import { CgWebsite } from "react-icons/cg";
import { BiGitRepoForked } from "react-icons/bi";
import techIcon from "./techIcons";

// Depo adindan GitHub adresini kurar; projectData icindeki "repo" alani
// GitHub'daki ad ile birebir ayni oldugu icin baska bir esleme gerekmiyor.
const repoUrl = (repo) => `https://github.com/mertilhans/${repo}`;

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

function ProjectCard({ project, stats }) {
  const Icon = project.icon;

  return (
    <Card className="project-card-view">
      <Link to={`/project/${project.id}`} className="project-cover-link">
        <div
          className="project-cover"
          style={{
            background: `radial-gradient(circle at 30% 20%, ${project.accent}40, transparent 60%), linear-gradient(135deg, #1d1229 0%, #2a1739 100%)`,
          }}
        >
          <Icon style={{ color: project.accent }} />
        </div>
      </Link>

      <Card.Body>
        <Card.Title className="project-title">
          <Link to={`/project/${project.id}`} className="project-title-link">
            {project.title}
          </Link>
          {project.status && (
            <span className="project-status">{project.status}</span>
          )}
        </Card.Title>

        {/* Canli rozetler: API cevap vermezse stats undefined kalir ve
            bu satir hic basilmaz, kartin geri kalani calismaya devam eder. */}
        {stats && (
          <div className="project-stats">
            {stats.language &&
              (() => {
                const LangIcon = techIcon(stats.language);
                return (
                  <span className="project-stat">
                    {LangIcon ? (
                      <LangIcon style={{ color: project.accent }} />
                    ) : (
                      <i
                        className="project-lang-dot"
                        style={{ backgroundColor: project.accent }}
                      />
                    )}
                    {stats.language}
                  </span>
                );
              })()}
            {stats.stars > 0 && (
              <span className="project-stat">
                <AiFillStar /> {stats.stars}
              </span>
            )}
            {stats.forks > 0 && (
              <span className="project-stat">
                <BiGitRepoForked /> {stats.forks}
              </span>
            )}
            {stats.updatedAt && (
              <span className="project-stat">
                Updated {formatDate(stats.updatedAt)}
              </span>
            )}
          </div>
        )}

        <Card.Text className="project-description">
          {project.description}
        </Card.Text>

        <div className="project-tags">
          {project.tags.map((tag) => {
            const TagIcon = techIcon(tag);
            return (
              <span className="project-tag" key={tag}>
                {TagIcon && <TagIcon className="project-tag-icon" />}
                {tag}
              </span>
            );
          })}
        </div>

        <div className="project-actions">
          <Button variant="primary" as={Link} to={`/project/${project.id}`}>
            Details
          </Button>

          {/* Deposu olmayan projelerde GitHub butonu hic basilmaz. */}
          {project.repo && (
            <Button
              variant="primary"
              href={repoUrl(project.repo)}
              target="_blank"
              rel="noreferrer"
            >
              <AiFillGithub /> &nbsp; GitHub
            </Button>
          )}

          {project.demo && (
            <Button
              variant="primary"
              href={project.demo}
              target="_blank"
              rel="noreferrer"
            >
              <CgWebsite /> &nbsp; Live
            </Button>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

export default ProjectCard;
