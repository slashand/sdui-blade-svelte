<script lang="ts">
	import { sduiEngine, bladeStore } from './blade-state.svelte';
	import type { Component } from 'svelte';
	import { untrack } from 'svelte';
	import { SduiElementType, type SduiBladeNode } from '@slashand/sdui-blade-core';

	let {
		registry,
		showBackdrop = false
	}: {
		registry: Record<string, Component<Record<string, unknown>>>;
		showBackdrop?: boolean;
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
			menu: '240px',
			small: '320px',
			medium: '480px',
			large: '600px',
			xlarge: '800px',
			xl: '800px',
			'2xl': '960px',
			'3xl': '1120px',
			'4xl': '1280px',
			'5xl': '1440px',
			'6xl': '1600px',
			'7xl': '1920px',
			full: '100vw'
		};
		return map[widthProp as string] || String(widthProp);
	}

	let isFirstRender = true;

	// Popstate listener for native browser Back/Forward navigation
	$effect(() => {
		const handlePopState = () => {
			const params = new URL(window.location.href).searchParams;
			const bladesParam = params.get('blades') || '';
			const currentStateKeys = sduiEngine.activeBlades.map((b) => b.id).join(',');

			if (bladesParam === currentStateKeys) {
				return;
			}

			if (bladesParam) {
				const urlIds = bladesParam.split(',');
				const payloadCache = bladeStore.getState().payloadCache;
				const newBlades = urlIds.map((id) => {
					const cachedBlade = payloadCache[id];
					// Use fallback if not cached, ensuring strict engine bounds
					return (
						cachedBlade ||
						({
							id,
							type: SduiElementType.Blade,
							properties: {},
							children: []
						} as unknown as SduiBladeNode)
					);
				});

				bladeStore.setState({ activeBlades: newBlades as unknown as Required<SduiBladeNode>[] });
			} else {
				bladeStore.setState({ activeBlades: [] });
			}
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	});

	// Active Blades to URL Syncing
	$effect(() => {
		// Track activeBlades length and mapping
		const stateBlades = sduiEngine.activeBlades.map((b) => b.id).join(',');

		// Prevent infinite loops if state matches URL
		const params = new URL(window.location.href).searchParams;
		const urlBlades = params.get('blades') || '';

		if (urlBlades === stateBlades) {
			isFirstRender = false;
			return;
		}

		if (sduiEngine.activeBlades.length > 0) {
			params.set('blades', stateBlades);
		} else {
			params.delete('blades');
		}

		const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;

		untrack(() => {
			if (isFirstRender) {
				window.history.replaceState({ isBlade: false }, '', newUrl);
				isFirstRender = false;
			} else {
				window.history.pushState({ isBlade: true }, '', newUrl);
			}
		});
	});
</script>

<div
	class="blade-host-container-div absolute inset-0 w-full h-full overflow-hidden z-[100] pointer-events-none"
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
