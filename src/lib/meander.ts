/**
 * The page river's course: a smooth vertical meander about a column's centre.
 *
 * Shared by `River.astro`, which draws it, and `terrain.ts`, which needs to
 * know where the footer river runs so the footer contours cross it where it
 * is drawn rather than near it.
 */
import type { Pt } from './contour.ts';

export interface MeanderOpts {
  height: number;
  /** Column width; the meander swings about its centre. */
  width: number;
  amplitude: number;
  period: number;
  /**
   * Which end is pinned, and therefore which end is guaranteed to sit on the
   * column's centre line. The crop happens at the other end.
   */
  anchor: 'top' | 'bottom';
}

/** The joints of the course, one per half-period, top to bottom. */
export function meanderPoints({ height: h, width: w, amplitude, period, anchor }: MeanderOpts): Pt[] {
  const cx = w / 2;
  const points: Pt[] = [];
  let dir = -1;

  if (anchor === 'bottom') {
    // Walk upward from the end, so the LAST point is exactly on centre.
    let y = h;
    points.push([cx, h]);
    while (y > 0) {
      y = Math.max(y - period, 0);
      points.push([cx + dir * amplitude, y]);
      dir *= -1;
    }
    points.reverse();
  } else {
    let y = 0;
    points.push([cx, 0]);
    while (y < h) {
      y = Math.min(y + period, h);
      points.push([cx + dir * amplitude, y]);
      dir *= -1;
    }
  }
  return points;
}

/** Each joint to the next is a cubic with vertical tangents at both ends. */
function segment([x0, y0]: Pt, [x1, y1]: Pt): [Pt, Pt, Pt, Pt] {
  const k = (y1 - y0) * 0.5;
  return [[x0, y0], [x0, y0 + k], [x1, y1 - k], [x1, y1]];
}

export function meanderPath(points: Pt[]): string {
  let d = `M ${points[0]![0]} ${points[0]![1]}`;
  for (let i = 1; i < points.length; i++) {
    const [, c1, c2, end] = segment(points[i - 1]!, points[i]!);
    d += ` C ${c1[0]} ${c1[1].toFixed(1)}, ${c2[0]} ${c2[1].toFixed(1)}, ${end[0]} ${end[1]}`;
  }
  return d;
}

/** Points along the drawn curve itself, about every `step` px. */
export function meanderSample(points: Pt[], step = 6): Pt[] {
  const out: Pt[] = [points[0]!];
  for (let i = 1; i < points.length; i++) {
    const [p0, p1, p2, p3] = segment(points[i - 1]!, points[i]!);
    const n = Math.max(1, Math.ceil((p3[1] - p0[1]) / step));
    for (let s = 1; s <= n; s++) {
      const t = s / n, u = 1 - t;
      const b = (a: number, b: number, c: number, d: number) => u * u * u * a + 3 * u * u * t * b + 3 * u * t * t * c + t * t * t * d;
      out.push([b(p0[0], p1[0], p2[0], p3[0]), b(p0[1], p1[1], p2[1], p3[1])]);
    }
  }
  return out;
}

/** The two courses, swapped by CSS at the 720px breakpoint. */
export const RIVER = {
  wide: { width: 56, amplitude: 11, period: 440 },
  narrow: { width: 10, amplitude: 3, period: 380 },
} as const;
