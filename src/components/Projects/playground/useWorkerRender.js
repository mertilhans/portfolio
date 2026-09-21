import { useCallback, useEffect, useRef } from "react";
import { WIDTH, HEIGHT } from "./minirtEngine";

/*
  miniRT'yi birkac Web Worker'a bolerek cizer. Her gecis 8 satirlik
  bantlara ayrilir, bos kalan worker kuyruktaki siradaki banti alir;
  bir cekirdek yavas kalirsa digerleri isi paylasir. Yeni bir cizim
  istegi kuyrugu bosaltir, eski isten gelen sonuclar yok sayilir.

  Worker'lar tamamlandigi sirayla donuyor; hizli bir on izleme banti,
  ayni satirlarin tam kalitesinden sonra gelirse ustune yazmasin diye
  her bant icin cizilen en yuksek gecis tutuluyor.

  Her worker'in mesaj isleyicisi bir kez kuruluyor ve sonucu o an aktif
  olan ise yonlendiriyor. (Isleyiciyi her gorevde yeniden kurmak, eski
  isten donen bir worker'in yeni isin sonuclarini eski tampona yazmasina
  yol aciyordu.)

  Worker desteklenmiyorsa render false doner; cagiran ana is parcacigina duser.
*/
const BAND = 8;

function poolSize() {
  const cores = (typeof navigator !== "undefined" && navigator.hardwareConcurrency) || 2;
  return Math.max(1, Math.min(6, cores - 1));
}

export function useWorkerRender(canvasRef) {
  const state = useRef(null);

  useEffect(() => {
    if (typeof Worker === "undefined") return undefined;
    let workers;
    try {
      workers = Array.from(
        { length: poolSize() },
        () => new Worker(new URL("./minirt.worker.js", import.meta.url))
      );
    } catch (e) {
      return undefined; // ornegin file:// ya da kisitli ortam
    }
    const s = { workers, job: 0, queue: [], idle: new Set(workers), active: null };
    s.next = (worker) => {
      const task = s.queue.shift();
      if (!task) {
        s.idle.add(worker);
        return;
      }
      s.idle.delete(worker);
      worker.postMessage(task);
    };
    workers.forEach((worker) => {
      worker.onmessage = (event) => {
        if (s.active && event.data.job === s.active.job) s.active.accept(event.data);
        s.next(worker);
      };
    });
    state.current = s;
    return () => {
      workers.forEach((w) => w.terminate());
      state.current = null;
    };
  }, []);

  const render = useCallback(
    (text, camera, passes, onProgress) => {
      const s = state.current;
      const canvas = canvasRef.current;
      if (!s || !canvas) return false;

      const ctx = canvas.getContext("2d");
      const img = ctx.createImageData(WIDTH, HEIGHT);
      const out = new Uint32Array(img.data.buffer);
      // Mevcut goruntuyle basla: on izleme gelene kadar eski kare kalsin.
      out.set(new Uint32Array(ctx.getImageData(0, 0, WIDTH, HEIGHT).data.buffer));

      const job = ++s.job;
      const started = performance.now();
      const bands = Math.ceil(HEIGHT / BAND);
      const level = new Int8Array(bands).fill(-1);
      const last = passes.length - 1;
      let finalDone = 0;
      let paintQueued = false;

      s.queue = [];
      passes.forEach((pass, p) => {
        for (let b = 0; b < bands; b++) {
          s.queue.push({
            job,
            pass: p,
            text,
            camera,
            y0: b * BAND,
            y1: Math.min(HEIGHT, (b + 1) * BAND),
            block: pass.block,
            samples: pass.samples,
          });
        }
      });

      const paint = () => {
        paintQueued = false;
        if (job !== s.job) return;
        ctx.putImageData(img, 0, 0);
        const done = finalDone === bands;
        onProgress(
          done
            ? { done: true, ms: performance.now() - started }
            : {
                done: false,
                final: finalDone > 0 || level.every((l) => l >= last - 1),
                percent: Math.round((finalDone / bands) * 100),
              }
        );
      };

      s.active = {
        job,
        accept: (r) => {
          const band = r.y0 / BAND;
          if (r.pass <= level[band]) return;
          level[band] = r.pass;
          out.set(r.pixels, r.y0 * WIDTH);
          if (r.pass === last) finalDone += 1;
          if (!paintQueued) {
            paintQueued = true;
            requestAnimationFrame(paint);
          }
        },
      };

      // Bos worker'lari hemen baslat; mesguller islerini bitirince kuyruktan alir.
      [...s.idle].forEach((worker) => s.next(worker));
      return true;
    },
    [canvasRef]
  );

  return render;
}
