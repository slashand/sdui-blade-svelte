<!--
	/**
	 * [COMPONENT]
	 * [BladeHost]
	 * 
	 * Core orchestration layer for the SDUI Blade engine in Svelte 5.
	 * Resolves blades dynamically from a registry and synchronizes state with the URL.
	 * 
	 * CORE RESPONSIBILITIES:
	 * 1. Reads active blade state and renders recursive overlays.
	 * 2. Provides two-way synchronization between URL search params and bladeStore.
	 * 3. Dynamically calculates header offset via ResizeObserver to ensure spatial parity.
	 * 
	 * DESIGN PATTERN: [PRESENTATION SHELL / STATE SYNCHRONIZER]
	 *
	 * file: src/lib/BladeHost.svelte
	 */
-->
<script lang="ts">
	import { sduiEngine, bladeStore } from './blade-state.svelte';
	import type { Component } from 'svelte';
	import { untrack } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';


	/**
	 * Props for BladeHost.
	 * @property {Record<string, Component>} registry - Map of string types to Svelte components.
	 * @property {boolean} [showBackdrop] - Controls whether a darkened backdrop appears behind open blades.
	 * @property {string|null} [headerSelector] - DOM selector for the header element to calculate dynamic top offset.
	 * @property {boolean} [isAppShell] - Indicates whether the blade host acts as the full-screen application shell.
	 * @property {string} [class] - Optional CSS classes to append to the host container.
	 */
	let {
		registry,
		showBackdrop = false,
		headerSelector = 'header',
		isAppShell = true,
		class: className = '',
		...rest
	}: {
		registry: Record<string, Component<Record<string, unknown>>>;
		showBackdrop?: boolean;
		headerSelector?: string | null;
		isAppShell?: boolean;
		class?: string;
		[key: string]: unknown;
	} = $props();

	/**
	 * Custom transition function to slide a blade in/out from the right.
	 * @param {Element} node The DOM node to animate.
	 * @param {Object} options Transition options including duration.
	 * @returns The CSS animation object.
	 */
	function slideRight(node: Element, { duration = 400 }) {
		return {
			duration,
			css: (t: number) => `transform: translateX(${(1 - t) * 100}%);`
		};
	}

	/**
	 * Calculates the CSS width for a blade based on its width property.
	 * Fallback mapped values default to Azure Portal-style breakpoints.
	 * 
	 * Modifying this affects all dynamic blade sizing across the platform.
	 * @param {unknown} widthProp The width value provided in the blade's payload (e.g., 'medium', '400', or 'full').
	 * @returns {string} A strictly formatted CSS string (e.g., 'var(--sdui-blade-w-medium, 585px)').
	 */
	function getBladeWidth(widthProp: unknown): string {
		if (!widthProp) return '400px';
		if (typeof widthProp === 'number') return `${widthProp}px`;
		const map: Record<string, string> = {
			menu: 'var(--sdui-blade-w-menu, 265px)',
			small: 'var(--sdui-blade-w-small, 315px)',
			medium: 'var(--sdui-blade-w-medium, 585px)',
			large: 'var(--sdui-blade-w-large, 855px)',
			xlarge: 'var(--sdui-blade-w-xlarge, 1125px)',
			xl: 'var(--sdui-blade-w-xl, 1125px)',
			'2xl': 'var(--sdui-blade-w-2xl, 1395px)',
			'3xl': 'var(--sdui-blade-w-3xl, 1665px)',
			'4xl': 'var(--sdui-blade-w-4xl, 1935px)',
			'5xl': 'var(--sdui-blade-w-5xl, 2205px)',
			'6xl': 'var(--sdui-blade-w-6xl, 2475px)',
			'7xl': 'var(--sdui-blade-w-7xl, 2745px)',
			full: '100vw'
		};
		return map[widthProp as string] || String(widthProp);
	}

	/**
	 * Flag indicating if this is the initial render cycle, preventing redundant history pushes.
	 */
	let isFirstRender = true;
	
	/**
	 * Dynamically observed height of the global header to offset the blade host accurately.
	 */
	let headerHeight = $state(0);

	// Header Detection Effect
	$effect(() => {
		if (!headerSelector) {
			headerHeight = 0;
			return;
		}

		const header = document.querySelector(headerSelector) as HTMLElement;
		if (!header) return;

		headerHeight = header.offsetHeight;
		
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === header) {
					headerHeight = (header as HTMLElement).offsetHeight;
				}
			}
		});
		
		observer.observe(header);
		return () => observer.disconnect();
	});

	// --- Two-Way URL/State Synchronization ---

	let lastSyncedBlades = '';

	// 1. URL -> State (Handles Refresh, Back/Forward buttons, internal Links)
	$effect(() => {
		// Reactive dependency on SvelteKit's page store
		const urlBlades = page.url.searchParams.get('blades') || '';
		
		untrack(() => {
			if (urlBlades !== lastSyncedBlades) {
				lastSyncedBlades = urlBlades;
				
				if (urlBlades) {
					const urlIds = urlBlades.split(',');
					const payloadCache = bladeStore.getState().payloadCache;
					
					const newBlades = urlIds.map((id) => {
						const cachedBlade = payloadCache[id];
						return cachedBlade || { id, type: 'Sdui.Container.Blade', properties: {}, children: [] };
					});

					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(bladeStore as any).setState({ activeBlades: newBlades });
				} else {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					(bladeStore as any).setState({ activeBlades: [] });
				}
			}
		});
	});

	// 2. State -> URL (Handles UI Interactions like opening/closing blades)
	$effect(() => {
		// Reactive dependency on the Engine's active blades
		const stateBlades = sduiEngine.activeBlades.map((b) => b.id).join(',');
		
		untrack(() => {
			if (stateBlades !== lastSyncedBlades) {
				lastSyncedBlades = stateBlades;
				
				const newUrl = new URL(window.location.href);
				if (stateBlades) {
					newUrl.searchParams.set('blades', stateBlades);
				} else {
					newUrl.searchParams.delete('blades');
				}

				const targetUrl = `${newUrl.pathname}${newUrl.search}`;
				
				if (isFirstRender) {
					window.history.replaceState(window.history.state, '', targetUrl);
				} else {
					// Use goto instead of pushState for proper history stack navigation
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					goto(targetUrl, { keepFocus: true, noScroll: true, replaceState: false });
				}
			}
			isFirstRender = false;
		});
	});
