import React, { Suspense, useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import { Link, useParams, Navigate } from "react-router-dom";
import { AiFillGithub, AiFillStar, AiOutlineArrowLeft } from "react-icons/ai";
import { BiGitRepoForked } from "react-icons/bi";
import { CgWebsite } from "react-icons/cg";
import Particle from "../Particle";
import projects from "./projectData";
import { fetchStats, GITHUB_USER } from "./githubStats";
import techIcon from "./techIcons";
import playgrounds from "./playground";

/*
  README'yi ham markdown olarak cekip elde ayristirmak yerine GitHub'in
  kendi render ciktisini istiyoruz (Accept: application/vnd.github.html).
  Boylece ek bir markdown kutuphanesi gerekmiyor, gorsel yollari mutlak
  URL'e cevrilmis halde geliyor ve cikti GitHub tarafinda temizleniyor
  (script etiketleri siyriliyor). Icerik kullanicinin kendi deposundan.
*/
function useReadme(repo) {
  /*
    durum:
      "loading" — istek suruyor
      "ready"   — README geldi
      "none"    — depoda README yok (404) ya da icerigi bos
      "error"   — istek basarisiz (saatlik limit, ag hatasi)

    "none" ile "error" ayri tutuluyor: limit dolduğunda README'si olan bir
    depo icin "bu deponun README'si yok" demek dogru olmaz.
  */
  const [state, setState] = useState({ status: "loading", html: null });

  useEffect(() => {
    let cancelled = false;

    // Deposu olmayan proje: istek atmadan elle yazilan icerige dus.
    if (!repo) {
      setState({ status: "none", html: null });
      return undefined;
    }

    setState({ status: "loading", html: null });

    fetch(`https://api.github.com/repos/${GITHUB_USER}/${repo}/readme`, {
      headers: { Accept: "application/vnd.github.html" },
    })
      .then((res) => {
        if (res.ok) return res.text();
        // 404 disindaki her sey gecici bir aksaklik sayilir.
        return Promise.reject(res.status === 404 ? "none" : "error");
      })
      .then((html) => {
        if (cancelled) return;
        // Bos README'si olan depolar da var; onlari yokmus gibi ele al.
        const hasText = html && html.replace(/<[^>]*>/g, "").trim().length > 0;
        setState(
          hasText ? { status: "ready", html } : { status: "none", html: null }
        );
      })
      .catch((reason) => {
        if (!cancelled) {
          setState({
            status: reason === "none" ? "none" : "error",
            html: null,
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [repo]);

  return state;
}

function ProjectDetail() {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  const [stats, setStats] = useState(null);
  const readme = useReadme(project && project.repo);

  useEffect(() => {
    if (!project || !project.repo) return;
    let cancelled = false;

    // Liste sayfasiyla ayni onbellegi kullanir; cogu durumda ek istek yok.
    fetchStats()
      .then((all) => {
        if (!cancelled) setStats(all[project.repo] || null);
      })
      .catch(() => {
        /* rozetsiz devam */
      });

    return () => {
      cancelled = true;
    };
  }, [project]);

  // Bilinmeyen bir depo adi adres cubuguna yazilirsa liste sayfasina don.
  if (!project) return <Navigate to="/project" replace />;

  const Icon = project.icon;
  const Playground = project.playground && playgrounds[project.playground];

  return (
    <Container fluid className="project-section project-detail-section">
      <Particle />
      <Container>
        <Link to="/project" className="project-back">
          <AiOutlineArrowLeft /> &nbsp;All projects
        </Link>

        <div
          className="project-detail-hero"
          style={{
            background: `radial-gradient(circle at 18% 25%, ${project.accent}33, transparent 62%), linear-gradient(135deg, #1d1229 0%, #2a1739 100%)`,
          }}
        >
          <Icon style={{ color: project.accent }} className="project-detail-icon" />
          <div className="project-detail-heading">
            <h1>
              {project.title}
              {project.status && (
                <span className="project-status">{project.status}</span>
              )}
            </h1>
            <p>{project.description}</p>

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
              </div>
            )}

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
              {project.repo && (
                <Button
                  variant="primary"
                  href={`https://github.com/${GITHUB_USER}/${project.repo}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <AiFillGithub /> &nbsp; View source
                </Button>
              )}
              {project.demo && (
                <Button
                  variant="primary"
                  href={project.demo}
                  target="_blank"
                  rel="noreferrer"
                >
                  <CgWebsite /> &nbsp; Live site
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tarayicida calisan surum: C kodunun JavaScript karsiligi. */}
        {Playground && (
          <Suspense fallback={<p className="project-readme-note">Loading demo…</p>}>
            <Playground key={project.id} />
          </Suspense>
        )}

        {/* "Built with": yalnizca stack tanimlanmis projelerde cikar. */}
        {project.stack && (
          <div className="project-stack">
            <h2 className="project-stack-heading">Built with</h2>
            <div className="project-stack-grid">
              {project.stack.map((item) => {
                const ItemIcon = techIcon(item.name);
                return (
                  <div className="project-stack-item" key={item.name}>
                    <div className="project-stack-name">
                      {ItemIcon ? (
                        <ItemIcon style={{ color: project.accent }} />
                      ) : (
                        <i
                          className="project-lang-dot"
                          style={{ backgroundColor: project.accent }}
                        />
                      )}
                      {item.name}
                      {item.version && (
                        <span className="project-stack-version">
                          {item.version}
                        </span>
                      )}
                    </div>
                    <p className="project-stack-role">{item.role}</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {readme.status === "loading" && (
          <p className="project-readme-note">Loading README…</p>
        )}

        {readme.status === "ready" && (
          <div className="project-readme">
            <div className="project-readme-source">
              Rendered from the repository's README
            </div>
            <div dangerouslySetInnerHTML={{ __html: readme.html }} />
          </div>
        )}

        {(readme.status === "none" || readme.status === "error") && (
          <div className="project-readme project-readme-written">
            {/* Istek basarisiz olduysa bunu soyle: README'si olan bir depo
                icin "README yok" demek yanlis olur. */}
            {readme.status === "error" && project.overview && (
              <div className="project-readme-source">
                GitHub could not be reached — showing a written summary
              </div>
            )}

            {project.overview && (
              <p className="project-overview">{project.overview}</p>
            )}

            {project.highlights &&
              project.highlights.map((item) => (
                <div className="project-highlight" key={item.title}>
                  <h2>{item.title}</h2>
                  <p>{item.body}</p>
                </div>
              ))}

            {!project.overview && (
              <p className="project-readme-note">
                {readme.status === "error"
                  ? "The README could not be loaded right now. You can read it on GitHub."
                  : "This repository has no README yet. The source is on GitHub."}
              </p>
            )}
          </div>
        )}
      </Container>
    </Container>
  );
}

export default ProjectDetail;
