/*
  mertilhans/MiniRT deposunun JavaScript karsiligi. Fonksiyon adlari C'deki
  karsiliklarini gosteriyor. Kayan nokta islemleri C'deki sirayla yaziliyor
  (vec_norm 1/len ile carpar, toplamalar soldan saga), boylece cikti
  derlenmis programinkiyle piksel piksel ayni kaliyor; bunu
  engines.test.js dogruluyor.

  Tek ekleme silindirler icin sinirlayici kure testi: isin kureyi hic
  kesmiyorsa silindiri de kesemez, yani sonuc degismez, yalnizca 100
  silindirli sahneler tarayicida birkac kat hizli ciziliyor.
*/

// minirt.h
export const WIDTH = 700;
export const HEIGHT = 500;
export const SAMPLES = 2;
const EPSILON = 0.001;
const MAX_LIGHTS = 4;
const MAX_OBJECTS = 100;

const NONE = 0;
const SPHERE = 1;
const PLANE = 2;
const CYLINDER = 3;

/* ---------- rt_vector.c / rt_utils.c ---------- */

const v = (x, y, z) => ({ x, y, z });
const add = (a, b) => v(a.x + b.x, a.y + b.y, a.z + b.z);
const sub = (a, b) => v(a.x - b.x, a.y - b.y, a.z - b.z);
const mul = (a, s) => v(a.x * s, a.y * s, a.z * s);
const dot = (a, b) => a.x * b.x + a.y * b.y + a.z * b.z;
const len = (a) => Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
const cross = (a, b) =>
  v(a.y * b.z - a.z * b.y, a.z * b.x - a.x * b.z, a.x * b.y - a.y * b.x);
function norm(a) {
  const l = Math.sqrt(dot(a, a));
  if (l === 0) return v(0, 0, 0);
  return mul(a, 1 / l);
}

/* ---------- parser (parser_*.c) ---------- */

export class SceneError extends Error {}

// parser_string.c: ft_atod (MiniRT surumu: yalnizca bosluk ve tab atlar)
function ftAtod(str) {
  let i = 0;
  let sign = 1;
  let nb = 0;
  let div = 0.1;
  while (str[i] === " " || str[i] === "\t") i++;
  if (str[i] === "-") {
    sign = -1;
    i++;
  } else if (str[i] === "+") i++;
  while (i < str.length && str[i] >= "0" && str[i] <= "9")
    nb = nb * 10.0 + (str.charCodeAt(i++) - 48);
  if (str[i] === ".") i++;
  while (i < str.length && str[i] >= "0" && str[i] <= "9") {
    nb += (str.charCodeAt(i++) - 48) * div;
    div *= 0.1;
  }
  // C'de burada program "Invalied,Error" yazip cikiyor.
  if (i < str.length) throw new SceneError(`Invalid number "${str}"`);
  return nb * sign;
}

// ft_strtok ardisik ayiricilari tek sayiyor: bos parcalar atiliyor.
const pieces = (s) => s.split(",").filter((p) => p !== "");

// parser_token.c: ft_parsev
function parseVector(s) {
  const p = pieces(s);
  if (p.length !== 3) throw new SceneError(`Bad vector "${s}"`);
  return v(ftAtod(p[0]), ftAtod(p[1]), ftAtod(p[2]));
}

// parser_color.c: ft_parsec (ft_is_valid_number + ft_atoi + 0..255)
function parseColor(s) {
  const p = pieces(s);
  if (p.length !== 3 || !p.every((n) => /^[ \t]*[+-]?\d+[ \t]*$/.test(n)))
    throw new SceneError(`Bad colour "${s}"`);
  const [r, g, b] = p.map((n) => parseInt(n, 10));
  if (![r, g, b].every((c) => c >= 0 && c <= 255))
    throw new SceneError(`Colour out of range "${s}"`);
  return { r, g, b };
}

const inRange = (val, min, max) => val >= min && val <= max; // ft_range
const normOk = (a) => inRange(len(a), 0.9, 1.1); // ft_norm_control

function expect(tokens, count, what) {
  if (tokens.length !== count) throw new SceneError(`Wrong arguments for ${what}`);
}

