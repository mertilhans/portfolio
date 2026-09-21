/* eslint-disable no-restricted-globals */
import { parseScene, prepare, renderRow, WIDTH, HEIGHT } from "./minirtEngine";

/*
  Satir bantlarini ana is parcacigindan bagimsiz cizer. Sahne metni
  degismedikce bir kez ayristirilir; kamera her istekle gelir.
*/
let cached = { text: null, scene: null };
const buf = new Uint32Array(WIDTH * HEIGHT);

self.onmessage = (event) => {
  const { job, pass, text, camera, y0, y1, block, samples } = event.data;
  if (cached.text !== text) cached = { text, scene: parseScene(text) };
  const td = prepare({ ...cached.scene, camera });
  for (let y = y0; y < y1; y += block) renderRow(td, y, block, samples, buf);
  const pixels = buf.slice(y0 * WIDTH, y1 * WIDTH);
  self.postMessage({ job, pass, y0, y1, pixels }, [pixels.buffer]);
};
