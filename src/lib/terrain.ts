/**
 * The ground the site's map is cut from.
 *
 * Two small worlds, each a height field composed by hand from a few landforms
 * and contoured by `contour.ts` at build time. Composed, not traced: nothing
 * here is lifted from Tolkien's map, and no place names appear on the result.
 * The names below are only there so the next person knows what each landform
 * is meant to be.
 *
 * World units are desktop px. The wide variant of each view is the world at
 * scale 1; the narrow variant is a smaller-scale window onto the same world,
 * so the two can no longer drift apart.
 */
import { contourPaths, smoothPath, toScreen, type Field, type Pt, type View } from './contour.ts';
import { meanderPoints, meanderSample, RIVER, type MeanderOpts } from './meander.ts';

// ---- where the page puts the river -----------------------------------------

/**
 * The left edge of the river column in each layout: `--river-left` in
 * tokens.css. The art is drawn at build time and cannot read CSS, so the
 * value is mirrored here; change both together.
 */
const RIVER_LEFT = { wide: 96 + 168 + 32, narrow: 18 };
/** The river's axis: the centre of the river column. */
const AXIS = {
  wide: RIVER_LEFT.wide + RIVER.wide.width / 2,
  narrow: RIVER_LEFT.narrow + RIVER.narrow.width / 2,
};

// ---- deterministic noise --------------------------------------------------