// parser_main.c: ft_parse_file -> ft_parse_line -> ft_process_element
export function parseScene(text) {
  const scene = {
    ambient: null,
    camera: null,
    lights: [],
    spheres: [],
    planes: [],
    cylinders: [],
  };

  text.split("\n").forEach((line, index) => {
    if (line.length === 0 || line[0] === "#") return;
    const t = line.split(" ").filter((p) => p !== ""); // ft_split(line, ' ')
    if (t.length === 0) return;
    const where = `line ${index + 1}`;

    try {
      switch (t[0]) {
        case "A": {
          if (scene.ambient) throw new SceneError("Duplicate element");
          expect(t, 3, "A");
          const ratio = ftAtod(t[1]);
          if (!inRange(ratio, 0.0, 1.0)) throw new SceneError("A ratio out of range");
          scene.ambient = { ratio, color: parseColor(t[2]) };
          break;
        }
        case "C": {
          if (scene.camera) throw new SceneError("Duplicate element");
          expect(t, 4, "C");
          const position = parseVector(t[1]);
          let direction = parseVector(t[2]);
          if (!normOk(direction)) throw new SceneError("Camera direction not normalised");
          direction = norm(direction);
          const fov = ftAtod(t[3]);
          if (!inRange(fov, 0.0, 180.0)) throw new SceneError("FOV out of range");
          scene.camera = { position, direction, fov };
          break;
        }
        case "L": {
          if (scene.lights.length >= MAX_LIGHTS) throw new SceneError("Too many lights");
          expect(t, 4, "L");
          const position = parseVector(t[1]);
          const brightness = ftAtod(t[2]);
          if (!inRange(brightness, 0.0, 1.0)) throw new SceneError("Brightness out of range");
          scene.lights.push({ position, brightness, color: parseColor(t[3]) });
          break;
        }
        case "sp": {
          if (scene.spheres.length >= MAX_OBJECTS) throw new SceneError("Too many spheres");
          expect(t, 4, "sp");
          const center = parseVector(t[1]);
          const diameter = ftAtod(t[2]);
          if (diameter <= 0.0) throw new SceneError("Diameter must be positive");
          scene.spheres.push({ center, diameter, color: parseColor(t[3]) });
          break;
        }
        case "pl": {
          if (scene.planes.length >= MAX_OBJECTS) throw new SceneError("Too many planes");
          expect(t, 4, "pl");
          const point = parseVector(t[1]);
          const normal = norm(parseVector(t[2]));
          const color = parseColor(t[3]);
          if (!normOk(normal)) throw new SceneError("Plane normal not normalised");
          scene.planes.push({ point, normal, color });
          break;
        }
        case "cy": {
          if (scene.cylinders.length >= MAX_OBJECTS) throw new SceneError("Too many cylinders");
          expect(t, 6, "cy");
          const center = parseVector(t[1]);
          const axis = norm(parseVector(t[2]));
          if (!normOk(axis)) throw new SceneError("Cylinder axis not normalised");
          const diameter = ftAtod(t[3]);
          if (diameter <= 0.0) throw new SceneError("Diameter must be positive");
          const height = ftAtod(t[4]);
          if (height <= 0.0) throw new SceneError("Height must be positive");
          scene.cylinders.push({ center, axis, diameter, height, color: parseColor(t[5]) });
          break;
        }
        default:
          throw new SceneError("Unknown element");
      }
    } catch (error) {
      if (error instanceof SceneError) error.message = `${where}: ${error.message}`;
      throw error;
    }
  });

  // parser_init.c: ft_scene_ok
  if (!scene.ambient) throw new SceneError("Missing ambient light (A)");
  if (!scene.camera) throw new SceneError("Missing camera (C)");
  if (scene.lights.length < 1) throw new SceneError("Missing light (L)");
  return scene;
}

/* ---------- intersections ---------- */

// rt_sphere.c: ray_sphere (+ solve_quadratic). Isabet yoksa -1.
function raySphere(o, d, sp) {
  const oc = sub(o, sp.center);
  const radius = sp.diameter / 2.0;
  const a = dot(d, d);
  const b = 2.0 * dot(oc, d);
  const c = dot(oc, oc) - radius * radius;
  const disc = b * b - 4 * a * c;
  if (disc < 0) return -1;
  const sd = Math.sqrt(disc);
  const t0 = (-b - sd) / (2 * a);
  const t1 = (-b + sd) / (2 * a);
  if (t0 > 0.001) return t0;
  if (t1 > 0.001) return t1;
  return -1;
}

// rt_plane.c: ray_plane
function rayPlane(o, d, point, normal) {
  const denom = dot(d, normal);
  if (Math.abs(denom) > 1e-6) {
    const t = dot(sub(point, o), normal) / denom;
    if (t >= 0.001) return t;
  }
  return -1;
}

// ray.c: t_control. Iki kok de arkadaysa 0 donuyor (C'deki gibi).
function tControl(a, b, disc) {
  const sd = Math.sqrt(disc);
  const t0 = (-b - sd) / (2 * a);
  const t1 = (-b + sd) / (2 * a);
  let t = -1;
  if (t0 > 0.001) t = t0;
  else if (t1 > 0.001) t = t1;
  if (t < 0) return 0;
  return t;
}

