/**
 * Contour lines from a height field.
 *
 * Sample the field on a grid, trace each level with marching squares, stitch
 * the cell segments into lines, thin them, and write them as smooth SVG path
 * data. Runs at build time only; nothing here reaches the browser.
 *
 * Generic on purpose: it knows nothing about Middle-earth. The landforms live
 * in `terrain.ts`.
 */

export type Pt = [number, number];

/** Height at a world coordinate. Higher is higher ground. */
export type Field = (x: number, y: number) => number;

/** A rectangle of the world, as it lands on screen. */
export interface View {
  /** Screen size, in px. */
  width: number;
  height: number;
  /** World coordinate at the screen's top-left corner. */
  x0: number;
  y0: number;
  /** Screen px per world unit. */
  scale: number;
}

export const toScreen = (v: View, [x, y]: Pt): Pt => [(x - v.x0) * v.scale, (y - v.y0) * v.scale];
const toWorld = (v: View, x: number, y: number): Pt => [v.x0 + x / v.scale, v.y0 + y / v.scale];

interface Grid {
  nx: number; // cells across
  ny: number; // cells down
  cell: number;
  margin: number;
  values: Float64Array; // (nx + 1) * (ny + 1) samples, row-major
}

/**
 * Sample the field once per view. The grid runs `margin` px past every edge so
 * lines leave the frame instead of stopping at it.
 */
export function sample(field: Field, view: View, cell = 3, margin = 12): Grid {
  const nx = Math.ceil((view.width + 2 * margin) / cell);
  const ny = Math.ceil((view.height + 2 * margin) / cell);
  const values = new Float64Array((nx + 1) * (ny + 1));
  for (let j = 0; j <= ny; j++) {
    for (let i = 0; i <= nx; i++) {
      const [x, y] = toWorld(view, i * cell - margin, j * cell - margin);
      values[j * (nx + 1) + i] = field(x, y);
    }
  }
  return { nx, ny, cell, margin, values };
}

/** Every line at one level, as screen-space polylines. */
export function trace(grid: Grid, level: number): Pt[][] {
  const { nx, ny, cell, margin, values } = grid;
  const w = nx + 1;
  const at = (i: number, j: number) => values[j * w + i]!;

  // Edge ids: horizontal edges first, then vertical ones.
  const hEdge = (i: number, j: number) => j * nx + i;
  const vEdge = (i: number, j: number) => nx * (ny + 1) + j * w + i;

  const point = new Map<number, Pt>();
  const links = new Map<number, number[]>();
  const link = (a: number, b: number) => {
    (links.get(a) ?? links.set(a, []).get(a)!).push(b);
    (links.get(b) ?? links.set(b, []).get(b)!).push(a);
  };
  const cross = (id: number, x0: number, y0: number, v0: number, x1: number, y1: number, v1: number) => {
    if (!point.has(id)) {
      const t = (level - v0) / (v1 - v0);
      point.set(id, [x0 + (x1 - x0) * t - margin, y0 + (y1 - y0) * t - margin]);
    }
    return id;
  };

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i + 1, j + 1), d = at(i, j + 1);
      const code = (a >= level ? 8 : 0) | (b >= level ? 4 : 0) | (c >= level ? 2 : 0) | (d >= level ? 1 : 0);
      if (code === 0 || code === 15) continue;

      const x = i * cell, y = j * cell;
      const top = () => cross(hEdge(i, j), x, y, a, x + cell, y, b);
      const right = () => cross(vEdge(i + 1, j), x + cell, y, b, x + cell, y + cell, c);
      const bottom = () => cross(hEdge(i, j + 1), x, y + cell, d, x + cell, y + cell, c);
      const left = () => cross(vEdge(i, j), x, y, a, x, y + cell, d);

      switch (code) {
        case 1: case 14: link(left(), bottom()); break;
        case 2: case 13: link(bottom(), right()); break;
        case 3: case 12: link(left(), right()); break;
        case 4: case 11: link(top(), right()); break;
        case 6: case 9: link(top(), bottom()); break;
        case 7: case 8: link(left(), top()); break;
        case 5: case 10: {
          // Saddle: the centre decides which corners are joined.
          const high = (a + b + c + d) / 4 >= level;
          if ((code === 5) === high) { link(left(), top()); link(bottom(), right()); }
          else { link(top(), right()); link(left(), bottom()); }
          break;
        }
      }
    }
  }

  // Stitch. Open lines start at an edge with one neighbour; what is left is loops.
  const used = new Set<number>();
  const lines: Pt[][] = [];
  const walk = (start: number) => {
    const ids = [start];
    used.add(start);
    let cur = start;
    for (;;) {
      const next = links.get(cur)!.find((n) => !used.has(n));
      if (next === undefined) break;
      used.add(next);
      ids.push(next);
      cur = next;
    }
    const line = ids.map((id) => point.get(id)!);
    if (ids.length > 2 && links.get(cur)!.includes(start)) line.push(line[0]!);
    lines.push(line);
  };
  for (const [id, ns] of links) if (ns.length === 1 && !used.has(id)) walk(id);
  for (const id of links.keys()) if (!used.has(id)) walk(id);
  return lines;
}

