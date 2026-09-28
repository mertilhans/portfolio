import React from "react";
import { Link } from "react-router-dom";

// Hero'nun sagindaki terminal penceresi: bash'ten 42 projesi minishell
// aciliyor, komutlar onun kendi prompt'unda ("MiniShell->>>   ", shell.c)
// yaziliyor. Icerik Home2'deki tanitimla ayni bilgilerin kisa bir ozeti.
const PROMPT = "MiniShell->>>";

function HeroTerminal() {
  return (
    <div className="hero-terminal" aria-label="Profile summary">
      <div className="hero-terminal-bar">
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <i aria-hidden="true" />
        <Link to="/project/minishell" title="minishell: a bash-like shell written in C">
          bash — ./minishell
        </Link>
      </div>
      <pre>
        <span className="t-dim">bash-5.2$</span> ./minishell{"\n"}
        <span className="t-prompt">{PROMPT}</span>{"   "}whoami{"\n"}
        <span className="t-dim">mert ilhan — software developer</span>
        {"\n"}
        <span className="t-prompt">{PROMPT}</span>{"   "}cat profile.json{"\n"}
        {"{\n  "}
        <span className="t-key">"school"</span>: <span className="t-str">"42 Kocaeli"</span>,{"\n  "}
        <span className="t-key">"focus"</span>: [<span className="t-str">"systems"</span>, <span className="t-str">"ai"</span>],{"\n  "}
        <span className="t-key">"languages"</span>: [<span className="t-str">"C"</span>, <span className="t-str">"C++"</span>, <span className="t-str">"Python"</span>],{"\n  "}
        <span className="t-key">"coding_since"</span>: <span className="t-str">2021</span>
        {"\n}\n"}
        <span className="t-prompt">{PROMPT}</span>{"   "}<span className="t-cursor" />
      </pre>
    </div>
  );
}

export default HeroTerminal;
