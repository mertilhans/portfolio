import React, { useEffect, useRef } from "react";
import { JULIA_SETS, ftAtod } from "./Projects/playground/fractolEngine";

/*
  Fenerin altindaki fract-ol: ince cizgilerle cizilmis fraktallar. Iterasyon
  mandelbrot.c / julia.c'deki ile ayni (z = z^2 + c, |z|^2 <= 4). Her piksel
  bir "bant"a dusuyor; komsusuyla ayni bantta olmayan pikseller cizgi
  oluyor, boylece fraktal topografik bir harita gibi es-iterasyon
  cizgileriyle cikiyor. Bantlar logaritmik; kenarda cizgiler sikisip tek bir
  parlak kontura donusmuyor.

  Desenler sirayla degisiyor: Mandelbrot'un tamami, iki yakinlastirma ve
  main.c'deki bes Julia kumesi. Iki tuval var; biri gorunurken siradaki
  digerine hesaplaniyor, hazir olunca yumusakca yer degistiriyorlar. Hesap
  kucuk dilimlere bolunup karelere yayiliyor, sayfa donmuyor. Gorunur olup
  olmadigini CSS maskesi (imlecin cevresi) belirliyor.
*/

const HOLD_MS = 10000;
const LINE = [79, 140, 255];

const VIEWS = [
  { re: -0.95, im: 0, span: 3.6, iter: 160 },
  { re: -0.7453, im: 0.1127, span: 0.03, iter: 250, nudge: true }, // denizati vadisi
  ...JULIA_SETS.map(([re, im]) => ({
    julia: { re: ftAtod(re), im: ftAtod(im) },
    re: 0,
    im: 0,
    span: 3.4,
    iter: 200,
    nudge: true,
  })),
  { re: 0.2825, im: 0.01, span: 0.05, iter: 250, nudge: true }, // fil vadisi
];

// Ana kardioid ve periyot-2 dairesi hic kacmaz; bosuna donmeye gerek yok.
function insideMainBulbs(re, im) {
  const x = re - 0.25;
  const q = x * x + im * im;
  if (q * (q + x) < 0.25 * im * im) return true;
  const y = re + 1;
  return y * y + im * im < 0.0625;
}

// Bir deseni tuvale dilim dilim cizer; bitince onDone cagrilir.
function renderView(canvas, view, onDone) {
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
  const w = Math.floor(window.innerWidth * dpr);
  const h = Math.floor(window.innerHeight * dpr);
  canvas.width = w;
  canvas.height = h;

  // Genis ekranda desen biraz saga kayiyor; yazinin arkasinda kalabalik olmasin.
  const wide = w / h > 1;
  const span = wide ? view.span : view.span * 0.75;
  const scale = span / w;
  const shift = wide && view.nudge ? -0.12 * span : 0;
  const minRe = view.re + shift - (w / 2) * scale;
  const maxIm = view.im + (h / 2) * scale;
  const max = view.iter;
  const julia = view.julia;

  const bands = new Int16Array(w * h);
  let y = 0;
  let job = 0;

  const step = () => {
    const until = performance.now() + 8;
    while (y < h && performance.now() < until) {
      const im = maxIm - y * scale;
      for (let x = 0; x < w; x++) {
        const re = minRe + x * scale;
        let iter = max;
        if (julia || !insideMainBulbs(re, im)) {
          const addRe = julia ? julia.re : re;
          const addIm = julia ? julia.im : im;
          let zr = re;
          let zi = im;
          iter = 0;
          while (zr * zr + zi * zi <= 4 && iter < max) {
            const t = zr * zr - zi * zi + addRe;
            zi = 2 * zr * zi + addIm;
            zr = t;
            iter++;
          }
        }
        bands[y * w + x] = iter >= max ? -1 : Math.floor(Math.log(iter + 1) * 5);
      }
      y++;
    }
    if (y < h) {
      job = requestAnimationFrame(step);
      return;
    }

    // Bant sinirlari cizgi oluyor; kumenin kendi kenari daha parlak.
    const img = ctx.createImageData(w, h);
    const data = img.data;
    for (let py = 0; py < h - 1; py++) {
      for (let px = 0; px < w - 1; px++) {
        const i = py * w + px;
        const b = bands[i];
        const r = bands[i + 1];
        const d = bands[i + w];
        if (b === r && b === d) continue;
        const o = i * 4;
        data[o] = LINE[0];
        data[o + 1] = LINE[1];
        data[o + 2] = LINE[2];
        data[o + 3] = b === -1 || r === -1 || d === -1 ? 235 : 120;
      }
    }
    ctx.putImageData(img, 0, 0);
    onDone();
  };
  job = requestAnimationFrame(step);
  return () => cancelAnimationFrame(job);
}

function FractalLayer() {
  const aRef = useRef(null);
  const bRef = useRef(null);

  useEffect(() => {
    const canvases = [aRef.current, bRef.current];
    // Imleci olmayan cihazlarda fener yok; bosuna hesaplanmiyor.
    if (!canvases[0] || window.matchMedia("(hover: none)").matches) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let front = 0;
    let index = 0;
    let cancelRender = () => {};
    let timer = 0;
    let resizeTimer = 0;

    // Siradaki deseni arkadaki tuvale ciz, hazir olunca one al.
    const showNext = (first) => {
      const back = first ? front : 1 - front;
      cancelRender();
      cancelRender = renderView(canvases[back], VIEWS[index], () => {
        canvases[back].classList.add("is-ready");
        if (!first) canvases[front].classList.remove("is-ready");
        front = back;
        index = (index + 1) % VIEWS.length;
        if (!reduced) timer = setTimeout(() => showNext(false), HOLD_MS);
      });
    };

    showNext(true);

    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        clearTimeout(timer);
        canvases.forEach((c) => c.classList.remove("is-ready"));
        index = (index + VIEWS.length - 1) % VIEWS.length;
        showNext(true);
      }, 300);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelRender();
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas ref={aRef} className="backdrop-fractal" />
      <canvas ref={bRef} className="backdrop-fractal" />
    </>
  );
}

export default FractalLayer;