/** Ramer–Douglas–Peucker: drop points that sit within `eps` of the line. */
export function simplify(pts: Pt[], eps: number): Pt[] {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack: [number, number][] = [[0, pts.length - 1]];
  while (stack.length) {
    const [s, e] = stack.pop()!;
    const [ax, ay] = pts[s]!, [bx, by] = pts[e]!;
    const dx = bx - ax, dy = by - ay;
    const len = Math.hypot(dx, dy);
    let max = -1, idx = -1;
    for (let k = s + 1; k < e; k++) {
      const [px, py] = pts[k]!;
      const dist = len === 0
        ? Math.hypot(px - ax, py - ay)
        : Math.abs(dx * (ay - py) - dy * (ax - px)) / len;
      if (dist > max) { max = dist; idx = k; }
    }
    if (max > eps) {
      keep[idx] = 1;
      stack.push([s, idx], [idx, e]);
    }
  }
  return pts.filter((_, k) => keep[k]);
}

/** Shortest decimal form: `0.5` → `.5`, `-3.0` → `-3`. */
const num = (n: number) => {
  const s = (Math.round(n * 10) / 10).toString();
  return s.replace(/^(-?)0\./, '$1.');
};
/** Join numbers, letting a minus sign stand in for the separator. */
const nums = (ns: number[]) =>
  ns.map(num).reduce((acc, s, k) => (k === 0 || s.startsWith('-') ? acc + s : `${acc} ${s}`), '');

/**
 * A smooth path through the points: Catmull-Rom, written as cubic Béziers.
 * Catmull-Rom's control points mirror across each joint, so every segment
 * after the first is a relative `s` — four numbers instead of six.
 */
export function smoothPath(pts: Pt[]): string {
  const closed = pts.length > 3 && pts[0]![0] === pts.at(-1)![0] && pts[0]![1] === pts.at(-1)![1];
  const p = closed ? pts.slice(0, -1) : pts;
  const n = p.length;
  if (n < 2) return '';
  const get = (k: number): Pt => (closed ? p[(k + n) % n]! : p[Math.max(0, Math.min(n - 1, k))]!);
  const r = (v: number) => Math.round(v * 10) / 10;

  let [cx, cy] = [r(p[0]![0]), r(p[0]![1])];
  let d = `M${nums([cx, cy])}`;
  const segs = closed ? n : n - 1;
  for (let k = 0; k < segs; k++) {
    const p0 = get(k - 1), p1 = get(k), p2 = get(k + 1), p3 = get(k + 2);
    const c2: Pt = [r(p2[0] - (p3[0] - p1[0]) / 6), r(p2[1] - (p3[1] - p1[1]) / 6)];
    const end: Pt = [r(p2[0]), r(p2[1])];
    if (k === 0) {
      const c1: Pt = [r(p1[0] + (p2[0] - p0[0]) / 6), r(p1[1] + (p2[1] - p0[1]) / 6)];
      d += `c${nums([c1[0] - cx, c1[1] - cy, c2[0] - cx, c2[1] - cy, end[0] - cx, end[1] - cy])}`;
    } else {
      d += `s${nums([c2[0] - cx, c2[1] - cy, end[0] - cx, end[1] - cy])}`;
    }
    [cx, cy] = end;
  }
  return closed ? `${d}z` : d;
}

/**
 * All contour lines for a view, split into ordinary and index contours (every
 * `indexEvery`-th level), as one path string each.
 */
export function contourPaths(
  field: Field,
  view: View,
  { interval, indexEvery = 5, cell = 3, eps = 0.45, minLength = 14 }:
    { interval: number; indexEvery?: number; cell?: number; eps?: number; minLength?: number },
): { lines: string; index: string } {
  const grid = sample(field, view, cell);
  let lo = Infinity, hi = -Infinity;
  for (const v of grid.values) { if (v < lo) lo = v; if (v > hi) hi = v; }

  let lines = '', index = '';
  for (let k = Math.ceil(lo / interval); k * interval <= hi; k++) {
    const level = k * interval;
    const isIndex = Math.round(level / interval) % indexEvery === 0;
    for (const line of trace(grid, level)) {
      // Specks a cell or two across are sampling noise, not landforms.
      let length = 0;
      for (let m = 1; m < line.length; m++) length += Math.hypot(line[m]![0] - line[m - 1]![0], line[m]![1] - line[m - 1]![1]);
      if (length < minLength) continue;
      const d = smoothPath(simplify(line, eps));
      if (isIndex) index += d; else lines += d;
    }
  }
  return { lines, index };
}
