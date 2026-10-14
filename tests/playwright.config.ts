import { defineConfig } from '@playwright/test';
import { fileURLToPath } from 'node:url';

/** Real browser qualification of the built package, including native SDK chrome. */
export default defineConfig({
	testDir: './',
	testMatch: 'guarded-close.spec.ts',
	workers: 1,
	timeout: 30000,
	use: { baseURL: 'http://127.0.0.1:49371', headless: true },
	projects: [
		{ name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
		{ name: 'mobile', use: { viewport: { width: 390, height: 844 }, hasTouch: true } }
	],
	webServer: {
		command: 'pnpm exec vite --configLoader runner --host 127.0.0.1 --port 49371 --strictPort',
		cwd: fileURLToPath(new URL('./fixtures/guarded-close', import.meta.url)),
		url: 'http://127.0.0.1:49371',
		timeout: 120000,
		reuseExistingServer: false
	}
});
