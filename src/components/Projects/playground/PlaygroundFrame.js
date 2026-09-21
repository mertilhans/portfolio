import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Iki oyun alaninin ortak cercevesi: baslik, aciklama, kontroller, canvas, durum.
function PlaygroundFrame({ title, intro, controls, canvas, command, hint, status, extra }) {
  const ref = useRef(null);
  const { hash } = useLocation();

  // Projeler vitrininden "#try" ile gelindiyse dogrudan demoya in.
  // Bilesen gec yuklendigi (lazy) icin kaydirma burada, yuklenince yapiliyor.
  useEffect(() => {
    if (hash === "#try" && ref.current) ref.current.scrollIntoView({ block: "start" });
  }, [hash]);

  return (
    <section className="playground" id="try" ref={ref}>
      <div className="playground-head">
        <h2 className="playground-title">
          <span className="playground-live" aria-hidden="true" />
          {title}
        </h2>
        <p className="playground-intro">{intro}</p>
      </div>

      <div className="playground-controls">{controls}</div>

      <div className="playground-stage">
        <div className="playground-terminal" aria-hidden="true">
          <span className="playground-prompt">$</span> {command}
        </div>
        {canvas}
      </div>

      <div className="playground-footer">
        <span className="playground-hint">{hint}</span>
        <span className="playground-status">
          {status}
        </span>
      </div>

      {extra}
    </section>
  );
}

export function ControlButton({ label, onClick, children, wide }) {
  return (
    <button
      type="button"
      className={wide ? "playground-button wide" : "playground-button"}
      onClick={onClick}
      aria-label={label}
      title={label}
    >
      {children}
    </button>
  );
}

export default PlaygroundFrame;
