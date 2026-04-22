import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const cyberApp: OmniverseApp = {
	id: 'cyber-soc',
	name: 'SOC Firewall Console',
	category: 'CyberSecurity',
	description: 'Zero-trust network intrusion orchestrator with deep JSON log interrogation.',
	icon: '🛡️',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-sec-root',
			type: SduiElementType.Blade,
			properties: {
				title: 'Intrusion Detection: Node Alpha',
				subtitle: 'Active Threats: 14',
				width: 'medium'
			},
			children: [
				{
					id: 'cyber-grid',
					type: SduiElementType.Grid,
					properties: { columns: 2, gap: 4 },
					children: [
						{
							id: 'cyber-alert-1',
							type: SduiElementType.Alert,
							properties: {
								type: 'error',
								title: 'CRITICAL BREACH SEV-1',
								message: 'Multiple unauthorized lateral movements detected in VPC Subnet-B.'
							}
						},
						{
							id: 'cyber-alert-2',
							type: SduiElementType.Alert,
							properties: {
								type: 'warning',
								title: 'Anomaly',
								message: 'Unusual outbound egress spike (4.2 TB) to unverified IP range.'
							}
						}
					]
				},
				{
					id: 'cyber-section',
					type: SduiElementType.Section,
					properties: { title: 'Threat Vector Topography' },
					children: [
						{
							id: 'cyber-datagrid',
							type: SduiElementType.DataGrid,
							properties: {
								columns: [
									{ key: 'ip', name: 'Source IP' },
									{ key: 'vector', name: 'Vector' },
									{ key: 'status', name: 'Status' }
								],
								rows: [
									{ ip: '192.168.1.105', vector: 'SQL Injection', status: 'Blocked' },
									{ ip: '10.0.0.42', vector: 'Ransomware Encrypt', status: 'ACTIVE SEV-1' },
									{ ip: 'Unknown', vector: 'DDoS Mitigation', status: 'Absorbing' }
								]
							}
						},
						{
							id: 'cyber-row',
							type: SduiElementType.Row,
							properties: { justify: 'end', gap: 3 },
							children: [
								{
									id: 'cyber-btn-lock',
									type: SduiElementType.Button,
									properties: { label: 'Initiate VPC Lockdown' }
								},
								{
									id: 'cyber-btn-pcap',
									type: SduiElementType.Button,
									properties: { label: 'Export PCAP' }
								}
							]
						}
					]
				}
			]
		}
	}
};