</script>

<div
	class="blade-host-container-div absolute inset-0 w-full h-full overflow-hidden z-[100] pointer-events-none {className}"
	style:top="{headerHeight}px"
	style:height="calc(100% - {headerHeight}px)"
	{...rest}
>
	{#each sduiEngine.activeBlades as blade, index (blade.id + '-' + index)}
		{@const ResolvedComponent = registry[blade.type]}
		{@const isBaseBlade = isAppShell && index === 0}

		{#if (!isBaseBlade && showBackdrop) || (!isAppShell && showBackdrop)}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<div
				class="blade-host-backdrop-div absolute inset-0 bg-black/50 backdrop-blur-sm z-[0] pointer-events-auto"
				style:z-index={9 + index}
				onclick={() => sduiEngine.closeTopBlade()}
			></div>
		{/if}

		<div
			class="blade-host-layer-div absolute inset-0 pointer-events-none"
			style:background-color={isBaseBlade ? 'var(--th-panel-bg)' : 'transparent'}
			style:z-index={isBaseBlade ? 90 : 100 + index}
			in:slideRight={{ duration: 400 }}
			out:slideRight={{ duration: 400 }}
		>
			<div
				class="blade-host-panel-div absolute top-0 right-0 h-full pointer-events-auto shadow-2xl border-l border-[var(--th-border)] bg-[var(--th-panel-bg)] flex flex-col"
				style:width="100%"
				style:max-width={isBaseBlade ? '100%' : getBladeWidth(blade.properties?.width)}
			>
				{#if ResolvedComponent}
					<ResolvedComponent {blade} />
				{:else}
					<!-- Fallback for unregistered blades -->
					<div
						class="blade-fallback-container-div flex flex-col h-full bg-[var(--th-panel-bg)] text-[var(--th-danger)] overflow-hidden shrink-0 w-full"
					>
						<div class="blade-fallback-content-div p-6 h-full">
							Error: Component for type "{blade.type}" not found in registry.
						</div>
					</div>
				{/if}
			</div>
		</div>
	{/each}
</div>
