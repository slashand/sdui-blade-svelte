import { test, expect } from '@playwright/test';

test('native X preserves the consumer confirmation and localized label', async ({ page }) => {
	await page.goto('/');
	const close = page.getByRole('button', { name: 'Cerrar panel', exact: true });
	await expect(close).toBeVisible();
	await expect(page.locator('.blade-close-icon-svg')).toHaveCount(1);
	await close.click();
	await expect(page.getByRole('alertdialog')).toBeVisible();
	await expect(page.locator('.blade-wrapper-div')).toHaveCount(1);
	await page.getByRole('button', { name: 'Keep editing' }).click();
	await close.click();
	await page.getByRole('button', { name: 'Discard and close' }).click();
	await expect(page.locator('.blade-wrapper-div')).toHaveCount(0);
});

test('busy work disables native close without calling the handler', async ({ page }) => {
	await page.goto('/');
	await page.locator('.fixture-block').click();
	await expect(page.locator('.blade-close-button')).toBeDisabled();
	await expect(page.locator('.fixture-request-count')).toHaveText('0');
	await page.locator('.fixture-block').click();
	await page.locator('.blade-close-button').click();
	await expect(page.locator('.fixture-request-count')).toHaveText('1');
});

test('async close rejects safely, unlocks for retry and never closes twice', async ({ page }) => {
	await page.goto('/?mode=async');
	await page.locator('.blade-close-button').click();
	await expect(page.locator('.blade-close-button')).toBeDisabled();
	await expect(page.locator('.blade-close-button')).toHaveAttribute('aria-busy', 'true');
	await page
		.locator('.blade-close-button')
		.evaluate((button) => (button as HTMLButtonElement).click());
	await expect(page.locator('.fixture-request-count')).toHaveText('1');
	await page.locator('.fixture-reject').click();
	await expect(page.getByRole('alert')).toHaveText('No se pudo cerrar. Inténtalo de nuevo.');
	await expect(page.locator('.blade-close-button')).toBeEnabled();
	await page.locator('.blade-close-button').click();
	await expect(page.locator('.fixture-request-count')).toHaveText('2');
	await page.locator('.fixture-finish').click();
	await expect(page.locator('.blade-wrapper-div')).toHaveCount(0);
});

test('legacy target and top close still use the core engine', async ({ page }) => {
	for (const query of ['?mode=legacy', '?mode=legacy&top=1']) {
		await page.goto('/' + query);
		await page.locator('.blade-close-button').click();
		await expect(page.locator('.blade-wrapper-div')).toHaveCount(0);
	}
});

test('footer defaults left and stays fixed through body scroll and header resizing', async ({
	page
}) => {
	await page.goto('/');
	const footer = page.locator('.blade-footer-element');
	await expect(footer).toBeVisible();
	expect(await footer.evaluate((element) => getComputedStyle(element).justifyContent)).toBe(
		'flex-start'
	);
	const before = (await footer.boundingBox())!;
	await page
		.locator('.fixture-body')
		.evaluate((element) => (element.scrollTop = element.scrollHeight));
	expect((await footer.boundingBox())!.y).toBeCloseTo(before.y, 0);
	const position = (await page.locator('.blade-wrapper-div').boundingBox())!.y;
	await page.locator('.fixture-resize').click();
	await expect
		.poll(async () => (await page.locator('.blade-wrapper-div').boundingBox())!.y)
		.toBeGreaterThan(position);
	const first = (await page.locator('.fixture-save').boundingBox())!;
	expect(first.x - before.x).toBeLessThan(24);
});
