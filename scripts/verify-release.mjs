import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const lockfile = readFileSync(new URL('../pnpm-lock.yaml', import.meta.url), 'utf8');
const tag = process.argv[2] ?? process.env.GITHUB_REF_NAME;

assert.match(manifest.version, /^\d+\.\d+\.\d+$/, 'Stable release version required');
assert.equal(
	manifest.dependencies['@slashand/sdui-blade-core'],
	manifest.version,
	'Svelte must pin the matching Core release'
);
const lockedCore = lockfile.match(
	/^ {6}'@slashand\/sdui-blade-core':\r?\n {8}specifier: ([^\r\n]+)\r?\n {8}version: ([^\r\n]+)/m
);
assert.equal(lockedCore?.[1], manifest.version, 'Core lockfile specifier must match the release');
assert.equal(lockedCore?.[2], manifest.version, 'Core lockfile version must match the release');

if (tag === '--local') {
	const packageUrl = `https://registry.npmjs.org/${encodeURIComponent(manifest.name)}/${encodeURIComponent(manifest.version)}`;
	const response = await fetch(packageUrl, {
		headers: { 'cache-control': 'no-cache' },
		signal: AbortSignal.timeout(10_000)
	});
	if (response.status === 200) {
		throw new Error(
			`${manifest.name}@${manifest.version} is already published; choose a new version.`
		);
	}
	if (response.status !== 404) {
		throw new Error(`Could not verify npm version availability (HTTP ${response.status}).`);
	}
	console.info(`Verified Svelte ${manifest.version} is unpublished and pins matching Core.`);
} else {
	assert.equal(tag, `v${manifest.version}`, 'GitHub release tag must match the package version');
	console.info(`Verified Svelte release identity ${tag} and Core dependency.`);
}