function hash(ix: number, iy: number, seed: number): number {
  let h = Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(seed, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
}

/** Smooth value noise in [-1, 1]. */
function noise(x: number, y: number, seed: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(ix, iy, seed), b = hash(ix + 1, iy, seed);
  const c = hash(ix, iy + 1, seed), d = hash(ix + 1, iy + 1, seed);
  return 2 * (a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy) - 1;
}

/** A few octaves of noise at a feature size of `size` world units. */
function fbm(x: number, y: number, size: number, seed: number, octaves = 2): number {
  let sum = 0, amp = 1, norm = 0, f = 1 / size;
  for (let o = 0; o < octaves; o++) {
    sum += amp * noise(x * f, y * f, seed + o * 101);
    norm += amp;
    amp *= 0.5;
    f *= 2;
  }
  return sum / norm;
}

const smoothstep = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

/** Smooth minimum: like `min`, without the crease where the two meet. */
const smin = (a: number, b: number, k: number) => {
  const h = Math.max(0, Math.min(1, 0.5 + (0.5 * (b - a)) / k));
  return b + (a - b) * h - k * h * (1 - h);
};

// ---- lines in the world ---------------------------------------------------

/** A Catmull-Rom spline through `pts`, sampled every ~`step` units. */
function spline(pts: Pt[], step = 4): Pt[] {
  const out: Pt[] = [pts[0]!];
  for (let k = 0; k < pts.length - 1; k++) {
    const p0 = pts[Math.max(0, k - 1)]!, p1 = pts[k]!, p2 = pts[k + 1]!, p3 = pts[Math.min(pts.length - 1, k + 2)]!;
    const n = Math.max(1, Math.ceil(Math.hypot(p2[0] - p1[0], p2[1] - p1[1]) / step));
    for (let s = 1; s <= n; s++) {
      const t = s / n, t2 = t * t, t3 = t2 * t;
      const f = (a: number, b: number, c: number, d: number) =>
        0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t2 + (-a + 3 * b - 3 * c + d) * t3);
      out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

interface Line {
  pts: Pt[];
  /** The same points, flat, for the hot loops. */
  xs: Float64Array;
  ys: Float64Array;
  /** Arc length at each point. */
  at: number[];
  length: number;
}

function line(pts: Pt[]): Line {
  const at = [0];
  for (let k = 1; k < pts.length; k++) {
    at.push(at[k - 1]! + Math.hypot(pts[k]![0] - pts[k - 1]![0], pts[k]![1] - pts[k - 1]![1]));
  }
  return {
    pts,
    xs: Float64Array.from(pts, ([x]) => x),
    ys: Float64Array.from(pts, ([, y]) => y),
    at,
    length: at.at(-1)!,
  };
}

/** Distance to the line, arc length at the nearest point, and which side. */
function nearest(l: Line, x: number, y: number): { d: number; s: number; side: number } {
  const { xs, ys, at } = l;
  let best = Infinity, s = 0, side = 1;
  for (let k = 0; k < xs.length - 1; k++) {
    const ax = xs[k]!, ay = ys[k]!;
    const dx = xs[k + 1]! - ax, dy = ys[k + 1]! - ay;
    const len2 = dx * dx + dy * dy;
    let t = len2 === 0 ? 0 : ((x - ax) * dx + (y - ay) * dy) / len2;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const ex = x - ax - dx * t, ey = y - ay - dy * t;
    const d2 = ex * ex + ey * ey;
    if (d2 < best) {
      best = d2;
      s = at[k]! + (at[k + 1]! - at[k]!) * t;
      side = dx * (y - ay) - dy * (x - ax) >= 0 ? 1 : -1;
    }
  }
  return { d: Math.sqrt(best), s, side };
}

/** Linear interpolation along a line's arc length. */
function along(l: Line, values: number[], s: number): number {
  if (s <= 0) return values[0]!;
  if (s >= l.length) return values.at(-1)!;
  let k = 1;
  while (l.at[k]! < s) k++;
  const t = (s - l.at[k - 1]!) / (l.at[k]! - l.at[k - 1]!);
  return values[k - 1]! + (values[k]! - values[k - 1]!) * t;
}

/**
 * A value carried along a line, read off at any point nearby. Nearest-point
 * lookup would jump wherever two stretches of a bend are equally close; a
 * weighted average over the stretches nearby does not.
 */
function carried(l: Line, value: (s: number) => number) {
  const values = l.at.map(value);
  const n = l.pts.length;
  const d = new Float64Array(n);
  return (x: number, y: number) => {
    let dmin = Infinity;
    for (let k = 0; k < n; k++) {
      const dx = x - l.xs[k]!, dy = y - l.ys[k]!;
      d[k] = Math.sqrt(dx * dx + dy * dy);
      if (d[k]! < dmin) dmin = d[k]!;
    }
    const sigma = 12 + 0.5 * dmin;
    const reach = dmin + 3 * sigma;
    let sum = 0, norm = 0;
    for (let k = 0; k < n; k++) {
      if (d[k]! > reach) continue;
      const w = Math.exp(-(((d[k]! - dmin) / sigma) ** 2));
      sum += w * values[k]!;
      norm += w;
    }
    return sum / norm;
  };
}

/**
 * A ridge: a line along the crest with a height at each control point, falling
 * away on either side. `west` and `east` are the falloff widths on the two
 * sides, so a range can have a long slope and a steep face.
 */
function ridge(crest: Pt[], heights: number[], west: number, east: number) {
  const l = line(spline(crest, 6));
  // Heights per control point, spread along the sampled crest.
  const ctrl = line(crest);
  const h = l.pts.map((_, k) => along(ctrl, heights, (l.at[k]! / l.length) * ctrl.length));
  // Past three widths the falloff is under 0.0002 of the crest: skip the search.
  const reach = 3 * Math.max(west, east);
  const xs = l.pts.map(([x]) => x), ys = l.pts.map(([, y]) => y);
  const box = [Math.min(...xs) - reach, Math.max(...xs) + reach, Math.min(...ys) - reach, Math.max(...ys) + reach];
  return (x: number, y: number) => {
    if (x < box[0]! || x > box[1]! || y < box[2]! || y > box[3]!) return 0;
    const { d, s, side } = nearest(l, x, y);
    const w = side > 0 ? west : east;
    return along(l, h, s) * Math.exp(-((d / w) ** 2));
  };
}

// ---- the river, cut into the ground --------------------------------------

/**
 * A river's channel. The water level falls along its course, and the ground
 * either side rises away from it — so every contour that reaches the river
 * turns upstream to cross it, which is the V that makes a map read as a map.
 */
function channel(course: Line, level: (s: number) => number, wall: number, round: number) {
  return (x: number, y: number, ground: number) => {
    const { d, s } = nearest(course, x, y);
    // A V with a rounded floor: `wall` units of rise per unit out from the
    // water, `round` units wide at the bottom.
    const floor = level(s) + wall * (Math.sqrt(d * d + round * round) - round);
    return smin(ground, floor, 2.4);
  };
}

/**
 * The water level of a stream that runs down existing ground. Its floor rises
 * gently from the mouth and steepens toward the head, the long profile of a
 * real valley, so it cuts deep where the ground climbs fast — a vale, not a
 * scratch. It never sits above the ground less `depth`, never rises
 * downstream, and meets the main river's level at its mouth.
 */
function streamLevel(
  course: Line, ground: Field, depth: number, mouth: number, [a, b]: [number, number],
): (s: number) => number {
  const levels = course.pts.map(([x, y], k) => {
    const up = course.length - course.at[k]!;
    return Math.min(ground(x, y) - depth, mouth + a * up + b * up * up);
  });
  for (let k = 1; k < levels.length; k++) levels[k] = Math.min(levels[k]!, levels[k - 1]!);
  for (let k = 0; k < levels.length; k++) levels[k] = Math.max(levels[k]!, mouth);
  return (s) => along(course, levels, s);
}

// ---- the masthead: between the White Tower and the Mountains of Shadow ----

/**
 * Read west to east, as the masthead shows it: a massif off the left edge with
 * a spur running east from it, the plain at its foot, the river, a long rise
 * through hill country, and a range running north–south off both edges with a
 * vale cutting west into it. A stream comes out of the vale and crosses the
 * hill country to join the river. Beyond the range, high ground.
 *
 * The river exits the bottom edge on `AXIS.wide`, heading south: the axis the
 * article river runs down.
 */
const ANDUIN: Pt[] = [
  [860, -260], [800, -170], [740, -90], [690, -24], [622, 22], [536, 44], [462, 62],
  [418, 88], [424, 118], [384, 144], [AXIS.wide + 6, 152], [AXIS.wide, 168], [AXIS.wide, 230], [AXIS.wide, 300],
];

const MORGULDUIN: Pt[] = [
  [1066, 78], [1030, 86], [980, 84], [900, 92], [820, 80], [740, 74], [660, 60], [598, 34],
];

const massif = ridge([[-260, 20], [-80, 44], [40, 58], [130, 72], [190, 84]], [21, 22, 21, 16, 9], 74, 74);
const spur = ridge([[130, 78], [190, 88], [238, 96]], [8, 7, 5], 22, 22);
const range = ridge(
  [[1150, -320], [1128, -120], [1136, 0], [1122, 70], [1146, 150], [1134, 260], [1150, 420]],
  [18, 19, 20, 18, 20, 19, 18], 120, 60,
);
const innerRidge = ridge([[1560, -300], [1540, 0], [1580, 200], [1560, 400]], [5, 6, 5, 6], 60, 60);
const hillsWest = ridge([[452, 122], [500, 128], [540, 150]], [4.5, 5.5, 4], 34, 30);
const hillsEast = ridge([[560, 110], [610, 128], [640, 170]], [3.5, 4.5, 3], 30, 30);
const hills = (x: number, y: number) => hillsWest(x, y) + hillsEast(x, y);

const anduin = line(spline(ANDUIN, 6));
/** The water level falls along the course, so contours cross the river. */
const ANDUIN_TOP = nearest(anduin, 690, -24).s;
const anduinLevel = (s: number) => 7 - 0.0095 * (s - ANDUIN_TOP);
const valleyFloor = carried(anduin, anduinLevel);

/** The ground before any water has cut into it. */
function masthead0(x: number, y: number): number {
  // Warp the landforms, not the rivers, so their outlines stop looking drawn
  // with a compass.
  const wx = x + 14 * fbm(x, y, 90, 11), wy = y + 14 * fbm(x, y, 90, 23);
  const { d, side } = nearest(anduin, x, y);
  // East of the river the hill country rises toward the range; west of it the
  // plain stays nearly flat until the massif.
  const east = side < 0;
  // Near the water both banks rise at about 1.5x the rate the river falls,
  // which opens each crossing into a V of roughly 35 degrees: wide enough to
  // see past the bank, sharp enough to read as a V.
  const rise = east
    ? 0.014 * Math.min(d, 740)
    : 1.6 * (1 - Math.exp(-d / 130)) + 0.0035 * d;
  const away = smoothstep(10, 70, d);
  const beyond = 8 * smoothstep(1150, 1260, wx);
  const land =
    massif(wx, wy) + spur(wx, wy) + range(wx, wy) + hills(wx, wy) +
    innerRidge(wx, wy) * smoothstep(1300, 1400, wx);
  return valleyFloor(x, y) + rise + away * (land + beyond + 0.6 * fbm(x, y, 70, 37));
}

// The stream's last point is moved onto the river, so the two actually meet.
const mouth = (() => {
  const [x, y] = MORGULDUIN.at(-1)!;
  const { s } = nearest(anduin, x, y);
  return anduin.pts[anduin.at.findIndex((a) => a >= s)]!;
})();
MORGULDUIN[MORGULDUIN.length - 1] = mouth;
const morgulduin = line(spline(MORGULDUIN, 6));
const morgulLevel = streamLevel(morgulduin, masthead0, 1.4, anduinLevel(nearest(anduin, ...mouth).s), [0.012, 0.00006]);
const vale = channel(morgulduin, morgulLevel, 0.2, 14);

const mastheadField: Field = (x, y) => vale(x, y, masthead0(x, y));

// ---- the footer: the lower plain -----------------------------------------

/**
 * Further downstream. The river is the page river itself, picked up where the
 * footer starts, so the contours cross it where it is actually drawn. Low
 * hills west of it, an open plain east of it with a few rises.
 */
function footerField(course: Line): Field {
  const west = ridge([[-200, 30], [60, 50], [200, 80]], [7, 8, 5], 70, 70);
  const knolls = [
    ridge([[640, 70], [720, 50]], [3.4, 3.8], 46, 46),
    ridge([[1030, 40], [1100, 48]], [3, 3.2], 40, 40),
    ridge([[1480, 90], [1600, 70]], [3.6, 3.2], 60, 60),
    ridge([[2040, 50], [2140, 60]], [3.2, 3.4], 50, 50),
  ];
  return (x, y) => {
    const wx = x + 12 * fbm(x, y, 90, 51), wy = y + 12 * fbm(x, y, 90, 63);
    const { d, side } = nearest(course, x, y);
    const rise = 1.4 * (1 - Math.exp(-d / 45)) + (side > 0 ? 0.002 : 0.004) * d;
    const away = smoothstep(8, 60, d);
    const land = west(wx, wy) + knolls.reduce((sum, k) => sum + k(wx, wy), 0);
    return 3.2 - 0.022 * y + rise + away * (land + 0.5 * fbm(x, y, 70, 71));
  };
}

// ---- views ----------------------------------------------------------------

export interface TerrainArt {
  width: number;
  height: number;
  /** Ordinary and index contours, as path data. */
  lines: string;
  index: string;
  /** A short hash of the contours, so a changed map gets a new URL. */
  version: string;
  river?: string;
  stream?: string;
}

/** Desktop and phone versions of one map, the phone one at a smaller scale. */
export interface Variants { wide: TerrainArt; narrow: TerrainArt; }

/** The narrow view, scaled about the point where the river leaves the frame. */
function narrowView(width: number, height: number, scale: number, anchor: Pt): View {
  return {
    width, height, scale,
    x0: anchor[0] - AXIS.narrow / scale,
    y0: anchor[1] - height / scale,
  };
}

function render(field: Field, view: View, interval: number, rivers: { river?: Pt[]; stream?: Pt[] } = {}): TerrainArt {
  const { lines, index } = contourPaths(field, view, { interval });
  const draw = (pts?: Pt[]) => (pts ? smoothPath(spline(pts, 12).map((p) => toScreen(view, p))) : undefined);
  return {
    width: view.width, height: view.height, lines, index, version: fnv1a(lines + index),
    river: draw(rivers.river), stream: draw(rivers.stream),
  };
}

function fnv1a(text: string): string {
  let h = 0x811c9dc5;
  for (let k = 0; k < text.length; k++) h = Math.imul(h ^ text.charCodeAt(k), 0x01000193);
  return (h >>> 0).toString(36);
}

let mastheadCache: Variants | undefined;
export function masthead(): Variants {
  return (mastheadCache ??= {
    wide: render(mastheadField, { width: 2560, height: 168, x0: 0, y0: 0, scale: 1 }, 1, { river: ANDUIN, stream: MORGULDUIN }),
    narrow: render(mastheadField, narrowView(390, 130, 0.42, [AXIS.wide, 168]), 2, { river: ANDUIN, stream: MORGULDUIN }),
  });
}

/**
 * Where the footer terrain starts below the top of the footer, in each layout:
 * the footer's padding, rule, byline and gap above it. Measured from the built
 * page; if the footer's content changes height, the crossings drift by the
 * same amount and these need re-measuring.
 */
export const FOOTER_OFFSET = { wide: 188, narrow: 212 };

let footerCache: Variants | undefined;
export function footer(): Variants {
  if (footerCache) return footerCache;

  // The page river as the footer draws it, in footer-terrain coordinates.
  const course = (opts: Omit<MeanderOpts, 'height' | 'anchor'>, left: number, offset: number): Pt[] =>
    meanderSample(meanderPoints({ ...opts, height: offset + 400, anchor: 'top' }))
      .map(([x, y]) => [left + x, y - offset] as Pt)
      .filter(([, y]) => y > -80 && y < 260);

  const wideCourse = course(RIVER.wide, RIVER_LEFT.wide, FOOTER_OFFSET.wide);
  const wideView: View = { width: 2560, height: 150, x0: 0, y0: 0, scale: 1 };

  // The phone river is a different meander, so map it into the world through
  // the narrow view rather than reuse the desktop one.
  const scale = 0.6;
  const view: View = { width: 390, height: 110, scale, x0: AXIS.wide - AXIS.narrow / scale, y0: 0 };
  const narrowCourse = course(RIVER.narrow, RIVER_LEFT.narrow, FOOTER_OFFSET.narrow)
    .map(([x, y]) => [view.x0 + x / scale, view.y0 + y / scale] as Pt);

  return (footerCache = {
    wide: render(footerField(line(wideCourse)), wideView, 1),
    narrow: render(footerField(line(narrowCourse)), view, 1.6),
  });
}
