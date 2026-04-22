import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const hrApp: OmniverseApp = {
	id: 'hr-payroll',
	name: 'Global Payroll Ledger',
	category: 'Human Resources',
	description: 'Secure ledger for international wire clearing and compliance alerts.',
	icon: '👥',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-payroll',
			type: SduiElementType.Blade,
			properties: {
				title: 'September Execution',
				subtitle: 'Clearance: Pending Level 2',
				width: 'large'
			},
			children: [
				{
					id: 'hr-pivot',
					type: SduiElementType.Pivot,
					properties: {
						items: [
							{ title: 'Pending Approvals', targetId: 'tp' },
							{ title: 'Audit Logs', targetId: 'ta' }
						]
					}
				},
				{
					id: 'hr-btn',
					type: SduiElementType.Button,
					properties: { label: 'Sign Cryptographically', action: { type: 'dispatch' } }
				}
			]
		}
	}
};
