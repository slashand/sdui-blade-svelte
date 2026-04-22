import { SduiElementType, type SduiBladeNode } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';
import { fintechApp } from './fintech';
import { healthApp } from './health';
import { logisticsApp } from './logistics';
import { cyberApp } from './cyber';
import { aiApp } from './ai';
import { crmApp } from './crm';
import { mediaApp } from './media';
import { retailApp } from './retail';
import { hrApp } from './hr';

const apps = [
	fintechApp,
	healthApp,
	logisticsApp,
	cyberApp,
	aiApp,
	crmApp,
	mediaApp,
	retailApp,
	hrApp
];

// Decreasing widths array to ensure no blade is covered completely by an equal-sized child
const decreasingWidths = [
	'full',
	'7xl',
	'6xl',
	'5xl',
	'4xl',
	'3xl',
	'2xl',
	'xl',
	'large',
	'medium',
	'small',
	'menu'
];

function buildRussianDollChain(): SduiBladeNode {
	// Deep clone all payloads so we don't mutate the originals
	const clonedApps = apps.map(
		(app) => JSON.parse(JSON.stringify(app.payload.blade)) as SduiBladeNode
	);

	// Start from the innermost blade and build outwards
	for (let i = clonedApps.length - 2; i >= 0; i--) {
		const currentBlade = clonedApps[i];
		const nextBlade = clonedApps[i + 1];

		// Ensure strictly decreasing widths
		const currentWidth = decreasingWidths[i];
		const nextWidth = decreasingWidths[i + 1];

		if (!currentBlade.properties) currentBlade.properties = { title: 'Nested Blade' };
		if (!nextBlade.properties) nextBlade.properties = { title: 'Nested Blade' };

		currentBlade.properties.width = currentWidth as 'full';
		nextBlade.properties.width = nextWidth as 'full';

		// Create a button to open the next blade
		const nextButton = {
			id: `chain-btn-${i}`,
			type: SduiElementType.Button,
			properties: {
				label: `Load Next Phase: ${apps[i + 1].name}`,
				action: {
					type: 'navigate',
					payload: nextBlade
				}
			}
		};

		// Push the button into the current blade's children so it renders dynamically in DashboardBlade
		if (!currentBlade.children) currentBlade.children = [];

		// Insert the button at the beginning of children so it's clearly visible
		currentBlade.children.unshift(nextButton);
	}

	// Make sure the first blade gets the first width
	if (clonedApps[0].properties) {
		clonedApps[0].properties.width = decreasingWidths[0] as 'full';
	}

	return clonedApps[0];
}

export const allBladesApp: OmniverseApp = {
	id: 'russian-doll',
	name: 'Russian Doll Protocol',
	category: 'Showcase',
	description:
		'A recursive cascade proving that SDUI spatial orchestration can stack distinct horizontal layers across all geometric widths, linking all matrix apps together.',
	icon: '🪆',
	payload: {
		version: '1.0',
		blade: buildRussianDollChain()
	}
};
