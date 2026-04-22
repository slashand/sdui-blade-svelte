<script lang="ts">
	import { sduiEngine } from '$lib';
	import { SduiElementType, type SduiBladeNode } from '@slashand/sdui-blade-core';
	import Blade from '$lib/Blade.svelte';
	import SduiButton from './SduiButton.svelte';

	let { blade }: { blade: SduiBladeNode } = $props();

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

	function openSettings() {
		// Find the current width to determine the next size for the demo cascade
		const currentWidth = blade.properties?.width as string;
		const currentIndex = decreasingWidths.indexOf(currentWidth);

		// Pick the next smaller size, or 'medium' if not found/at the end
		const nextWidth =
			currentIndex !== -1 && currentIndex + 1 < decreasingWidths.length
				? decreasingWidths[currentIndex + 1]
				: 'medium';

		sduiEngine.openBlade({
			id: 'settings-' + Date.now(),
			type: SduiElementType.Blade,
			properties: {
				title: 'Nested Demo Blade (' + nextWidth + ')',
				subtitle: 'Journey Protocol deep nesting',
				width: nextWidth as 'full'
			}
		});
	}
</script>

<Blade
	title={(blade.properties?.title as string) || 'Dashboard'}
	subtitle={blade.properties?.subtitle as string}
	bladeId={blade.id}
>
	{#snippet commands()}
		<button
			class="px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] rounded text-sm cursor-pointer hover:bg-[var(--accent)]/20 transition-colors"
			>Actions</button
		>
	{/snippet}

	<div
		class="sdui-element-root p-4 border border-[var(--border)] bg-[var(--accent)]/5 rounded text-[var(--accent)] mb-4"
	>
		This is the root Dashboard blade rendered from the matrix payload.
	</div>

	<div
		class="sdui-element-root p-6 border border-[var(--border)] bg-[var(--code-bg)] rounded-xl shadow-lg mt-4"
	>
		<h2 class="sdui-element-text text-xl font-bold mb-2 text-[var(--text-h)]">Payload Data</h2>
		<div class="p-4 bg-black/30 rounded border border-[var(--border)] overflow-auto max-h-[300px]">
			<pre class="text-[10px] text-[var(--accent)] font-mono">{JSON.stringify(
					blade.children || [],
					null,
					2
				)}</pre>
		</div>
	</div>

	<!-- DYNAMIC CHILDREN FOR SHOWCASE -->
	{#if blade.children && blade.children.length > 0}
		<div class="grid grid-cols-1 gap-4 mt-6">
			{#each blade.children as child (child.id)}
				{#if child.type === SduiElementType.Button}
					<SduiButton node={child} />
				{:else if child.type === SduiElementType.Alert}
					<div
						class="p-4 rounded-lg border border-green-500/50 bg-green-500/10 text-green-400 mt-2"
					>
						<h3 class="font-bold">{child.properties?.title as string}</h3>
						<p class="text-sm mt-1">{child.properties?.message as string}</p>
					</div>
				{/if}
			{/each}
		</div>
	{/if}

	<div class="grid grid-cols-2 gap-4 mt-6">
		<button
			onclick={openSettings}
			class="sdui-action-button p-4 border border-[var(--accent)]/30 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20 rounded-lg text-[var(--accent)] font-medium transition-colors text-left shadow cursor-pointer"
		>
			Open Nested Blade (Journey Protocol)
		</button>
	</div>

	{#snippet footer()}
		<button
			class="px-4 py-2 bg-[var(--accent)] text-white rounded cursor-pointer font-medium text-sm hover:opacity-90"
			>Refresh Dashboard</button
		>
	{/snippet}
</Blade>
