import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import FractalLayer from "./FractalLayer";

/*
  Sitenin sakin arka plani ve kucuk etkilesimleri. Hepsi CSS; JS yalnizca
  birkac degisken guncelliyor:

  - Arka plan: nokta izgarasi, ustten gelen ve yavasca nefes alan tek
    renkli isik, imleci takip eden hafif bir spot (--mx / --my). Arada bir
    izgara cizgileri boyunca ince isik darbeleri kayiyor.
  - Fener: imlecin cevresinde, arka planin altina cizilmis fract-ol
    Mandelbrot kumesi ortaya cikiyor (FractalLayer.js).
  - Kart isigi: imlec bir kartin uzerindeyken o karta imlecin yerini
    veriyor (--sx / --sy); kenardaki mavi isik oradan yaniyor.
  - Belirme: ana bloklar ekrana girince yumusakca beliriyor. Sayfa
    degisince ve icerik sonradan yuklenince yeni bloklar da yakalaniyor.

  prefers-reduced-motion aciksa spot ve belirme devre disi.
*/

const CARD_SELECTOR = [
  ".project-card-view",
  ".blog-card-view",
  ".certification-card",
  ".book-card",
  ".live-demo-card",
  ".wuri-row",
  ".tech-icons",
  ".chat-card",
].join(",");

const REVEAL_SELECTOR = [
  ".home-about-description",
  ".home-about-social",
  ".myAvtar",
  ".project-heading",
  ".project-card",
  ".blog-card",
  ".certification-col",
  ".book-col",
  ".live-demos",
  ".project-detail-hero",
  ".project-readme",
  ".project-stack",
  ".playground",
  ".quote-wall",
  ".chatbot",
  ".wuri",
  ".tech-icons",
  ".about-img",
].join(",");

function Backdrop() {
  const rootRef = useRef(null);
  const { pathname } = useLocation();
  const observerRef = useRef(null);

  // Arka plan spotu ve kart isigi: tek bir pointermove dinleyicisi.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastEvent = null;

    const apply = () => {
      raf = 0;
      const e = lastEvent;
      if (!e) return;
      if (!reduced && rootRef.current) {
        rootRef.current.style.setProperty("--mx", `${e.clientX}px`);
        rootRef.current.style.setProperty("--my", `${e.clientY}px`);
      }
      const card = e.target instanceof Element ? e.target.closest(CARD_SELECTOR) : null;
      if (card) {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--sx", `${e.clientX - r.left}px`);
        card.style.setProperty("--sy", `${e.clientY - r.top}px`);
      }
    };

    const onMove = (e) => {
      lastEvent = e;
      if (!raf) raf = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Belirme animasyonu.
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) return undefined;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    observerRef.current = io;

    const scan = () => {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((el) => {
        if (el.classList.contains("reveal")) return;
        el.classList.add("reveal");
        // Ayni satirdaki kardesler sirayla beliriyor.
        const siblings = el.parentElement ? Array.from(el.parentElement.children) : [];
        const index = Math.max(0, siblings.indexOf(el));
        el.style.setProperty("--reveal-delay", `${Math.min(index, 5) * 70}ms`);
        io.observe(el);
      });
    };

    document.documentElement.classList.add("reveal-ready");
    scan();

    // Veri sonradan gelen sayfalar (GitHub istatistikleri, README) icin.
    let pending = 0;
    const mo = new MutationObserver(() => {
      if (pending) return;
      pending = requestAnimationFrame(() => {
        pending = 0;
        scan();
      });
    });
    const root = document.getElementById("root");
    if (root) mo.observe(root, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(pending);
      document.documentElement.classList.remove("reveal-ready");
    };
  }, []);

  // Ana sayfada ustteki isik daha belirgin, diger sayfalarda kisik.
  useEffect(() => {
    if (rootRef.current) {
      rootRef.current.style.setProperty("--glow-opacity", pathname === "/" ? "1" : "0.6");
    }
  }, [pathname]);

  return (
    <div className="backdrop" ref={rootRef} aria-hidden="true">
      <div className="backdrop-glow" style={{ opacity: "var(--glow-opacity, 1)" }} />
      <div className="backdrop-grid" />
      <FractalLayer />
      <div className="backdrop-beams">
        <span className="beam beam-v" style={{ "--col": 9, "--delay": "1s", "--dur": "11s" }} />
        <span className="beam beam-v" style={{ "--col": 38, "--delay": "5.5s", "--dur": "13s" }} />
        <span className="beam beam-h" style={{ "--row": 6, "--delay": "3s", "--dur": "12s" }} />
        <span className="beam beam-h" style={{ "--row": 15, "--delay": "8.5s", "--dur": "14s" }} />
      </div>
      <div className="backdrop-spot" />
      <div className="backdrop-noise" />
    </div>
  );
}

export default Backdrop;