/*
  rt_cylinder.c: ray_cylinder_side. Not: C, yakin kok yukseklik
  araliginin disindaysa uzak koke bakmadan vazgeciyor; bu yuzden
  silindirin ic yuzu gorunmuyor. Davranis aynen korunuyor.
*/
function cylinderSide(o, d, cy) {
  const ca = cy.axis;
  const oc = sub(o, cy.center);
  const x = sub(d, mul(ca, dot(d, ca)));
  const y = sub(oc, mul(ca, dot(oc, ca)));
  const a = dot(x, x);
  const b = 2.0 * dot(x, y);
  const c = dot(y, y) - (cy.diameter / 2.0) * (cy.diameter / 2.0);
  const disc = b * b - 4 * a * c;
  if (disc < 0) return -1;
  const t = tControl(a, b, disc);
  const hit = add(o, mul(d, t));
  const h = dot(sub(hit, cy.center), ca);
  if (h < 0 || h > cy.height) return -1;
  return t;
}

// rt_cylinder.c: ray_cylinder_total + rt_cylinder_extension.c
// Donus: { t, type } — type 3 yan yuzey, 1 alt kapak, 2 ust kapak, 0 yok.
function cylinderTotal(o, d, cy) {
  const side = cylinderSide(o, d, cy);

  // bottom_cylinder
  let capBottom = rayPlane(o, d, cy.center, cy.negAxis);
  if (capBottom !== -1) {
    const hit = add(o, mul(d, capBottom));
    if (len(sub(hit, cy.center)) > cy.diameter / 2.0) capBottom = -1;
  }

  // top_cylinder
  let capTop = rayPlane(o, d, cy.topCenter, cy.axis);
  if (capTop !== -1) {
    const hit = add(o, mul(d, capTop));
    if (len(sub(hit, cy.topCenter)) > cy.diameter / 2.0) capTop = -1;
  }

  // ft_cy_control
  let tMin = Infinity;
  let type = 0;
  if (side > EPSILON && side < tMin) {
    tMin = side;
    type = 3;
  }
  if (capBottom > EPSILON && capBottom < tMin) {
    tMin = capBottom;
    type = 1;
  }
  if (capTop > EPSILON && capTop < tMin) {
    tMin = capTop;
    type = 2;
  }
  return { t: tMin, type };
}

// Eklenen hizlandirma: isin silindiri saran kureyi kacirirsa silindir de kacar.
function missesBound(o, d, cy) {
  const ox = cy.boundCenter.x - o.x;
  const oy = cy.boundCenter.y - o.y;
  const oz = cy.boundCenter.z - o.z;
  const dd = d.x * d.x + d.y * d.y + d.z * d.z;
  const tca = (ox * d.x + oy * d.y + oz * d.z) / dd;
  const oc2 = ox * ox + oy * oy + oz * oz;
  if (tca < 0 && oc2 > cy.bound2) return true;
  return oc2 - tca * tca * dd > cy.bound2;
}

function cylinderHit(o, d, cy) {
  if (missesBound(o, d, cy)) return { t: Infinity, type: 0 };
  return cylinderTotal(o, d, cy);
}

/* ---------- shading ---------- */

// rt_shadow.c: in_shadow
function inShadow(scene, point, lightDir, lightDist) {
  const o = add(point, mul(lightDir, 0.001));
  for (const sp of scene.spheres) {
    const t = raySphere(o, lightDir, sp);
    if (t !== -1 && t > 0.001 && t < lightDist) return true;
  }
  for (const pl of scene.planes) {
    const t = rayPlane(o, lightDir, pl.point, pl.normal);
    if (t !== -1 && t > 0.001 && t < lightDist) return true;
  }
  for (const cy of scene.cylinders) {
    const hit = cylinderHit(o, lightDir, cy);
    if (hit.type && hit.t > 0.001 && hit.t < lightDist) return true;
  }
  return false;
}

