import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  envPrefix: 'PUBLIC',
  ssr: {
    noExternal: ['@carbon/charts', 'carbon-components']
  },
  optimizeDeps: {
    include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep']
  },
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $entities: resolve('./src/entities')
    }
  }
};

export default config;
