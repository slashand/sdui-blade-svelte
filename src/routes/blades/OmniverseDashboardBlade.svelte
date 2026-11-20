<script lang="ts">
	import { SduiElementType, type SduiBladeNode, type SduiNode } from '@slashand/sdui-blade-core';
	import Blade from '$lib/Blade.svelte';
	import SduiButton from './SduiButton.svelte';
	let { blade }: { blade: SduiBladeNode } = $props();
	let activeTab = $state(0);
	const candles = [44, 69, 32, -71, 47, 73, -65, 52, 69, -54, 74, 61];
	type Column = { key: string; name: string };
	const nodeProps = (node: SduiNode) => (node.properties || {}) as Record<string, unknown>;
	const columns = (node: SduiNode) => (nodeProps(node).columns || []) as Column[];
	const rows = (node: SduiNode) => (nodeProps(node).rows || []) as Record<string, unknown>[];
	const items = (node: SduiNode) =>
		(nodeProps(node).items || []) as { title: string; targetId: string }[];
	const toolbar = $derived((blade.properties?.toolbar || []) as SduiNode[]);
	const footerActions = $derived((blade.properties?.footer || []) as SduiNode[]);
</script>

{#snippet renderNode(node: SduiNode)}
	{#if node.type === SduiElementType.Section}
		<section class="flex flex-col gap-3 min-w-0">
			{#if nodeProps(node).title}<h3 class="text-sm font-semibold mt-1">
					{String(nodeProps(node).title)}
				</h3>{/if}
			{#each node.children || [] as child (child.id)}{@render renderNode(child)}{/each}
		</section>
	{:else if node.type === SduiElementType.Grid}
		<div
			class="omniverse-grid grid gap-3"
			style:--grid-columns={String(nodeProps(node).columns || 2)}
		>
			{#each node.children || [] as child (child.id)}{@render renderNode(child)}{/each}
		</div>
	{:else if node.type === SduiElementType.Row}
		<div class="flex flex-wrap gap-3">
			{#each node.children || [] as child (child.id)}{@render renderNode(child)}{/each}
		</div>
	{:else if node.type === SduiElementType.Alert}
		<div
			class="omniverse-alert rounded border p-3 text-sm"
			data-intent={String(nodeProps(node).type || 'info')}
			role="status"
		>
			{#if nodeProps(node).title}<strong class="block">{String(nodeProps(node).title)}</strong>{/if}
			<span>{String(nodeProps(node).message || '')}</span>
		</div>
	{:else if node.type === SduiElementType.StatusBadge}
		<span
			class="omniverse-badge rounded border px-2 py-1 text-xs"
			data-intent={String(nodeProps(node).status || 'info')}
			>{String(nodeProps(node).text || '')}</span
		>
	{:else if node.type === SduiElementType.Text}
		<p class="m-0 text-sm text-[var(--th-text-secondary)]">{String(nodeProps(node).value || '')}</p>
	{:else if node.type === SduiElementType.Button}
		<SduiButton {node} />
	{:else if node.type === SduiElementType.Pivot}
		<div
			class="omniverse-pivot flex gap-2 border-b border-[var(--th-border)]"
			role="tablist"
			aria-label="Sections"
		>
			{#each items(node) as item, index (item.targetId)}
				<button
					type="button"
					role="tab"
					aria-selected={activeTab === index}
					onclick={() => (activeTab = index)}
					class="border-0 border-b-2 px-3 py-2 text-sm cursor-pointer"
					class:active={activeTab === index}>{item.title}</button
				>
			{/each}
		</div>
	{:else if node.type === SduiElementType.DataGrid}
		<div class="max-w-full overflow-auto rounded border border-[var(--th-border)]">
			<table class="omniverse-table w-full text-left text-sm">
				<thead
					><tr
						>{#each columns(node) as column (column.key)}<th scope="col" class="p-3"
								>{column.name}</th
							>{/each}</tr
					></thead
				>
				<tbody
					>{#each rows(node) as row (row)}<tr
							>{#each columns(node) as column (column.key)}<td class="p-3"
									>{String(row[column.key] ?? '')}</td
								>{/each}</tr
						>{/each}</tbody
				>
			</table>
		</div>
	{:else if node.type === SduiElementType.ExtensionMount}
		<div
			class="omniverse-extension relative flex items-end justify-around gap-2 rounded border p-3"
			role="img"
			aria-label={String(nodeProps(node).mountPoint || 'Interactive extension')}
		>
			<span class="absolute left-3 top-2 text-[10px] font-mono uppercase text-[#b7c9e2]"
				>{String(nodeProps(node).mountPoint || 'Interactive extension').replaceAll('_', ' ')}</span
			>
			{#each candles as bar, index (index)}<span
					class="omniverse-candle"
					class:up={bar > 0}
					style:height="{Math.abs(bar)}%"
				></span>{/each}
		</div>
	{:else}
		{#each node.children || [] as child (child.id)}{@render renderNode(child)}{/each}
	{/if}
{/snippet}

{#snippet actionFooter()}
	<div class="flex justify-end gap-2 w-full">
		{#each footerActions as action (action.id)}<SduiButton node={action} />{/each}
	</div>
{/snippet}

<Blade
	title={(blade.properties?.title as string) || 'Dashboard'}
	subtitle={blade.properties?.subtitle as string}
	bladeId={blade.id}
	footer={footerActions.length ? actionFooter : undefined}
>
	{#snippet commands()}
		{#each toolbar as action (action.id)}<SduiButton node={action} />{/each}
	{/snippet}
	<div class="flex flex-col gap-4">
		{#each blade.children || [] as child (child.id)}{@render renderNode(child)}{/each}
	</div>
</Blade>

<style>
	.omniverse-grid {
		grid-template-columns: repeat(var(--grid-columns), minmax(0, 1fr));
	}
	.omniverse-alert {
		border-color: #276d9a;
		color: #bce5ff;
		background: #102b40;
	}
	.omniverse-alert[data-intent='warning'] {
		border-color: #a66c10;
		color: #ffe69d;
		background: #443015;
	}
	.omniverse-alert[data-intent='error'] {
		border-color: #b54355;
		color: #ffd4dc;
		background: #471b26;
	}
	.omniverse-alert[data-intent='success'] {
		border-color: #248458;
		color: #b7f7d4;
		background: #133d2c;
	}
	.omniverse-badge {
		color: var(--th-text-primary);
		background: var(--th-element-bg);
		border-color: var(--th-border);
	}
	.omniverse-badge[data-intent='error'] {
		border-color: #b54355;
		color: #ffd4dc;
		background: #471b26;
	}
	.omniverse-badge[data-intent='warning'] {
		border-color: #a66c10;
		color: #ffe69d;
		background: #443015;
	}
	.omniverse-badge[data-intent='success'] {
		border-color: #248458;
		color: #b7f7d4;
		background: #133d2c;
	}
	.omniverse-pivot button {
		color: var(--th-text-secondary);
		background: transparent;
		border-color: transparent;
	}
	.omniverse-pivot button.active {
		color: var(--th-text-primary);
		border-color: var(--th-accent);
	}
	.omniverse-table {
		border-collapse: collapse;
		color: var(--th-text-primary);
	}
	.omniverse-table th,
	.omniverse-table td {
		border-bottom: 1px solid var(--th-border);
		white-space: nowrap;
	}
	.omniverse-table th {
		color: var(--th-text-secondary);
		background: var(--th-element-bg);
		font-size: 11px;
		text-transform: uppercase;
	}
	.omniverse-table tbody tr:nth-child(even) {
		background: color-mix(in srgb, var(--th-element-bg) 50%, transparent);
	}
	.omniverse-extension {
		height: 190px;
		overflow: hidden;
		background: #111827;
		border-color: var(--th-border);
	}
	.omniverse-candle {
		width: 10px;
		min-height: 18px;
		border-radius: 3px;
		background: #ff475d;
	}
	.omniverse-candle.up {
		background: #16d973;
	}
	.omniverse-candle::before {
		content: '';
		display: block;
		width: 2px;
		height: 34px;
		margin: -20px auto 0;
		background: inherit;
	}
	@media (max-width: 639px) {
		.omniverse-grid {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