/*
  ft_shade_sphere / ft_shade_plane / ft_shade_cylinder'in ortak govdesi:
  golgedeyse yalnizca ambient, degilse diffuse + ambient. C'de sonuc int'e
  atanirken kesiliyor (Math.trunc).
*/
function shade(td, obj, hit, normal, light) {
  const scene = td.scene;
  const toLight = sub(light.position, hit);
  const lightDir = norm(toLight);
  const lightDist = len(toLight);
  const amb = scene.ambient.ratio;
  const ar = scene.ambient.color.r / 255.0;
  const ag = scene.ambient.color.g / 255.0;
  const ab = scene.ambient.color.b / 255.0;
  const c = obj.color;

  if (inShadow(scene, hit, lightDir, lightDist)) {
    return [
      Math.trunc(Math.min(255, c.r * amb * ar)),
      Math.trunc(Math.min(255, c.g * amb * ag)),
      Math.trunc(Math.min(255, c.b * amb * ab)),
    ];
  }
  const diff = Math.max(0.0, dot(normal, lightDir)) * light.brightness;
  return [
    Math.trunc(Math.min(255, c.r * (diff + amb * ar))),
    Math.trunc(Math.min(255, c.g * (diff + amb * ag))),
    Math.trunc(Math.min(255, c.b * (diff + amb * ab))),
  ];
}

// ray.c: trace_ray
function traceRay(td, o, d) {
  const scene = td.scene;
  let tMin = Infinity;
  let type = NONE;
  let index = -1;

  scene.spheres.forEach((sp, i) => {
    const t = raySphere(o, d, sp);
    if (t !== -1 && t < tMin) {
      tMin = t;
      index = i;
      type = SPHERE;
    }
  });
  scene.planes.forEach((pl, i) => {
    const t = rayPlane(o, d, pl.point, pl.normal);
    if (t !== -1 && t < tMin) {
      tMin = t;
      index = i;
      type = PLANE;
    }
  });
  let cylType = 0;
  scene.cylinders.forEach((cy, i) => {
    const hit = cylinderHit(o, d, cy);
    if (hit.type && hit.t < tMin) {
      tMin = hit.t;
      index = i;
      type = CYLINDER;
      cylType = hit.type;
    }
  });

  let r = 0;
  let g = 0;
  let b = 0;
  if (type === NONE) return [0, 0, 0];

  const hit = add(o, mul(d, tMin));
  let obj;
  let normal;
  if (type === SPHERE) {
    obj = scene.spheres[index];
    normal = norm(sub(hit, obj.center));
  } else if (type === PLANE) {
    obj = scene.planes[index];
    normal = norm(obj.normal);
  } else {
    obj = scene.cylinders[index];
    if (cylType === 1) normal = obj.negAxis;
    else if (cylType === 2) normal = obj.axis;
    else {
      const cp = sub(hit, obj.center);
      normal = norm(sub(cp, mul(obj.axis, dot(cp, obj.axis))));
    }
  }

  // sphere() / plane() / cylinder(): her isigin katkisi toplaniyor.
  for (const light of scene.lights) {
    const c = shade(td, obj, hit, normal, light);
    r += c[0];
    g += c[1];
    b += c[2];
  }
  return [Math.min(r, 255), Math.min(g, 255), Math.min(b, 255)];
}

/* ---------- camera and pixels ---------- */

// rt_camera.c: ft_camera. Sahneye silindir yardimci alanlarini da ekler.
export function prepare(scene) {
  scene.cylinders.forEach((cy) => {
    cy.negAxis = mul(cy.axis, -1);
    cy.topCenter = add(cy.center, mul(cy.axis, cy.height));
    cy.boundCenter = add(cy.center, mul(cy.axis, cy.height / 2));
    const r = cy.diameter / 2;
    const bound = Math.sqrt((cy.height / 2) ** 2 + r * r) * 1.001 + 1e-6;
    cy.bound2 = bound * bound;
  });

  const forward = norm(scene.camera.direction);
  const right = norm(cross(forward, v(0, 1, 0)));
  const up = cross(right, forward);
  const aspect = WIDTH / HEIGHT;
  const halfFov = Math.tan((scene.camera.fov * Math.PI) / 180 / 2);
  const viewportDist = 1.0;
  return {
    scene,
    forward,
    right,
    up,
    viewportDist,
    halfW: viewportDist * halfFov * aspect,
    halfH: viewportDist * halfFov,
  };
}

// ray.c: compute_ray_direction + rt_camera.c: compute_cam
function rayDirection(td, x, y, sx, sy, samples) {
  const uOff = (sx + 0.5) / samples;
  const vOff = (sy + 0.5) / samples;
  const uNorm = ((2.0 * (x + uOff)) / WIDTH - 1.0) * td.halfW;
  const vNorm = (1.0 - (2.0 * (y + vOff)) / HEIGHT) * td.halfH;
  const dir = add(
    add(mul(td.forward, td.viewportDist), mul(td.right, uNorm)),
    mul(td.up, vNorm)
  );
  return norm(dir);
}

