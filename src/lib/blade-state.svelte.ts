import { createSduiBladeStore, type BladeState, type SduiBlade } from '@slashand/sdui-blade-core';

// Initialize the framework-agnostic Zustand store
export const bladeStore = createSduiBladeStore();

export class SduiBladeEngine {
	// Native Svelte 5 reactive array driven by the Zustand store
	activeBlades = $state<BladeState['activeBlades']>([]);

	// Derived mathematical properties for layout engines
	totalBlades = $derived(this.activeBlades.length);
	hasMultiple = $derived(this.activeBlades.length > 1);

	constructor() {
		// Hydrate initial state
		this.activeBlades = bladeStore.getState().activeBlades;

		// Subscribe to Zustand mutations and sync them into the Svelte 5 Rune
		bladeStore.subscribe((state) => {
			this.activeBlades = state.activeBlades;
		});
	}

	openBlade(blade: SduiBlade) {
		bladeStore.getState().openBlade(blade);
	}

	setAppBlade(blade: SduiBlade) {
		bladeStore.getState().setAppBlade(blade);
	}

	closeBlade(id: string, force?: boolean) {
		bladeStore.getState().closeBlade(id, force);
	}

	closeTopBlade(force?: boolean) {
		bladeStore.getState().closeTopBlade(force);
	}

	closeAllBlades(force?: boolean) {
		bladeStore.getState().closeAllBlades(force);
	}
}

// Global singleton instance for the Svelte library
export const sduiEngine = new SduiBladeEngine();
