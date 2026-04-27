<script lang="ts">
	import { sduiEngine, bladeStore } from './blade-state.svelte';
	import type { Component } from 'svelte';
	import { untrack } from 'svelte';
	import { pushState } from '$app/navigation';


	let {
		registry,
		showBackdrop = false,
		offsetHeader = true
	}: {
		registry: Record<string, Component<Record<string, unknown>>>;
		showBackdrop?: boolean;
		offsetHeader?: boolean;
	} = $props();

	function slideRight(node: Element, { duration = 400 }) {
		return {
			duration,
			css: (t: number) => `transform: translateX(${(1 - t) * 100}%);`
		};
	}

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

	let isFirstRender = true;
	let headerHeight = $state(0);

	// Header Detection Effect
	$effect(() => {
		if (!offsetHeader) {
			headerHeight = 0;
			return;
		}

		const header = document.querySelector('header');
		if (!header) return;

		headerHeight = header.offsetHeight;
		
		const observer = new ResizeObserver((entries) => {
			for (let entry of entries) {
				if (entry.target === header) {
					headerHeight = header.offsetHeight;
				}
			}
		});
		
		observer.observe(header);
		return () => observer.disconnect();
	});

	// --- Two-Way URL/State Synchronization ---
	import { page } from '$app/stores';

	let lastSyncedBlades = '';

	// 1. URL -> State (Handles Refresh, Back/Forward buttons, internal Links)
	$effect(() => {
		// Reactive dependency on SvelteKit's page store
		const urlBlades = $page.url.searchParams.get('blades') || '';
		
		untrack(() => {
			if (urlBlades !== lastSyncedBlades) {
				lastSyncedBlades = urlBlades;
				
				if (urlBlades) {
					const urlIds = urlBlades.split(',');
					const payloadCache = bladeStore.getState().payloadCache;
					
					sduiEngine.closeAllBlades(true);
					for (const id of urlIds) {
						const cachedBlade = payloadCache[id];
						if (cachedBlade) {
							sduiEngine.openBlade(cachedBlade);
						}
					}
				} else {
					sduiEngine.closeAllBlades(true);
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
					isFirstRender = false;
					// Use native history API to correct the URL on first render (e.g. if cached payloads were missing).
					// This avoids SvelteKit's "Cannot call replaceState before router is initialized" error
					// as per the Shallow Routing caveats (state cannot be applied before first navigation).
					window.history.replaceState(window.history.state, '', targetUrl);
				} else {
					// eslint-disable-next-line svelte/no-navigation-without-resolve
					pushState(targetUrl, { isBlade: true });
				}
			} else {
				// Mark as false even if we didn't push state on first render
				isFirstRender = false;
			}
		});
	});
</script>

<div
	class="blade-host-container-div absolute inset-0 w-full h-full overflow-hidden z-[100] pointer-events-none"
	style:top="{headerHeight}px"
	style:height="calc(100% - {headerHeight}px)"
>
	{#each sduiEngine.activeBlades as blade, index (blade.id)}
		{@const ResolvedComponent = registry[blade.type]}
		{@const isBaseBlade = index === 0}

		{#if !isBaseBlade && showBackdrop}
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
			style:background-color={isBaseBlade ? 'var(--bg)' : 'transparent'}
			style:z-index={isBaseBlade ? 90 : 100 + index}
			in:slideRight={{ duration: 400 }}
			out:slideRight={{ duration: 400 }}
		>
			<div
				class="blade-host-panel-div absolute top-0 right-0 h-full pointer-events-auto shadow-2xl border-l border-[var(--border)] bg-[var(--bg)] flex flex-col"
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
