import type { SduiBladeNode } from '@slashand/sdui-blade-core';

export interface OmniverseApp {
	id: string;
	name: string;
	category: string;
	description: string;
	icon: string;
	payload: {
		version: string;
		blade: SduiBladeNode;
	};
}
