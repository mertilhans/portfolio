import { useCallback, useEffect, useRef } from "react";

/*
  Kademeli cizim: her gecis (pass) satir satir cizilir, is ~12 ms'lik
  dilimlere bolunur, sayfa hic donmaz. Ilk gecisler bloklu ve hizli (on
  izleme), son gecis tam kalite. Yeni bir start() cagrisi suren cizimi
  iptal eder; boylece tekerlek ya da surukleme sirasinda hep en son
  gorunum cizilir.

  Dilimler arasinda requestAnimationFrame yerine MessageChannel ile
  sira veriliyor: rAF her karede tek dilim calistirdigi icin islemcinin
  ancak bir kismini kullaniyordu (60 Hz'de %75, 30 Hz'de %37). Mesaj
  kuyrugu dilim arasinda girdi ve boyamaya yine firsat taniyor, canvas'a
  aktarma ise kare hizinda yapiliyor.
*/
const nextTick = (() => {
  if (typeof MessageChannel === "undefined") return (fn) => setTimeout(fn, 0);
  const channel = new MessageChannel();
  const queue = [];
  channel.port1.onmessage = () => queue.shift()();
  return (fn) => {
    queue.push(fn);
    channel.port2.postMessage(0);
  };
})();
export function useProgressiveRender(canvasRef, width, height) {
  const job = useRef(0);
  const image = useRef(null);

  useEffect(() => () => {
    job.current += 1; // unmount: suren cizimi durdur
  }, []);

  return useCallback(
    (passes, renderRow, onProgress) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!image.current) image.current = ctx.createImageData(width, height);
      const img = image.current;
      const buf = new Uint32Array(img.data.buffer);

      const id = ++job.current;
      const started = performance.now();
      let pass = 0;
      let y = 0;
      let painted = 0;

      const step = () => {
        if (id !== job.current) return;
        const deadline = performance.now() + 12;
        while (performance.now() < deadline) {
          renderRow(y, passes[pass], buf);
          y += passes[pass].block;
          if (y >= height) {
            pass += 1;
            y = 0;
            if (pass === passes.length) {
              ctx.putImageData(img, 0, 0);
              if (onProgress)
                onProgress({ done: true, ms: performance.now() - started });
              return;
            }
          }
        }
        // Ekran zaten saniyede ~60 kez yenileniyor; daha sik aktarmak bosa is.
        const now = performance.now();
        if (now - painted > 16) {
          painted = now;
          ctx.putImageData(img, 0, 0);
          if (onProgress) {
            onProgress({
              done: false,
              final: pass === passes.length - 1,
              percent: Math.round((y / height) * 100),
            });
          }
        }
        nextTick(step);
      };
      nextTick(step);
    },
    [canvasRef, width, height]
  );
}

/*
  Fare, tekerlek, dokunmatik ve klavye tek yerde. Koordinatlar canvas'in
  ic cozunurlugune cevriliyor (C programinin piksel koordinatlari), yani
  CSS ile kucultulmus bir canvas'ta da imlecin altindaki nokta dogru.

  handlers:
    onWheel(notches, x, y)  — notches < 0 yakinlas (mlx dugme 4), > 0 uzaklas (5)
    onDrag(dx, dy)          — ic piksel cinsinden
    onPinch(factor, x, y)   — factor < 1 yakinlas
    onKey(key)              — true donerse varsayilan davranis engellenir
    onRelease()             — surukleme / kistirma bitti
    onTap(x, y, back)       — tiklama / dokunma; back: Shift, Alt ya da sag tik

  Tiklama ile suruklemeyi ayirmak icin imlec 5 pikselden fazla
  kaymadikca surukleme baslamiyor; kaymadan birakilirsa tiklamadir.
*/
const TAP_SLOP = 5;
export function useCanvasControls(canvasRef, width, height, handlers) {
  const latest = useRef(handlers);
  latest.current = handlers;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const toInternal = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: ((clientX - rect.left) * width) / rect.width,
        y: ((clientY - rect.top) * height) / rect.height,
        scale: width / rect.width,
      };
    };

    // Dokunmatik yuzeyler cok sayida kucuk tekerlek olayi yolluyor;
    // biriktirip ~50 piksellik her dilimi bir "tik" sayiyoruz.
    let wheelAcc = 0;
    const onWheel = (event) => {
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 33 : event.deltaY;
      wheelAcc += delta;
      const notches = Math.trunc(wheelAcc / 50);
      if (!notches) return;
      wheelAcc -= notches * 50;
      const p = toInternal(event.clientX, event.clientY);
      latest.current.onWheel && latest.current.onWheel(notches, p.x, p.y);
    };

    const pointers = new Map();
    let pinchDist = 0;
    let tap = null; // { x, y, back } — hala tiklama sayilabilecek basis

    const onDown = (event) => {
      canvas.setPointerCapture(event.pointerId);
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      tap =
        pointers.size === 1
          ? {
              x: event.clientX,
              y: event.clientY,
              back: event.shiftKey || event.altKey || event.button === 2,
            }
          : null;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinchDist = Math.hypot(a.x - b.x, a.y - b.y);
      }
    };

    const onMove = (event) => {
      const prev = pointers.get(event.pointerId);
      if (!prev) return;
      const next = { x: event.clientX, y: event.clientY };
      pointers.set(event.pointerId, next);

      if (pointers.size === 1) {
        if (tap) {
          if (Math.hypot(next.x - tap.x, next.y - tap.y) < TAP_SLOP) return;
          tap = null; // artik surukleme; esigi asan ilk kayma yutulur
          return;
        }
        const { scale } = toInternal(0, 0);
        latest.current.onDrag &&
          latest.current.onDrag((next.x - prev.x) * scale, (next.y - prev.y) * scale);
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (pinchDist > 0 && dist > 0) {
          const mid = toInternal((a.x + b.x) / 2, (a.y + b.y) / 2);
          latest.current.onPinch &&
            latest.current.onPinch(pinchDist / dist, mid.x, mid.y);
        }
        pinchDist = dist;
      }
    };

    const onUp = (event) => {
      if (!pointers.delete(event.pointerId)) return;
      if (tap && pointers.size === 0 && event.type === "pointerup") {
        const p = toInternal(tap.x, tap.y);
        const back = tap.back;
        tap = null;
        latest.current.onTap && latest.current.onTap(p.x, p.y, back);
        return;
      }
      tap = null;
      if (pointers.size < 2) pinchDist = 0;
      if (pointers.size === 0 && latest.current.onRelease)
        latest.current.onRelease();
    };

    const onKey = (event) => {
      if (latest.current.onKey && latest.current.onKey(event.key))
        event.preventDefault();
    };

    // Sag tik uzaklastirir; tarayici menusu acilmasin.
    const onContext = (event) => event.preventDefault();

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("contextmenu", onContext);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    canvas.addEventListener("keydown", onKey);
    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("contextmenu", onContext);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      canvas.removeEventListener("keydown", onKey);
    };
  }, [canvasRef, width, height]);
}
