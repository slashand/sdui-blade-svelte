import { test, expect } from '@playwright/test';

test('native X is borderless and clear at rest, red on hover and consumer-controlled', async ({
	page
}) => {
	await page.goto('/');
	const close = page.locator('.blade-close-button');
	await expect(close).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
	await expect(close).toHaveCSS('border-top-width', '0px');
	await close.hover();
	await expect(close).toHaveCSS('background-color', 'rgb(196, 43, 28)');
	for (const side of ['top', 'right', 'bottom', 'left']) {
		await expect(close).toHaveCSS(`border-${side}-width`, '0px');
	}
	await expect(close).toHaveCSS('color', 'rgb(255, 255, 255)');
	await page.mouse.move(0, 0);
	await close.evaluate((button) => {
		const parent = button.closest('.blade-wrapper-div') as HTMLElement;
		parent.style.setProperty('--sdui-close-background', '#075985');
		parent.style.setProperty('--sdui-close-hover-background', '#0c4a6e');
		parent.style.setProperty('--sdui-close-color', '#f0f9ff');
	});
	await expect(close).toHaveCSS('background-color', 'rgb(7, 89, 133)');
	await expect(close).toHaveCSS('color', 'rgb(240, 249, 255)');
	await close.hover();
	await expect(close).toHaveCSS('background-color', 'rgb(12, 74, 110)');
});

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
	expect(['flex-start', 'flow-start']).toContain(
		await footer.evaluate((element) => getComputedStyle(element).justifyContent)
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
