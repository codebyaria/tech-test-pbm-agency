import inertia from '@inertiajs/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

const wayfinderPlugin = process.env.WAYFINDER_GENERATE === 'false'
    ? []
    : [
          wayfinder({
              formVariants: true,
          }),
      ];

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            ssr: 'resources/js/ssr.tsx',
            refresh: true,
            fonts: [
                bunny('Instrument Sans', {
                    weights: [400, 500, 600],
                }),
                bunny('Space Grotesk', {
                    weights: [600, 700],
                }),
            ],
        }),
        inertia(),
        react({
            babel: {
                plugins: ['babel-plugin-react-compiler'],
            },
        }),
        tailwindcss(),
        ...wayfinderPlugin,
        // Add Gzip and Brotli compression
        compression({ algorithm: 'gzip', exclude: [/\.(br)$/, /\.(gz)$/] }),
        compression({ algorithm: 'brotliCompress', exclude: [/\.(br)$/, /\.(gz)$/] }),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    // React core — always needed, long-lived cache
                    if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
                        return 'react-vendor';
                    }
                    // Lucide icons — shared across pages
                    if (id.includes('node_modules/lucide-react')) {
                        return 'icons-vendor';
                    }
                    // Vite will naturally code-split the rest!
                },
            },
        },
        chunkSizeWarningLimit: 1000,
    }
});