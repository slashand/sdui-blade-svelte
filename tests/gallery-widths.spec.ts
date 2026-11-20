import { expect, test } from '@playwright/test';

const topologyWidths = [Infinity, 2745, 2475, 2205, 1935, 1665, 1395, 1125, 855, 585, 315, 265];

test('every application card opens a full workspace and closes cleanly', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const tiles = page.locator('main .sdui-matrix-tile');
	await expect(tiles).toHaveCount(12);
	const restingStyle = await tiles.evaluateAll((cards) =>
		cards.slice(0, 2).map((card) => {
			const style = getComputedStyle(card);
			return [style.backgroundColor, style.borderColor, style.boxShadow];
		})
	);
	expect(restingStyle[0]).toEqual(restingStyle[1]);
	const workspace = (await page.locator('.sdui-work-surface').boundingBox())!;
	for (let index = 0; index < 12; index++) {
		await tiles.nth(index).click();
		const panel = page.locator('.blade-host-panel-div');
		await expect(panel).toHaveCount(1);
		await expect
			.poll(async () => (await panel.boundingBox())!.width)
			.toBeCloseTo(workspace.width, 0);
		await panel.locator('.blade-close-button').click();
		await expect(panel).toHaveCount(0);
	}
});

test('last opened card stays selected after close and selection moves to another card', async ({
	page
}) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	const tiles = page.locator('main .sdui-matrix-tile');
	await expect(page.locator('main .sdui-matrix-tile[data-selected="true"]')).toHaveCount(0);
	await expect(tiles.first()).toHaveAttribute('aria-pressed', 'false');
	await tiles.first().click();
	await expect(tiles.first()).toHaveAttribute('data-selected', 'true');
	await expect(tiles.first()).toHaveAttribute('aria-pressed', 'true');
	await page.locator('.blade-close-button').click();
	await expect(page.locator('.blade-host-panel-div')).toHaveCount(0);
	await expect(tiles.first()).toHaveAttribute('data-selected', 'true');
	await tiles.nth(1).click();
	await expect(tiles.first()).toHaveAttribute('data-selected', 'false');
	await expect(tiles.first()).toHaveAttribute('aria-pressed', 'false');
	await expect(tiles.nth(1)).toHaveAttribute('data-selected', 'true');
	await expect(tiles.nth(1)).toHaveAttribute('aria-pressed', 'true');
	await page.locator('.blade-close-button').click();
	await expect(page.locator('.blade-host-panel-div')).toHaveCount(0);
	await expect(tiles.nth(1)).toHaveAttribute('data-selected', 'true');
});

test('every topology child opens at its declared maximum width', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.locator('main .sdui-matrix-tile').nth(10).click();
	const workspace = (await page.locator('.sdui-work-surface').boundingBox())!;
	for (let index = 0; index < topologyWidths.length; index++) {
		const panels = page.locator('.blade-host-panel-div');
		await expect(panels).toHaveCount(index + 1);
		await expect
			.poll(async () => (await panels.last().boundingBox())!.width)
			.toBeCloseTo(Math.min(workspace.width, topologyWidths[index]), 0);
		if (index < topologyWidths.length - 1) {
			await panels
				.last()
				.getByRole('button', { name: /^Spawn / })
				.click();
		}
	}
});

test('Russian Doll reaches each child', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.locator('main .sdui-matrix-tile').nth(11).click();
	for (let index = 0; index < 8; index++) {
		const panels = page.locator('.blade-host-panel-div');
		await expect(panels).toHaveCount(index + 1);
		await panels
			.last()
			.getByRole('button', { name: /^Load Next Phase:/ })
			.click();
	}
	await expect(page.locator('.blade-host-panel-div')).toHaveCount(9);
});

test('procedural toolbar, nested and close actions keep their semantics', async ({ page }) => {
	await page.goto('/');
	await page.waitForLoadState('networkidle');
	await page.locator('main .sdui-matrix-tile').first().click();
	const root = page.locator('.blade-host-panel-div').last();
	await root.getByRole('button', { name: /^Sync Node / }).click();
	await expect(
		root.getByText('Demo action emitted; no backend call. The blade remains open.', { exact: true })
	).toBeVisible();
	await root.getByRole('button', { name: 'Deep Dive (Stack Blade)' }).click();
	await expect(page.locator('.blade-host-panel-div')).toHaveCount(2);
	const child = page.locator('.blade-host-panel-div').last();
	await expect
		.poll(async () => (await child.boundingBox())!.width)
		.toBeCloseTo(Math.min(585, (await page.locator('.sdui-work-surface').boundingBox())!.width), 0);
	await child.locator('.blade-close-button').click();
	await expect(page.locator('.blade-host-panel-div')).toHaveCount(1);
	await root.getByRole('button', { name: 'Close workspace' }).click();
	await expect(page.locator('.blade-host-panel-div')).toHaveCount(0);
});
