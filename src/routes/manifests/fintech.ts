import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const fintechApp: OmniverseApp = {
	id: 'fintech-crypto',
	name: 'Crypto Exchange Desk',
	category: 'FinTech',
	description:
		'High-frequency trading interface with live spread alerts and deep portfolio sections.',
	icon: '🏦',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-crypto-root',
			type: SduiElementType.Blade,
			properties: {
				title: 'Trading Desk: BTC/USD',
				subtitle: 'Institutional Clearing Node',
				width: 'xlarge',
				toolbar: [
					{
						id: 'crypto-tbar-1',
						type: SduiElementType.Button,
						properties: { label: 'Export Tick Data', action: { type: 'dispatch' } }
					}
				],
				footer: [
					{
						id: 'crypto-ftr-1',
						type: SduiElementType.Button,
						properties: {
							label: 'Analyze Order Book (Push Blade)',
							action: {
								type: 'navigate',
								payload: {
									id: 'blade-crypto-deep',
									type: SduiElementType.Blade,
									properties: {
										title: 'Deep Order Book',
										subtitle: 'Aggregated Liquidity Clusters',
										width: 'medium'
									},
									children: [
										{
											id: 'deep-alert-1',
											type: SduiElementType.Alert,
											properties: {
												type: 'info',
												title: 'Secure WebSocket',
												message: 'Streaming L2 order book data at 12ms ping.'
											}
										}
									]
								}
							}
						}
					}
				]
			},
			children: [
				{
					id: 'crypto-chart',
					type: SduiElementType.ExtensionMount,
					properties: { mountPoint: 'crypto_chart_tv' }
				},
				{
					id: 'crypto-alert',
					type: SduiElementType.Alert,
					properties: {
						type: 'warning',
						title: 'Volatility Spike Detected',
						message: 'Spread exceeds 400 BPS. Leverage strictly capped at 5x.'
					}
				},
				{
					id: 'crypto-metrics',
					type: SduiElementType.Grid,
					properties: { columns: 3, gap: 4 },
					children: [
						{
							id: 'cm-1',
							type: SduiElementType.StatusBadge,
							properties: { status: 'info', text: '24h Vol: $4.2B' }
						},
						{
							id: 'cm-2',
							type: SduiElementType.StatusBadge,
							properties: { status: 'success', text: 'Funding: 0.01%' }
						},
						{
							id: 'cm-3',
							type: SduiElementType.StatusBadge,
							properties: { status: 'error', text: 'Index: $64,192' }
						}
					]
				},
				{
					id: 'crypto-pivot',
					type: SduiElementType.Pivot,
					properties: {
						items: [
							{ title: 'Live Order Book', targetId: 'tab-book' },
							{ title: 'Account Portfolio', targetId: 'tab-port' }
						]
					}
				},
				{
					id: 'crypto-section',
					type: SduiElementType.Section,
					properties: { title: 'Level 2 Liquidity' },
					children: [
						{
							id: 'crypto-grid',
							type: SduiElementType.DataGrid,
							properties: {
								columns: [
									{ key: 'price', name: 'Price (USD)' },
									{ key: 'amount', name: 'Amount (BTC)' },
									{ key: 'total', name: 'Total (USD)' }
								],
								rows: [
									{ price: '64,215.50', amount: '1.2405', total: '$79,659.32' },
									{ price: '64,210.00', amount: '14.500', total: '$931,045.00' },
									{ price: '64,198.25', amount: '3.1142', total: '$199,936.88' },
									{ price: '64,190.00', amount: '88.021', total: '$5,650,067.99' }
								]
							}
						}
					]
				}
			]
		}
	}
};
