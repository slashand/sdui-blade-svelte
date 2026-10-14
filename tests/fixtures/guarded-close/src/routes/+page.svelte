<script lang="ts">
	import { onMount, type Component } from 'svelte';
	import { BladeHost, sduiEngine, SduiElementType } from '@slashand/sdui-blade-svelte';
	import GuardedBlade from './GuardedBlade.svelte';
	import '../app.css';
	const registry = {
		[SduiElementType.Blade]: GuardedBlade as unknown as Component<Record<string, unknown>>
	};
	let tall = $state(false);
	onMount(() =>
		sduiEngine.openBlade({
			id: 'document-review',
			type: SduiElementType.Blade,
			properties: { title: 'Document review', width: 'medium' }
		})
	);
</script>

<header class="fixture-global-header" class:fixture-global-header-tall={tall}>
	<button class="fixture-button fixture-resize" onclick={() => (tall = !tall)}>Resize header</button
	>
</header>
<main class="fixture-background"><p class="fixture-background-copy">Underlying workspace</p></main>
<BladeHost {registry} headerSelector=".fixture-global-header" />
