import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import checker from 'vite-plugin-checker';
import AutoImport from 'unplugin-auto-import/vite';
import path from 'node:path';

path;

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    // for axios-extensions
    'process.env': {},
  },
  build: {
    // карта потрібна для браузера
    sourcemap: true,
  },
  plugins: [
    vue({
      reactivityTransform: true,
    }),
    checker({ typescript: true, vueTsc: true }),
    AutoImport({ imports: ['vue'] }),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // підключення scss файлів для коректної роботи у компонентах що обмежені в scope
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
