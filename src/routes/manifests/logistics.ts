import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const logisticsApp: OmniverseApp = {
	id: 'logistics-sc',
	name: 'Global Supply Chain',
	category: 'Logistics',
	description: 'Tracking manifest for international container shipping and fleet route mapping.',
	icon: '🚢',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-logistics-root',
			type: SduiElementType.Blade,
			properties: {
				title: 'Vessel: EVER GIVEN II',
				subtitle: 'Current Location: Suez Canal Approach',
				width: 'full'
			},
			children: [
				{
					id: 'logistics-map',
					type: SduiElementType.ExtensionMount,
					properties: { mountPoint: 'logistics_live_map' }
				},
				{
					id: 'logistics-grid',
					type: SduiElementType.Grid,
					properties: { columns: 3, gap: 4 },
					children: [
						{
							id: 'log-1',
							type: SduiElementType.StatusBadge,
							properties: { status: 'info', text: 'Active Routes: 1,402' }
						},
						{
							id: 'log-2',
							type: SduiElementType.StatusBadge,
							properties: { status: 'error', text: 'Delayed: 38' }
						},
						{
							id: 'log-3',
							type: SduiElementType.StatusBadge,
							properties: { status: 'success', text: 'Delivered (24h): 8,900' }
						}
					]
				},
				{
					id: 'logistics-section',
					type: SduiElementType.Section,
					properties: { title: 'Vessel Tracking Matrix' },
					children: [
						{
							id: 'logistics-datagrid',
							type: SduiElementType.DataGrid,
							properties: {
								columns: [
									{ key: 'vessel', name: 'Vessel ID' },
									{ key: 'origin', name: 'Origin' },
									{ key: 'dest', name: 'Destination' },
									{ key: 'eta', name: 'ETA' }
								],
								rows: [
									{
										vessel: 'MSC Isabella',
										origin: 'Shanghai',
										dest: 'Los Angeles',
										eta: '2 Days'
									},
									{
										vessel: 'Ever Given',
										origin: 'Rotterdam',
										dest: 'Felixstowe',
										eta: 'Delayed (4h)'
									},
									{
										vessel: 'Maersk Mc-Kinney',
										origin: 'Singapore',
										dest: 'Hamburg',
										eta: 'On Time'
									}
								]
							}
						}
					]
				}
			]
		}
	}
};
