<!--
	/**
	 * [COMPONENT]
	 * [DetailBlade]
	 * 
	 * Secondary demo blade for deeper navigation layers.
	 * 
	 * CORE RESPONSIBILITIES:
	 * 1. Renders nested detail view.
	 * 2. Allows opening further nested blades.
	 * 
	 * DESIGN PATTERN: [SDUI BLADE]
	 *
	 * file: src/routes/blades/DetailBlade.svelte
	 */
-->
<script lang="ts">
	import { sduiEngine } from '$lib';
	import { SduiElementType, type SduiBladeNode } from '@slashand/sdui-blade-core';
	import Blade from '$lib/Blade.svelte';

	/**
	 * The SDUI Blade payload node containing structural data and properties.
	 */
	let { blade }: { blade: SduiBladeNode } = $props();

	/**
	 * Opens a deeper nested blade with a static deterministic ID.
	 */
	function openNested() {
		sduiEngine.openBlade({
			id: 'nested-detail-blade',
			type: SduiElementType.Blade,
			properties: {
				title: 'Nested Detail',
				subtitle: 'Another layer deep',
				width: 'small'
			}
		});
	}
</script>

<Blade
	title={(blade.properties?.title as string) || 'Detail View'}
	subtitle={blade.properties?.subtitle as string}
	bladeId={blade.id}
>
	<div
		class="sdui-element-root p-6 border border-[var(--th-border)] bg-[var(--th-element-bg)] rounded-xl shadow-lg mt-4"
	>
		<h2 class="sdui-element-text text-xl font-bold mb-2 text-[var(--th-text-primary)]">Detail Node</h2>
		<p class="text-[var(--th-text-secondary)] opacity-80 mb-4">
			This blade was opened dynamically via the Journey Protocol.
		</p>

		<button
			onclick={openNested}
			class="sdui-action-button p-3 border border-[var(--th-border)] hover:border-[var(--th-accent)] rounded-lg text-[var(--th-text-secondary)] hover:text-[var(--th-accent)] font-medium transition-colors text-left shadow cursor-pointer bg-[var(--th-panel-bg)]"
		>
			Open Another Detail
		</button>
	</div>
</Blade>
