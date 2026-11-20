import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	testDir: './',
	testMatch: 'gallery-widths.spec.ts',
	workers: 1,
	timeout: 60000,
	use: { baseURL: 'http://127.0.0.1:49372', headless: true },
	projects: [
		{ name: 'desktop', use: { viewport: { width: 1718, height: 900 } } },
		{ name: 'mobile', use: { viewport: { width: 390, height: 844 }, hasTouch: true } }
	],
	webServer: {
		command: 'npm run dev -- --host 127.0.0.1 --port 49372 --strictPort',
		cwd: fileURLToPath(new URL('../', import.meta.url)),
		url: 'http://127.0.0.1:49372',
		timeout: 120000,
		reuseExistingServer: false
	}
});
