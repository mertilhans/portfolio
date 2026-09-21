import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  AiOutlineSend,
  AiOutlineRobot,
  AiOutlineReload,
} from "react-icons/ai";
import { createChat, suggestions } from "./chat/engine";
import projects from "../Projects/projectData";

const GREETING = {
  from: "bot",
  text:
    "Ask me about any project on this site, the books on the shelf, or 42 itself. I search everything published here, remember what we just talked about, and tell you when I don't know.",
  followUps: suggestions,
};

const byId = new Map(projects.map((project) => [project.id, project]));

/*
  Cevap aninda hazir, ama aninda basilan bir cevap okunmadan kayip
  gidiyor. Metin uzunluguyla orantili kisa bir "yaziyor" araligi, cevabin
  geldigini fark ettiriyor. Hareketi azaltmayi secmis kullanicida bekleme
  yok.
*/
function typingDelay(text) {
  const reduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return 0;
  return Math.min(1100, Math.max(350, 250 + text.length * 3));
}

function ProjectChip({ card }) {
  const project = byId.get(card.projectId);
  if (!project) return null;
  const Icon = project.icon;

  return (
    <Link to={`/project/${project.id}`} className="chat-card">
      <span
        className="chat-card-icon"
        style={{ color: project.accent, borderColor: `${project.accent}66` }}
      >
        <Icon />
      </span>
      <span className="chat-card-text">
        <span className="chat-card-title">{project.title}</span>
        <span className="chat-card-note">
          {card.note || project.tags.slice(0, 3).join(" · ")}
        </span>
      </span>
    </Link>
  );
}

function Chatbot() {
  const chatRef = useRef(null);
  if (chatRef.current === null) chatRef.current = createChat();

  const [messages, setMessages] = useState([GREETING]);
  const [draft, setDraft] = useState("");
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);
  const timerRef = useRef(null);

  // Yalnizca mesaj kutusu kayiyor, sayfanin kendisi degil.
  useEffect(() => {
    const log = logRef.current;
    if (log && messages.length > 1) log.scrollTop = log.scrollHeight;
  }, [messages, typing]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const send = (text) => {
    const question = text.trim();
    if (!question || typing) return;

    const reply = chatRef.current.ask(question);
    setMessages((prev) => [...prev, { from: "user", text: question }]);
    setDraft("");
    setTyping(true);

    timerRef.current = setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { from: "bot", ...reply }]);
    }, typingDelay(reply.text));
  };

  const reset = () => {
    clearTimeout(timerRef.current);
    chatRef.current.reset();
    setTyping(false);
    setDraft("");
    setMessages([GREETING]);
  };

  // Oneriler son bot mesajindan geliyor: sohbetin gidisine gore degisiyor.
  const lastBot = [...messages].reverse().find((m) => m.from === "bot");
  const followUps = (lastBot && lastBot.followUps) || suggestions;

  return (
    <div className="chatbot">
      <div className="chatbot-header">
        <AiOutlineRobot />
        <div className="chatbot-header-text">
          <h3>Ask this site</h3>
          <p>Searches everything published here — no API, nothing made up.</p>
        </div>
        {messages.length > 1 && (
          <button
            type="button"
            className="chatbot-reset"
            onClick={reset}
            aria-label="Start a new conversation"
            title="Start over"
          >
            <AiOutlineReload />
          </button>
        )}
      </div>

      <div className="chatbot-log" ref={logRef} aria-live="polite">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              message.from === "user"
                ? "chat-message chat-user"
                : "chat-message chat-bot"
            }
          >
            <p>{message.text}</p>

            {message.cards && message.cards.length > 0 && (
              <div className="chat-cards">
                {message.cards.map((card) => (
                  <ProjectChip key={card.projectId} card={card} />
                ))}
                {message.more > 0 && (
                  <Link to="/project" className="chat-more">
                    +{message.more} more on the projects page →
                  </Link>
                )}
              </div>
            )}

            {message.link && (
              <Link to={message.link.to} className="chat-link">
                {message.link.label} →
              </Link>
            )}
          </div>
        ))}

        {typing && (
          <div className="chat-message chat-bot chat-typing" aria-label="Typing">
            <span />
            <span />
            <span />
          </div>
        )}
      </div>

      <div className="chatbot-suggestions">
        {followUps.map((item) => (
          <button
            key={item}
            type="button"
            className="chat-suggestion"
            onClick={() => send(item)}
            disabled={typing}
          >
            {item}
          </button>
        ))}
      </div>

      <form
        className="chatbot-input"
        onSubmit={(event) => {
          event.preventDefault();
          send(draft);
        }}
      >
        <input
          type="text"
          value={draft}
          placeholder="Ask about a project, a book, 42…"
          aria-label="Ask a question"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" aria-label="Send" disabled={typing || !draft.trim()}>
          <AiOutlineSend />
        </button>
      </form>
    </div>
  );
}

export default Chatbot;
