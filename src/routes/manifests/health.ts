import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const healthApp: OmniverseApp = {
	id: 'health-emr',
	name: 'Patient EMR Tracker',
	category: 'Healthcare',
	description: 'Secure medical records dashboard with deeply nested vitals and telemetry badges.',
	icon: '⚕️',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-emr-root',
			type: SduiElementType.Blade,
			properties: {
				title: 'Patient: Doe, John',
				subtitle: 'DOB: 1984-06-12 | MRN: 94811-A',
				width: 'large'
			},
			children: [
				{
					id: 'emr-alert',
					type: SduiElementType.Alert,
					properties: {
						type: 'error',
						title: 'Severe Allergy',
						message: 'Patient is highly allergic to Penicillin. DO NOT ADMINISTER.'
					}
				},
				{
					id: 'emr-vitals',
					type: SduiElementType.Section,
					properties: { title: 'Live Telemetry' },
					children: [
						{
							id: 'emr-grid',
							type: SduiElementType.Grid,
							properties: { columns: 4, gap: 4 },
							children: [
								{
									id: 'emr-badge-1',
									type: SduiElementType.StatusBadge,
									properties: { status: 'success', text: 'HR: 72 BPM' }
								},
								{
									id: 'emr-badge-2',
									type: SduiElementType.StatusBadge,
									properties: { status: 'warning', text: 'SpO2: 94%' }
								},
								{
									id: 'emr-badge-3',
									type: SduiElementType.StatusBadge,
									properties: { status: 'error', text: 'BP: 145/92' }
								},
								{
									id: 'emr-badge-4',
									type: SduiElementType.StatusBadge,
									properties: { status: 'info', text: 'Resp: 16/min' }
								}
							]
						}
					]
				},
				{
					id: 'emr-meds',
					type: SduiElementType.Section,
					properties: { title: 'Active Formulary' },
					children: [
						{
							id: 'emr-med-grid',
							type: SduiElementType.DataGrid,
							properties: {
								columns: [
									{ key: 'drug', name: 'Medication' },
									{ key: 'dose', name: 'Dosage' },
									{ key: 'freq', name: 'Frequency' }
								],
								rows: [
									{ drug: 'Lisinopril', dose: '10mg', freq: 'PO Daily' },
									{ drug: 'Atorvastatin', dose: '40mg', freq: 'PO Nightly' },
									{ drug: 'Metformin', dose: '500mg', freq: 'BID w/ Meals' }
								]
							}
						}
					]
				},
				{
					id: 'emr-btn-row',
					type: SduiElementType.Row,
					properties: { justify: 'end', gap: 3 },
					children: [
						{
							id: 'emr-btn-cc',
							type: SduiElementType.Button,
							properties: { label: 'Request Cardiology Consult' }
						},
						{
							id: 'emr-btn',
							type: SduiElementType.Button,
							properties: {
								label: 'Authorize Epinephrine',
								action: { type: 'api', endpoint: '/med/auth' }
							}
						}
					]
				}
			]
		}
	}
};
