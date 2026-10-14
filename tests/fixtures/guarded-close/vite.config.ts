import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

/** Qualify the built SDK rather than copying its component implementation. */
export default defineConfig({
	envDir: false,
	envPrefix: [],
	plugins: [sveltekit(), tailwindcss()],
	ssr: { noExternal: ['@slashand/sdui-blade-core', '@slashand/sdui-blade-svelte'] },
	resolve: {
		alias: [
			{
				find: /^@slashand\/sdui-blade-svelte$/,
				replacement: fileURLToPath(new URL('../../../dist/index.js', import.meta.url))
			}
		]
	},
	server: { fs: { allow: [fileURLToPath(new URL('../../../', import.meta.url))] } }
});
