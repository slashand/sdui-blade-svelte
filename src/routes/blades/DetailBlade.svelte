<script lang="ts">
	import { sduiEngine } from '$lib';
	import { SduiElementType, type SduiBladeNode } from '@slashand/sdui-blade-core';
	import Blade from '$lib/Blade.svelte';

	let { blade }: { blade: SduiBladeNode } = $props();

	function openNested() {
		sduiEngine.openBlade({
			id: 'nested-' + Date.now(),
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
		class="sdui-element-root p-6 border border-[var(--border)] bg-[var(--code-bg)] rounded-xl shadow-lg mt-4"
	>
		<h2 class="sdui-element-text text-xl font-bold mb-2 text-[var(--text-h)]">Detail Node</h2>
		<p class="text-[var(--text)] opacity-80 mb-4">
			This blade was opened dynamically via the Journey Protocol.
		</p>

		<button
			onclick={openNested}
			class="sdui-action-button p-3 border border-[var(--border)] hover:border-[var(--accent)] rounded-lg text-[var(--text)] hover:text-[var(--accent)] font-medium transition-colors text-left shadow cursor-pointer bg-[var(--bg)]"
		>
			Open Another Detail
		</button>
	</div>
</Blade>
