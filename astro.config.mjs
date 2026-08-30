// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://anduin.ch',
  build: {
    // Posts keep their own directory so old permalinks can be mapped during
    // the WordPress migration without a second redirect layer.
    format: 'directory',
  },
});
