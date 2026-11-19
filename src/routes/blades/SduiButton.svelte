<script lang="ts">
	import type { SduiNode, SduiBlade } from '@slashand/sdui-blade-core';
	import { sduiEngine } from '$lib';

	let { node }: { node: SduiNode } = $props();

	let label = $derived((node.properties?.label as string) || 'Button');
	let action = $derived(node.properties?.action as Record<string, unknown> | undefined);

	function handleClick() {
		console.log('Action Dispatched:', action);
		if (action?.type === 'navigate' && action.payload) {
			sduiEngine.openBlade(action.payload as unknown as SduiBlade);
		}
	}
</script>

<button
	class="sdui-action-button cursor-pointer px-4 py-2 bg-[var(--th-element-bg)] hover:bg-[var(--th-element-bg-hover)] text-[var(--th-text-primary)] rounded transition-colors text-sm font-medium border border-[var(--th-border)]"
	data-sdui-id={node.id}
	onclick={handleClick}
	aria-label={label}
>
	{label}
</button>
