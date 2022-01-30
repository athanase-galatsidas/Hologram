import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	server: {
		https: true,
		strictPort: true,
		port: 8080,
		host: '0.0.0.0', // allow external host
	},
	plugins: [
		vue(),
		VitePWA({
			mode: 'development',
			base: '/',
			srcDir: 'src',
			filename: 'sw.ts',
			includeAssets: ['/favicon.png'],
			strategies: 'injectManifest',
			manifest: {
				name: 'HoloGram',
				short_name: 'HoloGram',
				theme_color: '#ffffff',
				start_url: '/',
				display: 'standalone',
				background_color: '#ffffff',
				icons: [
					{
						src: 'icon-192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/icon-512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'icon-512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
		}),
	],
});
