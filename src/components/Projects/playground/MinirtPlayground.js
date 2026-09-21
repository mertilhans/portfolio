import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  WIDTH,
  HEIGHT,
  SAMPLES,
  parseScene,
  prepare,
  renderRow,
  findPivot,
  orbit,
  dolly,
  pickPoint,
  focusOn,
} from "./minirtEngine";
import scenes from "./scenes";
import { useProgressiveRender, useCanvasControls } from "./canvasTools";
import { useWorkerRender } from "./useWorkerRender";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import PlaygroundFrame, { ControlButton } from "./PlaygroundFrame";

/*
  Uc gecis: 4x4 blok tek isin, 2x2 blok tek isin, sonra C programinin
  kendisi gibi piksel basina 2x2 ornek. Surukleme sirasinda yalnizca ilk
  gecis yetisiyor, birakinca tam kaliteye tamamlaniyor.
*/
const PASSES = [
  { block: 4, samples: 1 },
  { block: 2, samples: 1 },
  { block: 1, samples: SAMPLES },
];

const ORBIT_SPEED = 0.008; // radyan / piksel
const DOLLY_STEP = 0.9;
const FOCUS_STEP = 0.6; // tiklamada kalan mesafe orani

function MinirtPlayground() {
  const canvasRef = useRef(null);
  const [sceneIndex, setSceneIndex] = useState(0);
  const [progress, setProgress] = useState(null);
  const [showFile, setShowFile] = useState(false);
  const [moved, setMoved] = useState(false);
  const drawInWorkers = useWorkerRender(canvasRef);
  const draw = useProgressiveRender(canvasRef, WIDTH, HEIGHT);

  const { scene, error } = useMemo(() => {
    try {
      return { scene: parseScene(scenes[sceneIndex].text), error: null };
    } catch (e) {
      return { scene: null, error: e.message };
    }
  }, [sceneIndex]);

  const camera = useRef(null);
  const pivot = useRef(null);

  const redraw = useCallback(() => {
    if (!scene) return;
    // Once worker'lar; desteklenmiyorsa ayni gecisler ana is parcaciginda.
    if (drawInWorkers(scenes[sceneIndex].text, camera.current, PASSES, setProgress)) return;
    const td = prepare({ ...scene, camera: camera.current });
    draw(PASSES, (y, pass, buf) => renderRow(td, y, pass.block, pass.samples, buf), setProgress);
  }, [scene, sceneIndex, draw, drawInWorkers]);

  // Sahne degisince kamerayi dosyadaki haline dondur.
  useEffect(() => {
    if (!scene) return;
    camera.current = scene.camera;
    pivot.current = findPivot(scene);
    setMoved(false);
    redraw();
  }, [scene, redraw]);

  const move = (next) => {
    camera.current = next;
    setMoved(true);
    redraw();
  };

  const zoomBy = (factor) => {
    if (camera.current) move(dolly(camera.current, pivot.current, factor));
  };

  useCanvasControls(canvasRef, WIDTH, HEIGHT, {
    // Tiklanan nesneye don ve yaklas; Shift / sag tik ile ayni noktadan uzaklas.
    // Yorunge de artik bu noktanin etrafinda donuyor.
    onTap: (x, y, back) => {
      if (!scene || !camera.current) return;
      const point = pickPoint(scene, camera.current, x, y);
      if (!point) return; // bosluga tiklandi
      pivot.current = point;
      move(focusOn(camera.current, point, back ? 1 / FOCUS_STEP : FOCUS_STEP));
    },
    onDrag: (dx, dy) => {
      if (camera.current)
        move(orbit(camera.current, pivot.current, -dx * ORBIT_SPEED, dy * ORBIT_SPEED));
    },
    onWheel: (notches) => zoomBy(Math.pow(notches < 0 ? DOLLY_STEP : 1 / DOLLY_STEP, Math.abs(notches))),
    onPinch: (factor) => zoomBy(factor),
    onKey: (key) => {
      const step = 0.06;
      const k = key.length === 1 ? key.toLowerCase() : key;
      const turns = {
        a: [step, 0], ArrowLeft: [step, 0],
        d: [-step, 0], ArrowRight: [-step, 0],
        w: [0, step], ArrowUp: [0, step],
        s: [0, -step], ArrowDown: [0, -step],
      };
      if (turns[k] && camera.current) {
        move(orbit(camera.current, pivot.current, turns[k][0], turns[k][1]));
        return true;
      }
      if (k === "+" || k === "=") {
        zoomBy(DOLLY_STEP);
        return true;
      }
      if (k === "-") {
        zoomBy(1 / DOLLY_STEP);
        return true;
      }
      return false;
    },
  });

  const reset = () => {
    camera.current = scene.camera;
    pivot.current = findPivot(scene);
    setMoved(false);
    redraw();
  };

  const file = scenes[sceneIndex];
  const status = error
    ? `Parse error: ${error}`
    : !progress
    ? "Starting…"
    : progress.done
    ? `Rendered in ${(progress.ms / 1000).toFixed(1)} s · ${SAMPLES}×${SAMPLES} samples per pixel`
    : progress.final
    ? `Tracing ${progress.percent}%`
    : "Preview…";

  const counts = scene
    ? [
        [scene.spheres.length, "sphere"],
        [scene.planes.length, "plane"],
        [scene.cylinders.length, "cylinder"],
        [scene.lights.length, "light"],
      ]
        .filter(([n]) => n > 0)
        .map(([n, word]) => `${n} ${word}${n === 1 ? "" : "s"}`)
        .join(" · ")
    : "";

  return (
    <PlaygroundFrame
      title="Try it"
      intro={
        <>
          The ray tracer from the repository, ported function by function to
          JavaScript and reading the repository's own <code>.rt</code> files
          with the same parser rules. With the camera untouched, every frame
          is pixel for pixel the image the C build writes. Dragging and
          zooming the camera are additions for the web; the C version renders
          one fixed view.
        </>
      }
      controls={
        <>
          <div className="playground-chips" role="group" aria-label="Scene file">
            {scenes.map((item, index) => (
              <button
                key={item.file}
                type="button"
                className={index === sceneIndex ? "active" : ""}
                aria-pressed={index === sceneIndex}
                onClick={() => setSceneIndex(index)}
                title={item.file}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="playground-buttons">
            <ControlButton label="Move closer" onClick={() => zoomBy(DOLLY_STEP)}><AiOutlinePlus /></ControlButton>
            <ControlButton label="Move away" onClick={() => zoomBy(1 / DOLLY_STEP)}><AiOutlineMinus /></ControlButton>
            <ControlButton label="Reset camera to the scene file" onClick={reset} wide>
              Reset
            </ControlButton>
          </div>
        </>
      }
      canvas={
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          tabIndex={0}
          className="playground-canvas"
          aria-label={`Ray traced render of ${file.file}. Click an object to move towards it, Shift+click to back away, drag to orbit, scroll or pinch to move closer.`}
        />
      }
      command={`./miniRT ${file.file}`}
      hint={`${counts}${moved ? " · camera moved" : ""} · click an object to fly to it · drag to orbit · scroll or pinch to zoom`}
      status={status}
      extra={
        <div className="playground-file">
          <button
            type="button"
            className="playground-file-toggle"
            onClick={() => setShowFile((open) => !open)}
            aria-expanded={showFile}
          >
            {showFile ? "Hide" : "Show"} {file.file}
          </button>
          {showFile && <pre className="playground-file-body">{file.text.trim()}</pre>}
        </div>
      }
    />
  );
}

export default MinirtPlayground;
