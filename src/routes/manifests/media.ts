import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const mediaApp: OmniverseApp = {
	id: 'media-render',
	name: 'Cloud Render Pipeline',
	category: 'Media',
	description: 'VFX job queue monitoring for 8K video rendering farms.',
	icon: '🎬',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-media',
			type: SduiElementType.Blade,
			properties: { title: 'Job Node #4A9', subtitle: 'Project: Project Titan', width: 'large' },
			children: [
				{
					id: 'media-alert',
					type: SduiElementType.Alert,
					properties: {
						type: 'warning',
						title: 'Frame Dropped',
						message: 'Frame 49,211 failed hash check. Retrying on Shard 7.'
					}
				},
				{
					id: 'media-btn',
					type: SduiElementType.Button,
					properties: { label: 'Abort Render Job', action: { type: 'dispatch' } }
				}
			]
		}
	}
};
