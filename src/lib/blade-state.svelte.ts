import { createSduiBladeStore, type BladeState, type SduiBlade } from '@slashand/sdui-blade-core';

/**
 * [STATE_ENGINE]
 * [SduiBladeEngine]
 * 
 * Svelte 5 reactive wrapper over the framework-agnostic SDUI Blade Zustand store.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Hydrates and synchronizes Zustand state into Svelte 5 runes.
 * 2. Provides derived state for layout calculations.
 * 3. Exposes strongly-typed methods for manipulating the blade stack.
 * 
 * DESIGN PATTERN: [REACTIVE ADAPTER / SINGLETON]
 * 
 * file: src/lib/blade-state.svelte.ts
 */

/**
 * Interface representing the minimal Zustand store methods needed by the Svelte adapter.
 */
export interface MinimalStore {
	getState: () => BladeState;
	subscribe: (listener: (state: BladeState, prevState: BladeState) => void) => () => void;
}

/**
 * Singleton instance of the framework-agnostic Zustand store.
 * Used as the absolute source of truth for blade state.
 */
export const bladeStore: MinimalStore = createSduiBladeStore() as unknown as MinimalStore;

/**
 * Svelte 5 adapter class that syncs with the underlying Zustand store.
 * Wraps state in Runes for native Svelte reactivity.
 */
export class SduiBladeEngine {
	/**
	 * Native Svelte 5 reactive array driven by the Zustand store.
	 * Represents the current stack of open blades.
	 */
	activeBlades = $state<BladeState['activeBlades']>([]);

	/**
	 * Derived mathematical property representing the total number of open blades.
	 */
	totalBlades = $derived(this.activeBlades.length);

	/**
	 * Derived property indicating if there are multiple blades open (e.g. for cascading offsets).
	 */
	hasMultiple = $derived(this.activeBlades.length > 1);

	constructor() {
		// Hydrate initial state
		this.activeBlades = bladeStore.getState().activeBlades;

		// Subscribe to Zustand mutations and sync them into the Svelte 5 Rune
		bladeStore.subscribe((state) => {
			this.activeBlades = state.activeBlades;
		});
	}

	/**
	 * Opens a new blade and appends it to the stack.
	 * @param {SduiBlade} blade The blade payload to open.
	 */
	openBlade(blade: SduiBlade) {
		bladeStore.getState().openBlade(blade);
	}

	/**
	 * Sets the base application blade (clearing any existing stack).
	 * @param {SduiBlade} blade The root blade payload.
	 */
	setAppBlade(blade: SduiBlade) {
		bladeStore.getState().setAppBlade(blade);
	}

	/**
	 * Closes a specific blade by ID.
	 * @param {string} id The ID of the blade to close.
	 * @param {boolean} [force] Force close bypassing validation if needed.
	 */
	closeBlade(id: string, force?: boolean) {
		bladeStore.getState().closeBlade(id, force);
	}

	/**
	 * Closes the top-most blade in the stack.
	 * @param {boolean} [force] Force close bypassing validation if needed.
	 */
	closeTopBlade(force?: boolean) {
		bladeStore.getState().closeTopBlade(force);
	}

	/**
	 * Closes all blades in the stack.
	 * @param {boolean} [force] Force close bypassing validation if needed.
	 */
	closeAllBlades(force?: boolean) {
		bladeStore.getState().closeAllBlades(force);
	}
}

/**
 * Global singleton instance of the SduiBladeEngine for the Svelte library.
 * This is the primary export consumed by applications.
 */
export const sduiEngine = new SduiBladeEngine();
