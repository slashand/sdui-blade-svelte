<script lang="ts">
	import type { SduiNode, SduiBlade } from '@slashand/sdui-blade-core';
	import { sduiEngine } from '$lib';

	let { node }: { node: SduiNode } = $props();

	let label = $derived((node.properties?.label as string) || 'Button');
	let action = $derived(node.properties?.action as Record<string, unknown> | undefined);
	let status = $state('');

	function handleClick(event: MouseEvent) {
		if (action?.type === 'navigate' && action.payload) {
			sduiEngine.openBlade(action.payload as unknown as SduiBlade);
		} else if (action?.type === 'close') {
			if (action.target === 'all') sduiEngine.closeAllBlades();
			else if (typeof action.target === 'string') sduiEngine.closeBlade(action.target);
			else sduiEngine.closeTopBlade();
		} else if (action?.type === 'dispatch' || action?.type === 'invoke' || action?.type === 'api') {
			(event.currentTarget as HTMLButtonElement).dispatchEvent(
				new CustomEvent('sdui:action', { bubbles: true, detail: { nodeId: node.id, action } })
			);
			status =
				action.type === 'api'
					? 'Demo request emitted. No backend is connected.'
					: 'Demo action emitted; no backend call. The blade remains open.';
		}
	}
</script>

<span class="relative inline-flex items-center">
	<button
		type="button"
		class="sdui-action-button cursor-pointer px-4 py-2 bg-[var(--th-element-bg)] hover:bg-[var(--th-element-bg-hover)] text-[var(--th-text-primary)] rounded transition-colors text-sm font-medium border border-[var(--th-border)] disabled:opacity-50 disabled:cursor-not-allowed"
		data-sdui-id={node.id}
		onclick={handleClick}
		aria-label={label}
		disabled={!action}
	>
		{label}
	</button>
	{#if status}<span
			role="status"
			class="pointer-events-none absolute top-full right-0 z-20 mt-1 w-60 max-w-[calc(100vw-64px)] rounded border border-[var(--th-border)] bg-[var(--th-panel-bg)] p-2 text-xs text-[var(--th-text-secondary)] shadow-lg"
			>{status}</span
		>{/if}
</span>