// rt_pixel_func.c: render_pixel. samples x samples alt piksel ortalamasi.
export function renderPixel(td, x, y, samples) {
  let r = 0;
  let g = 0;
  let b = 0;
  for (let sy = 0; sy < samples; sy++) {
    for (let sx = 0; sx < samples; sx++) {
      const c = traceRay(td, td.scene.camera.position, rayDirection(td, x, y, sx, sy, samples));
      r += c[0];
      g += c[1];
      b += c[2];
    }
  }
  const total = samples * samples;
  return [
    Math.min(255, Math.trunc(r / total)),
    Math.min(255, Math.trunc(g / total)),
    Math.min(255, Math.trunc(b / total)),
  ];
}

// Bir satiri tampona yazar; block > 1 hizli on izleme icin.
export function renderRow(td, y, block, samples, buf) {
  for (let x = 0; x < WIDTH; x += block) {
    const [r, g, b] = renderPixel(td, x, y, samples);
    const px = (0xff000000 | (b << 16) | (g << 8) | r) >>> 0;
    const yEnd = Math.min(y + block, HEIGHT);
    const xEnd = Math.min(x + block, WIDTH);
    for (let yy = y; yy < yEnd; yy++) {
      const row = yy * WIDTH;
      for (let xx = x; xx < xEnd; xx++) buf[row + xx] = px;
    }
  }
}

/* ---------- web-only camera controls (C surumunde yok) ---------- */

// Isinin ilk carptigi uzaklik; hicbir seye carpmazsa Infinity.
function nearestDistance(scene, o, d) {
  let best = Infinity;
  scene.spheres.forEach((sp) => {
    const t = raySphere(o, d, sp);
    if (t !== -1 && t < best) best = t;
  });
  scene.planes.forEach((pl) => {
    const t = rayPlane(o, d, pl.point, pl.normal);
    if (t !== -1 && t < best) best = t;
  });
  scene.cylinders.forEach((cy) => {
    const hit = cylinderTotal(o, d, cy);
    if (hit.type && hit.t < best) best = hit.t;
  });
  return best;
}

// Ekranin ortasindaki isinin carptigi nokta: yorunge ve yakinlasma bunun etrafinda.
export function findPivot(scene) {
  const td = prepare(scene);
  const o = scene.camera.position;
  let best = nearestDistance(scene, o, td.forward);
  if (!Number.isFinite(best)) best = 50;
  return add(o, mul(td.forward, best));
}

// Tiklanan pikselin altindaki nokta (x, y canvas'in ic koordinatlari).
export function pickPoint(scene, camera, x, y) {
  const td = prepare({ ...scene, camera });
  const d = rayDirection(td, x - 0.5, y - 0.5, 0, 0, 1);
  const t = nearestDistance(scene, camera.position, d);
  return Number.isFinite(t) ? add(camera.position, mul(d, t)) : null;
}

// Kamerayi noktaya cevirip factor oraninda yaklastirir (factor > 1 uzaklastirir).
export function focusOn(camera, point, factor) {
  const offset = sub(camera.position, point);
  const dist = len(offset);
  const next = Math.max(0.5, dist * factor);
  const position = add(point, mul(offset, next / dist));
  return { ...camera, position, direction: norm(sub(point, position)) };
}

// Kamerayi pivot etrafinda dondurur (dunya Y ekseni ve kameranin sag ekseni).
export function orbit(camera, pivot, dYaw, dPitch) {
  let offset = sub(camera.position, pivot);
  const cos = Math.cos(dYaw);
  const sin = Math.sin(dYaw);
  offset = v(offset.x * cos + offset.z * sin, offset.y, -offset.x * sin + offset.z * cos);

  const dist = len(offset);
  const pitch = Math.asin(Math.max(-1, Math.min(1, offset.y / dist)));
  // Kamera tam dikey olursa cross(forward, Y) sifirlanir; 88 derecede dur.
  const limit = (88 * Math.PI) / 180;
  const next = Math.max(-limit, Math.min(limit, pitch + dPitch));
  const flat = Math.hypot(offset.x, offset.z) || 1e-9;
  const scale = (dist * Math.cos(next)) / flat;
  offset = v(offset.x * scale, dist * Math.sin(next), offset.z * scale);

  const position = add(pivot, offset);
  return { ...camera, position, direction: norm(sub(pivot, position)) };
}

// Kamerayi pivota yaklastirir / uzaklastirir.
export function dolly(camera, pivot, factor) {
  const offset = sub(camera.position, pivot);
  const dist = len(offset);
  const next = Math.max(0.5, dist * factor);
  const position = add(pivot, mul(offset, next / dist));
  return { ...camera, position };
}
