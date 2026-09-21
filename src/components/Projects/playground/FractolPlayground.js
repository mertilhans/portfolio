import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  WIDTH,
  HEIGHT,
  JULIA_SETS,
  ftAtod,
  startPoint,
  zoom,
  zoomBy,
  pan,
  renderRow,
} from "./fractolEngine";
import { useProgressiveRender, useCanvasControls } from "./canvasTools";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import PlaygroundFrame, { ControlButton } from "./PlaygroundFrame";

// On izleme 4x4 bloklarla, ardindan C programinin tam cozunurlugu.
const PASSES = [{ block: 4 }, { block: 1 }];

// double hassasiyetinin sinirina gelince (C surumunde de goruntu burada
// bozuluyor) daha fazla yakinlasmayi durdur.
const MIN_SPAN = 1e-13;

// Tiklama: imlecin altina 6 tekerlek tiki (0.9^6 ~ 0.53, yani ~2x), her
// karede bir tik; boylece yakinlasma animasyonlu gorunuyor.
const TAP_NOTCHES = 6;

const PAN_KEYS = new Set(["w", "a", "s", "d", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]);

function FractolPlayground() {
  const canvasRef = useRef(null);
  const view = useRef(startPoint());
  const [mode, setMode] = useState("Mandelbrot");
  const [setIndex, setSetIndex] = useState(0);
  const [progress, setProgress] = useState(null);
  const [span, setSpan] = useState(4);
  const draw = useProgressiveRender(canvasRef, WIDTH, HEIGHT);

  const julia =
    mode === "Julia"
      ? {
          re: ftAtod(JULIA_SETS[setIndex][0]),
          im: ftAtod(JULIA_SETS[setIndex][1]),
        }
      : null;
  const juliaRe = julia && julia.re;
  const juliaIm = julia && julia.im;

  const redraw = useCallback(() => {
    const current = view.current;
    const c = juliaRe === null ? null : { re: juliaRe, im: juliaIm };
    setSpan(current.maxRe - current.minRe);
    draw(PASSES, (y, pass, buf) => renderRow(current, c, y, pass.block, buf), setProgress);
  }, [draw, juliaRe, juliaIm]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  const apply = (next) => {
    const zoomingIn = next.maxRe - next.minRe < view.current.maxRe - view.current.minRe;
    if (zoomingIn && next.maxRe - next.minRe < MIN_SPAN) return;
    view.current = next;
    redraw();
  };

  // Suren tiklama animasyonu; yeni bir tiklama ya da tekerlek onu keser.
  const animation = useRef(0);
  useEffect(() => () => cancelAnimationFrame(animation.current), []);

  const zoomAnimated = (button, x, y) => {
    cancelAnimationFrame(animation.current);
    let left = TAP_NOTCHES;
    const step = () => {
      apply(zoom(view.current, button, x, y));
      left -= 1;
      if (left > 0) animation.current = requestAnimationFrame(step);
    };
    step();
  };

  useCanvasControls(canvasRef, WIDTH, HEIGHT, {
    // Tiklama web'e ozgu: C'de sol tik (dugme 1) zoom()'da hicbir sey yapmiyor.
    onTap: (x, y, back) => zoomAnimated(back ? 5 : 4, x, y),
    // Her tik C'deki bir mlx fare olayi: 4 = 0.9x, 5 = 1.1x, imlecin altinda.
    onWheel: (notches, x, y) => {
      cancelAnimationFrame(animation.current);
      let next = view.current;
      const button = notches < 0 ? 4 : 5;
      for (let i = 0; i < Math.abs(notches); i++) next = zoom(next, button, x, y);
      apply(next);
    },
    onPinch: (factor, x, y) => {
      const v = view.current;
      const re = v.minRe + ((v.maxRe - v.minRe) * x) / WIDTH;
      const im = v.minIm + ((v.maxIm - v.minIm) * y) / HEIGHT;
      apply(zoomBy(v, factor, re, im));
    },
    // Surukleyerek kaydirma web'e ozgu; C surumunde yalnizca klavye var.
    onDrag: (dx, dy) => {
      const v = view.current;
      const re = (dx * (v.maxRe - v.minRe)) / WIDTH;
      const im = (dy * (v.maxIm - v.minIm)) / HEIGHT;
      apply({ minRe: v.minRe - re, maxRe: v.maxRe - re, minIm: v.minIm - im, maxIm: v.maxIm - im });
    },
    onKey: (key) => {
      const k = key.length === 1 ? key.toLowerCase() : key;
      if (PAN_KEYS.has(k)) {
        apply(pan(view.current, k));
        return true;
      }
      if (k === "+" || k === "=") {
        apply(zoom(view.current, 4, WIDTH / 2, HEIGHT / 2));
        return true;
      }
      if (k === "-") {
        apply(zoom(view.current, 5, WIDTH / 2, HEIGHT / 2));
        return true;
      }
      return false;
    },
  });

  const reset = () => {
    view.current = startPoint();
    redraw();
  };

  const switchTo = (next, index = setIndex) => {
    view.current = startPoint();
    // Ayni kumeye tekrar basildiysa state degismez; gorunumu elle sifirla.
    if (next === mode && index === setIndex) redraw();
    setMode(next);
    setSetIndex(index);
  };

  const status = !progress
    ? "Starting…"
    : progress.done
    ? `Rendered ${WIDTH}×${HEIGHT} in ${Math.round(progress.ms)} ms`
    : progress.final
    ? `Rendering ${progress.percent}%`
    : "Preview…";

  return (
    <PlaygroundFrame
      title="Try it"
      intro={
        <>
          The C source from the repository, ported function by function to
          JavaScript: the same escape time loop, the same{" "}
          <code>iter * 0xFFFFFF / MAX_ITER</code> colouring (32-bit overflow
          included, which is where the colour bands come from) and the same{" "}
          <code>0.9×</code> / <code>1.1×</code> zoom around the cursor. Only
          the MiniLibX window is replaced by a canvas.
        </>
      }
      controls={
        <>
          <div className="playground-segment" role="group" aria-label="Fractal">
            {["Mandelbrot", "Julia"].map((name) => (
              <button
                key={name}
                type="button"
                className={mode === name ? "active" : ""}
                aria-pressed={mode === name}
                onClick={() => switchTo(name)}
              >
                {name}
              </button>
            ))}
          </div>
          {mode === "Julia" && (
            <div className="playground-chips" role="group" aria-label="Julia set">
              {JULIA_SETS.map(([re, im], index) => (
                <button
                  key={re + im}
                  type="button"
                  className={index === setIndex ? "active" : ""}
                  aria-pressed={index === setIndex}
                  onClick={() => switchTo("Julia", index)}
                  title={`./fractol Julia ${re} ${im}`}
                >
                  {re}, {im}
                </button>
              ))}
            </div>
          )}
          <div className="playground-buttons">
            <ControlButton label="Zoom in" onClick={() => apply(zoom(view.current, 4, WIDTH / 2, HEIGHT / 2))}><AiOutlinePlus /></ControlButton>
            <ControlButton label="Zoom out" onClick={() => apply(zoom(view.current, 5, WIDTH / 2, HEIGHT / 2))}><AiOutlineMinus /></ControlButton>
            <ControlButton label="Reset view" onClick={reset} wide>Reset</ControlButton>
          </div>
        </>
      }
      canvas={
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          tabIndex={0}
          className="playground-canvas playground-canvas-square"
          aria-label={`${mode} set. Click or scroll to zoom in, Shift+click to zoom out, drag or use W A S D and the arrow keys to move.`}
        />
      }
      command={
        mode === "Julia"
          ? `./fractol Julia ${JULIA_SETS[setIndex][0]} ${JULIA_SETS[setIndex][1]}`
          : "./fractol Mandelbrot"
      }
      hint="Click to zoom in · Shift+click or right click to zoom out · scroll or pinch · drag, WASD or arrows to move"
      status={`${status} · zoom ×${formatZoom(4 / span)}`}
    />
  );
}

function formatZoom(z) {
  if (z < 1000) return z.toFixed(z < 10 ? 1 : 0);
  return z.toExponential(1).replace("e+", "e");
}

export default FractolPlayground;
