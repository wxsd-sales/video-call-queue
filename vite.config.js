import { sveltekit } from '@sveltejs/kit/vite';
import { resolve } from 'path';

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [sveltekit()],
  envPrefix: 'PUBLIC',
  ssr: {
    noExternal: process.env.NODE_ENV === 'production' ? ['@carbon/charts'] : []
  },
  optimizeDeps: {
    include: ['lodash.get', 'lodash.isequal', 'lodash.clonedeep']
  },
  resolve: {
    alias: {
      $widgets: resolve('./src/widgets'),
      $components: resolve('./src/components'),
      $entities: resolve('./src/entities')
    }
  }
};

export default config;
