import React from "react";
import { AiFillTrophy } from "react-icons/ai";
import { podium2026, alsoTopTen2026, history, sources } from "./wuriData";

// Podyum sirasi: 2. solda, 1. ortada, 3. sagda — klasik kursu dizilimi.
const PODIUM_ORDER = [2, 1, 3];

function WuriRanking() {
  const byRank = (rank) => podium2026.find((entry) => entry.rank === rank);

  return (
    <div className="wuri">
      <div className="wuri-intro">
        <p className="wuri-kicker">Where I learn</p>
        <h2>
          <span className="purple">42 Kocaeli</span> — part of the 42 network
        </h2>
        <p className="wuri-lead">
          In the WURI ranking (World's Universities with Real Impact), 42 was
          named the 3rd most innovative institution in the world in 2025, and
          again in 2026.
        </p>
      </div>

      <div className="wuri-podium" aria-label="WURI 2026 top three">
        {PODIUM_ORDER.map((rank) => {
          const entry = byRank(rank);
          return (
            <div
              key={rank}
              className={`wuri-step wuri-step-${rank}${
                entry.highlight ? " wuri-step-highlight" : ""
              }`}
            >
              <div className="wuri-step-label">
                {rank === 1 && <AiFillTrophy className="wuri-trophy" />}
                <span className="wuri-name">{entry.name}</span>
                <span className="wuri-country">{entry.country}</span>
              </div>
              <div className="wuri-block">
                <span className="wuri-rank">{rank}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="wuri-rest">
        <p className="wuri-rest-label">
          Also in the 2026 top 10 — all ranked behind 42
        </p>
        {/* Sira numarasi kaynaklarda yok; yerine "Top 10" rozeti. */}
        <div className="wuri-board">
          {alsoTopTen2026.map((school) => (
            <div className="wuri-row" key={school.name}>
              <span className="wuri-mono">{school.short}</span>
              <div className="wuri-row-text">
                <span className="wuri-row-name">{school.name}</span>
                <span className="wuri-row-country">{school.country}</span>
              </div>
              <span className="wuri-row-tag">Top 10</span>
            </div>
          ))}
        </div>
      </div>

      <div className="wuri-history">
        {history.map((item) => (
          <div className="wuri-year" key={item.year}>
            <span className="wuri-year-num">{item.year}</span>
            <span className="wuri-year-rank">#{item.rank} worldwide</span>
            <span className="wuri-year-note">{item.note}</span>
          </div>
        ))}
      </div>

      <div className="wuri-sources">
        <span>Sources:</span>
        {sources.map((source) => (
          <a
            key={source.url}
            href={source.url}
            target="_blank"
            rel="noreferrer"
          >
            {source.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default WuriRanking;
