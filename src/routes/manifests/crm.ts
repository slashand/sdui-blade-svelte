import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const crmApp: OmniverseApp = {
	id: 'crm-sales',
	name: 'Enterprise CRM Pipeline',
	category: 'Sales',
	description:
		'Multi-region opportunity tracker with forecasted revenue grids and account pivoting.',
	icon: '📈',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-crm',
			type: SduiElementType.Blade,
			properties: { title: 'Q3 Deal Pipeline', subtitle: 'Region: EMEA North', width: 'xlarge' },
			children: [
				{
					id: 'crm-grid',
					type: SduiElementType.Grid,
					properties: { columns: 3, gap: 4 },
					children: [
						{
							id: 'crm-badge-1',
							type: SduiElementType.StatusBadge,
							properties: { status: 'success', text: 'Won: $14.2M' }
						},
						{
							id: 'crm-badge-2',
							type: SduiElementType.StatusBadge,
							properties: { status: 'warning', text: 'Pipeline: $38.5M' }
						},
						{
							id: 'crm-badge-3',
							type: SduiElementType.StatusBadge,
							properties: { status: 'info', text: 'Active Reps: 14' }
						}
					]
				},
				{
					id: 'crm-section',
					type: SduiElementType.Section,
					properties: { title: 'High-Probability Opportunities' },
					children: [
						{
							id: 'crm-datagrid',
							type: SduiElementType.DataGrid,
							properties: {
								columns: [
									{ key: 'client', name: 'Account' },
									{ key: 'stage', name: 'Stage' },
									{ key: 'val', name: 'Value ($)' }
								],
								rows: [
									{ client: 'Acme Corp', stage: 'Negotiation', val: '1,250,000' },
									{ client: 'GlobalNet', stage: 'Discovery', val: '450,000' },
									{ client: 'Stark Industries', stage: 'Contract Sent', val: '8,900,000' },
									{ client: 'Wayne Enterprises', stage: 'Procurement', val: '2,100,000' }
								]
							}
						}
					]
				}
			]
		}
	}
};
