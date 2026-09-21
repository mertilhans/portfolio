import * as F from "./fractolEngine";
import * as R from "./minirtEngine";
import scenes from "./scenes";

/*
  Beklenen degerler portun degil, orijinal C kodunun ciktisi: iki depo
  bu makinede goruntu tamponunu dosyaya yazan sahte bir MiniLibX ile
  derlendi (fract-ol, Makefile'daki gibi optimizasyonsuz; -ffp-contract=off
  ile Linux/x86'daki gibi FMA'siz) ve cikan goruntulerin FNV-1a ozeti
  alindi. Port bu ozetleri tutturuyorsa piksel piksel ayni goruntuyu
  uretiyor demektir.
*/

function fingerprint(buf) {
  let h = 0x811c9dc5;
  for (let i = 0; i < buf.length; i++) {
    const p = buf[i];
    h = Math.imul(h ^ (p & 0xff), 0x01000193) >>> 0;
    h = Math.imul(h ^ ((p >> 8) & 0xff), 0x01000193) >>> 0;
    h = Math.imul(h ^ ((p >> 16) & 0xff), 0x01000193) >>> 0;
  }
  return "0x" + h.toString(16).padStart(8, "0");
}

function fractal(view, julia) {
  const buf = new Uint32Array(F.WIDTH * F.HEIGHT);
  for (let y = 0; y < F.HEIGHT; y++) F.renderRow(view, julia, y, 1, buf);
  return fingerprint(buf);
}

function trace(file) {
  const scene = R.parseScene(scenes.find((s) => s.file === file).text);
  const td = R.prepare(scene);
  const buf = new Uint32Array(R.WIDTH * R.HEIGHT);
  for (let y = 0; y < R.HEIGHT; y++) R.renderRow(td, y, 1, R.SAMPLES, buf);
  return fingerprint(buf);
}

describe("fract-ol port", () => {
  test("colour keeps the C int overflow", () => {
    // 129 * 0xFFFFFF > INT_MAX: C'de tasar, sonuc negatif olur.
    expect(F.color(128)).toBe(Math.floor((128 * 0xffffff) / 250));
    expect(F.color(129)).not.toBe(Math.floor((129 * 0xffffff) / 250));
    expect(F.color(F.MAX_ITER)).toBe(0);
  });

  test("./fractol Mandelbrot matches the C build", () => {
    expect(fractal(F.startPoint(), null)).toBe("0x23480e97");
  });

  test("Julia after zooms and key presses matches the C build", () => {
    let v = F.startPoint();
    v = F.zoom(v, 4, 300, 420);
    v = F.zoom(v, 4, 300, 420);
    v = F.zoom(v, 5, 100, 100);
    v = F.pan(v, "d");
    v = F.pan(v, "s");
    const julia = { re: F.ftAtod("-0.70176"), im: F.ftAtod("0.3842") };
    expect(fractal(v, julia)).toBe("0xa6a6b1c3");
  });
});

describe("miniRT port", () => {
  test("every bundled scene parses", () => {
    scenes.forEach((s) => expect(() => R.parseScene(s.text)).not.toThrow());
  });

  test("parser rejects what the C parser rejects", () => {
    const base = "A 0.2 255,255,255\nC 0,0,0 0,0,-1 70\nL 0,5,0 0.9 255,255,255\n";
    expect(() => R.parseScene(base + "sp 0,0,-5 2 256,0,0")).toThrow(/range/);
    expect(() => R.parseScene(base + "cy 0,0,0 0,0,0 1 1 0,0,0")).toThrow(/normalised/);
    expect(() => R.parseScene(base + "tr 0,0,0")).toThrow(/Unknown element/);
    expect(() => R.parseScene(base + "A 0.1 0,0,0")).toThrow(/Duplicate/);
    expect(() => R.parseScene("C 0,0,0 0,0,-1 70\nL 0,5,0 0.9 255,255,255")).toThrow(/ambient/);
  });

  test.each([
    ["dene.rt", "0x83d0f7d2"],
    ["yilbasi_agaci.rt", "0x567f0969"],
    ["bilardo_kusbakisi.rt", "0xa1344caf"],
  ])("%s matches the C build pixel for pixel", (file, expected) => {
    expect(trace(file)).toBe(expected);
  });
});
