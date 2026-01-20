import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    build: {
        lib: {
            entry: ['src/main.ts'],
            name: 'FeedbackSDK',
            fileName: (format) =>
                format === 'iife'
                    ? 'minders-feedback-sdk.iife.js'
                    : 'minders-feedback-sdk.esm.js',
            formats: ['es', 'iife'],
        },
    },
});
