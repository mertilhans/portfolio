import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ImQuotesLeft } from "react-icons/im";
import { BsBookHalf } from "react-icons/bs";
import Particle from "../Particle";
import Chatbot from "./Chatbot";
import WuriRanking from "./WuriRanking";
import { books, quotes } from "./readingData";
import projects from "../Projects/projectData";

const SHELVES = [
  { id: "read", label: "Finished" },
  { id: "reading", label: "Currently reading" },
  { id: "next", label: "On the list" },
];

// usedIn alanindaki proje id'lerini gercek projelere cevirir; veri
// dosyasinda olmayan bir id sessizce atlanir.
function linkedProjects(ids) {
  return ids
    .map((id) => projects.find((project) => project.id === id))
    .filter(Boolean);
}

/*
  Secici butonlarinda soyleyenin adi yetmiyor: ayni kisiden iki alinti
  olunca ("Design Patterns", "Brian Kernighan") butonlar ayirt
  edilemiyordu. Alintinin ilk birkac kelimesi hem benzersiz hem de
  tiklamadan once ne okunacagini soyluyor.
*/
function opening(text, words = 4) {
  const parts = text.split(" ");
  return parts.length > words
    ? `${parts.slice(0, words).join(" ")}…`
    : text;
}

function Blogs() {
  const [openQuote, setOpenQuote] = useState(0);

  return (
    <Container fluid className="project-section blogs-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          Notes &amp; <strong className="purple">Reading</strong>
        </h1>
        <p style={{ color: "white" }}>
          The books behind the projects, the lines worth keeping, and something
          to ask.
        </p>

        {/* ── Alinti duvari ── */}
        <div className="quote-wall">
          <div className="quote-feature">
            <ImQuotesLeft className="quote-mark" />
            <blockquote>{quotes[openQuote].text}</blockquote>
            <div className="quote-credit">
              <span className="purple">{quotes[openQuote].attribution}</span>
              <span className="quote-source">{quotes[openQuote].source}</span>
            </div>
            {quotes[openQuote].note && (
              <p className="quote-note">{quotes[openQuote].note}</p>
            )}
          </div>

          <div className="quote-picker">
            {quotes.map((quote, index) => (
              <button
                key={quote.text}
                type="button"
                className={
                  index === openQuote
                    ? "quote-chip active"
                    : "quote-chip"
                }
                onClick={() => setOpenQuote(index)}
                title={quote.attribution}
              >
                {opening(quote.text)}
              </button>
            ))}
          </div>
        </div>

        {/* ── Kitaplik ── */}
        <h1 className="project-heading blogs-subheading">
          The <strong className="purple">Shelf</strong>
        </h1>

        {SHELVES.map((shelf) => {
          const shelfBooks = books.filter((book) => book.status === shelf.id);
          if (shelfBooks.length === 0) return null;

          return (
            <div className="shelf" key={shelf.id}>
              <h2 className="shelf-label">
                {shelf.label}
                <span className="shelf-count">{shelfBooks.length}</span>
              </h2>

              <Row style={{ justifyContent: "center" }}>
                {shelfBooks.map((book) => (
                  <Col md={6} lg={4} className="book-col" key={book.id}>
                    <div className={`book-card book-${book.status}`}>
                      <div className="book-spine" />
                      <div className="book-body">
                        <div className="book-head">
                          <BsBookHalf className="book-icon" />
                          <div>
                            <h3>{book.title}</h3>
                            {book.subtitle && (
                              <p className="book-subtitle">{book.subtitle}</p>
                            )}
                            <p className="book-authors">
                              {book.authors} · {book.year}
                            </p>
                          </div>
                        </div>

                        <p className="book-takeaway">{book.takeaway}</p>

                        <div className="project-tags">
                          {book.topics.map((topic) => (
                            <span className="project-tag" key={topic}>
                              {topic}
                            </span>
                          ))}
                        </div>

                        {/* Kitabi gercekten kullandigi projelere baglar. */}
                        {linkedProjects(book.usedIn).length > 0 && (
                          <div className="book-used">
                            <span className="book-used-label">Used in</span>
                            {linkedProjects(book.usedIn).map((project) => (
                              <Link
                                key={project.id}
                                to={`/project/${project.id}`}
                                className="book-used-link"
                              >
                                {project.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>
          );
        })}

        {/* ── Okul ve WURI siralamasi ── */}
        <h1 className="project-heading blogs-subheading">
          The <strong className="purple">School</strong>
        </h1>
        <WuriRanking />

        {/* ── Chatbot ── */}
        <h1 className="project-heading blogs-subheading">
          Ask <strong className="purple">Anything</strong>
        </h1>
        <Row style={{ justifyContent: "center" }}>
          <Col lg={9}>
            <Chatbot />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Blogs;
