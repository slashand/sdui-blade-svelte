import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const retailApp: OmniverseApp = {
	id: 'retail-pos',
	name: 'Point of Sale (POS)',
	category: 'Retail',
	description: 'Tablet-optimized transaction terminal with heavy invoke buttons.',
	icon: '🛒',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-pos',
			type: SduiElementType.Blade,
			properties: { title: 'Register 14', subtitle: 'Cashier: J. Smith', width: 'medium' },
			children: [
				{
					id: 'pos-alert',
					type: SduiElementType.Alert,
					properties: {
						type: 'success',
						title: 'Gateway Active',
						message: 'Stripe Terminal is connected.'
					}
				},
				{
					id: 'pos-btn',
					type: SduiElementType.Button,
					properties: { label: 'Charge $42.50', action: { type: 'dispatch' } }
				}
			]
		}
	}
};
