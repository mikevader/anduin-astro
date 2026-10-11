import type { APIRoute, GetStaticPaths } from 'astro';
import { footer, masthead } from '../../lib/terrain.ts';

/**
 * The contour lines as standalone files, one per terrain and width.
 *
 * `Terrain.astro` pulls them in with `<use>` rather than inlining them: the
 * lines are most of the bytes of a page, and as a file they are fetched once
 * and cached for every page after. Colour and weight are set on the `<use>`,
 * so the tokens stay in CSS; the attributes on the root here only matter when
 * the file is opened on its own.
 */
export const getStaticPaths = (() =>
  (['masthead', 'footer'] as const).flatMap((variant) =>
    (['wide', 'narrow'] as const).map((size) => ({
      params: { name: `${variant}-${size}` },
      props: { variant, size },
    })),
  )) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) => {
  const { variant, size } = props as { variant: 'masthead' | 'footer'; size: 'wide' | 'narrow' };
  const art = (variant === 'masthead' ? masthead() : footer())[size];
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${art.width}" height="${art.height}" ` +
    `viewBox="0 0 ${art.width} ${art.height}" fill="none" stroke="currentColor" stroke-opacity=".3">` +
    `<path id="lines" d="${art.lines}"/><path id="index" d="${art.index}"/></svg>`;
  return new Response(svg, { headers: { 'Content-Type': 'image/svg+xml' } });
};
