import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: ['src/main.ts'],
      name: 'FeedbackSDK',
      fileName: (format) => {
        if (format === 'es') return 'minders-feedback-sdk.js';
        if (format === 'cjs') return 'minders-feedback-sdk.cjs';
        if (format === 'umd') return 'minders-feedback-sdk.umd.js';
        return `feedback-sdk.${format}.js`;
      },
      formats: ['es', 'cjs', 'umd'],
    },
  },
});
