import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

import path from 'node:path';

path;

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // for axios-extensions
    'process.env': {},
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  build: {
    rollupOptions: {
      input: './src/main.js', // Здесь должен быть путь к вашему JavaScript-файлу
      output: {
        manualChunks: {
          'group-main': [
            './src/page/AuthPage.vue',
            './src/page/BibliotekaPage.vue',
            './src/page/Home.vue',
          ],
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
              @import "/src/assets/scss/_auth.scss";
              @import "/src/assets/scss/_base.scss";
              @import "/src/assets/scss/_currentMode.scss";
              @import "/src/assets/scss/_fonts.scss";
              @import "/src/assets/scss/_mixin.scss";
              @import "/src/assets/scss/_placholder.scss";
              @import "/src/assets/scss/_scrollbar.scss";
              @import "/src/assets/scss/_varibales.scss";
              `,
      },
    },
  },
});
