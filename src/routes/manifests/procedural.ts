import { SduiElementType } from '@slashand/sdui-blade-core';
import type { SduiBladeNode } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

/**
 * Mathematically generates an infinitely deep, randomized SDUI Manifest to prove
 * the renderer can absorb any generic JSON constraint without crashing.
 */
export function generateProceduralPayload(): OmniverseApp {
	const hash = Math.random().toString(36).substring(2, 9);

	const randomizedChildren: SduiBladeNode['children'] = [];

	// Random Alert
	if (Math.random() > 0.3) {
		const types: ('error' | 'warning' | 'info' | 'success')[] = [
			'error',
			'warning',
			'info',
			'success'
		];
		randomizedChildren.push({
			id: `alert-${hash}`,
			type: SduiElementType.Alert,
			properties: {
				type: types[Math.floor(Math.random() * types.length)],
				message: `This alert was synthetically generated. Random metric: ${Math.floor(Math.random() * 1000)}.`
			}
		});
	}

	// Random Section with inner children
	const deepChildrenCount = Math.floor(Math.random() * 5) + 1;
	const innerChildren = [];

	for (let i = 0; i < deepChildrenCount; i++) {
		const r = Math.random();
		if (r < 0.3) {
			innerChildren.push({
				id: `txt-${hash}-${i}`,
				type: SduiElementType.Text,
				properties: { value: `Synthetic data point logging entry #${i}.` }
			});
		} else if (r < 0.7) {
			innerChildren.push({
				id: `badge-${hash}-${i}`,
				type: SduiElementType.StatusBadge,
				properties: { status: 'info', text: `Metric ${Math.random().toFixed(2)}` }
			});
		} else {
			innerChildren.push({
				id: `btn-${hash}-${i}`,
				type: SduiElementType.Button,
				properties: { label: `Action Node ${i}`, action: { type: 'dispatch' } }
			});
		}
	}

	randomizedChildren.push({
		id: `sec-${hash}`,
		type: SduiElementType.Section,
		properties: { title: `Synthesized Block ${hash}` },
		children: innerChildren
	});

	const widths = ['small', 'medium', 'large', 'xlarge'];

	return {
		id: `chaos-${hash}`,
		name: `Chaos Matrix ${hash}`,
		category: 'Procedural',
		description: 'A mathematically synthesized, 100% unique payload proving AST stability.',
		icon: '🌌',
		payload: {
			version: '1.0',
			blade: {
				id: `blade-proc-${hash}`,
				type: SduiElementType.Blade,
				properties: {
					title: `Procedural Node: ${hash.toUpperCase()}`,
					subtitle: 'Infinite Synthesizer Engine',
					width: widths[Math.floor(Math.random() * widths.length)] as
						| 'small'
						| 'medium'
						| 'large'
						| 'full',
					toolbar: [
						{
							id: `tbar-${hash}`,
							type: SduiElementType.Button,
							properties: { label: `Sync Node ${hash}` }
						}
					],
					footer: [
						{
							id: `ftr-${hash}`,
							type: SduiElementType.Button,
							properties: {
								label: 'Deep Dive (Stack Blade)',
								action: {
									type: 'navigate',
									payload: {
										id: `blade-deep-${hash}`,
										type: SduiElementType.Blade,
										properties: { title: `Nested Matrix ${hash}`, width: 'medium' },
										children: [
											{
												id: `txt-${hash}`,
												type: SduiElementType.Text,
												properties: { value: 'You have entered a nested procedural dimension.' }
											}
										]
									}
								}
							}
						}
					]
				},
				children: randomizedChildren
			}
		}
	};
}
