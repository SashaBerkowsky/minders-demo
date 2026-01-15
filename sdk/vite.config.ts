import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    build: {
        lib: {
            entry: ['src/main.ts'],
            name: 'FeedbackSDK',
            fileName: (format) => `feedback-sdk.${format}.js`,
            cssFileName: 'my-lib-style',
            formats: ['es', 'cjs']
        },
    },
})
