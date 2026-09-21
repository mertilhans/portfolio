/*
  mertilhans/fractol deposunun JavaScript karsiligi. Her fonksiyonun
  basinda C'deki adi yaziyor; formuller, sabitler ve dallanmalar ayni.
  Yalnizca MiniLibX'in penceresi ve goruntu tamponu yerine bir canvas
  tamponu (Uint32Array) kullaniliyor.
*/

// fractol.h
export const WIDTH = 800;
export const HEIGHT = 800;
export const MAX_ITER = 250;
const PAN_STEP = 0.015; // mlx_control.c, key_hook_*

// main.c'deki kullanim mesajinda listelenen Julia kumeleri, ayni yazimla.
export const JULIA_SETS = [
  ["-0.70176", "0.3842"],
  ["-0.8", "0.156"],
  ["0.285", "0.01"],
  ["0.355", "0.355"],
  ["-0.7", "0.27015"],
];

// utils.c: ft_atod. Ondalik kisim "div *= 0.1" ile birikiyor; parseFloat
// son bitlerde farkli sonuc verebilecegi icin aynen tasindi.
export function ftAtod(str) {
  let i = 0;
  let sign = 1;
  let nb = 0;
  let div = 0.1;
  while (i < str.length && str.charCodeAt(i) <= 32) i++;
  if (str[i] === "+" || str[i] === "-") {
    if (str[i] === "-") sign = -1;
    i++;
  }
  while (i < str.length && str[i] >= "0" && str[i] <= "9")
    nb = nb * 10.0 + (str.charCodeAt(i++) - 48);
  if (str[i] === ".") i++;
  while (i < str.length && str[i] >= "0" && str[i] <= "9") {
    nb += (str.charCodeAt(i++) - 48) * div;
    div *= 0.1;
  }
  return nb * sign;
}

// mlx_control.c: start_point
export function startPoint() {
  return { minRe: -2.0, maxRe: 2.0, minIm: -1.0, maxIm: 1.5 };
}

/*
  mandelbrot.c: iterate_mandelbrot / julia.c: iterate_julia.
  Iki fonksiyon yalnizca eklenen sabitte ayrisiyor: Mandelbrot'ta
  pikselin kendisi (c), Julia'da komut satirindan gelen (re, im).
*/
export function iterate(view, x, y, julia) {
  const cRe = view.minRe + ((view.maxRe - view.minRe) * x) / WIDTH;
  const cIm = view.minIm + ((view.maxIm - view.minIm) * y) / HEIGHT;
  // Web'e ozgu kisayol: ana kardioid ve periyot-2 dairesi hic kacmaz,
  // C dongusu orada 250 tur donup yine MAX_ITER donduruyor. Sonuc ayni
  // (engines.test.js C ciktisiyla karsilastiriyor), yalnizca daha hizli.
  if (!julia && insideMainBulbs(cRe, cIm)) return MAX_ITER;
  const addRe = julia ? julia.re : cRe;
  const addIm = julia ? julia.im : cIm;
  let zRe = cRe;
  let zIm = cIm;
  let iter = 0;
  while (zRe * zRe + zIm * zIm <= 4 && iter < MAX_ITER) {
    const temp = zRe * zRe - zIm * zIm + addRe;
    zIm = 2 * zRe * zIm + addIm;
    zRe = temp;
    iter++;
  }
  return iter;
}

function insideMainBulbs(re, im) {
  const x = re - 0.25;
  const q = x * x + im * im;
  if (q * (q + x) < 0.25 * im * im) return true;
  const y = re + 1;
  return y * y + im * im < 0.0625;
}

/*
  draw_mandelbrot / draw_julia'daki renk: iter * 0xFFFFFF / MAX_ITER.
  C'de bu carpim int ile yapiliyor ve iter >= 129 oldugunda 32 bitte
  tasiyor; ekrandaki renk bantlari bu tasmadan geliyor. Math.imul ayni
  32 bit carpimi, Math.trunc da C'nin sifira dogru bolmesini veriyor.
  MiniLibX pikselin ust baytini kullanmadigi icin 24 bit maskeleniyor.
*/
export function color(iter) {
  if (iter === MAX_ITER) return 0x000000;
  return Math.trunc(Math.imul(iter, 0xffffff) / MAX_ITER) & 0xffffff;
}

// mandelbrot.c: zoom / julia.c: zoom_julia (fare tekerlegi: 4 yakinlas, 5 uzaklas)
export function zoom(view, button, x, y) {
  const mouseRe = view.minRe + ((view.maxRe - view.minRe) * x) / WIDTH;
  const mouseIm = view.minIm + ((view.maxIm - view.minIm) * y) / HEIGHT;
  let factor;
  if (button === 4) factor = 0.9;
  else if (button === 5) factor = 1.1;
  else return view;
  return zoomBy(view, factor, mouseRe, mouseIm);
}

// zoom()'un govdesi; dokunmatik kistirma gibi kesirli carpanlar icin ayri.
export function zoomBy(view, factor, re, im) {
  return {
    minRe: re + (view.minRe - re) * factor,
    maxRe: re + (view.maxRe - re) * factor,
    minIm: im + (view.minIm - im) * factor,
    maxIm: im + (view.maxIm - im) * factor,
  };
}

// mlx_control.c: key_hook_mandelbrot / key_hook_julia (W A S D ve oklar)
export function pan(view, key) {
  const v = { ...view };
  if (key === "w" || key === "ArrowUp") {
    v.minIm -= PAN_STEP;
    v.maxIm -= PAN_STEP;
  }
  if (key === "s" || key === "ArrowDown") {
    v.maxIm += PAN_STEP;
    v.minIm += PAN_STEP;
  }
  if (key === "a" || key === "ArrowLeft") {
    v.maxRe -= PAN_STEP;
    v.minRe -= PAN_STEP;
  }
  if (key === "d" || key === "ArrowRight") {
    v.maxRe += PAN_STEP;
    v.minRe += PAN_STEP;
  }
  return v;
}

/*
  Bir satiri tampona yazar (put_pixel). block > 1 ise yalnizca her
  blogun sol ust pikseli hesaplanip blok onunla dolduruluyor: etkilesim
  sirasindaki hizli on izleme. block = 1 tam C ciktisi.
*/
export function renderRow(view, julia, y, block, buf) {
  for (let x = 0; x < WIDTH; x += block) {
    const c = color(iterate(view, x, y, julia));
    // Canvas ImageData little-endian: 0xAABBGGRR
    const px =
      0xff000000 | ((c & 0xff) << 16) | (c & 0xff00) | ((c >> 16) & 0xff);
    const yEnd = Math.min(y + block, HEIGHT);
    const xEnd = Math.min(x + block, WIDTH);
    for (let yy = y; yy < yEnd; yy++) {
      const row = yy * WIDTH;
      for (let xx = x; xx < xEnd; xx++) buf[row + xx] = px >>> 0;
    }
  }
}
