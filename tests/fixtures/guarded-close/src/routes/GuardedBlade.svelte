<script lang="ts">
	import { Blade, sduiEngine, type SduiBladeNode } from '@slashand/sdui-blade-svelte';
	import { page } from '$app/state';
	let { blade }: { blade: SduiBladeNode } = $props();
	let blocking = $state(false);
	let confirming = $state(false);
	let requests = $state(0);
	let finish: (() => void) | undefined = $state();
	let reject: (() => void) | undefined = $state();
	function close() {
		requests += 1;
		if (page.url.searchParams.get('mode') === 'async') {
			return new Promise<void>((resolveClose, rejectClose) => {
				finish = () => {
					sduiEngine.closeBlade(blade.id, true);
					resolveClose();
				};
				reject = () => {
					rejectClose(new Error('Controlled callback failure'));
				};
			});
		}
		confirming = true;
	}
</script>

<Blade
	bladeId={page.url.searchParams.has('top') ? '' : blade.id}
	title="Document review"
	closeLabel="Cerrar panel"
	closeErrorLabel="No se pudo cerrar. Inténtalo de nuevo."
	closeDisabled={blocking}
	onCloseRequest={page.url.searchParams.get('mode') === 'legacy' ? undefined : close}
	contentClass="flex min-h-0 flex-1 flex-col overflow-hidden"
>
	<div class="fixture-body">
		<p class="fixture-request-count">{requests}</p>
		<button class="fixture-button fixture-block" onclick={() => (blocking = !blocking)}
			>Toggle busy work</button
		>
		{#if confirming}<div
				class="fixture-confirmation"
				role="alertdialog"
				aria-label="Unsaved document"
			>
				<button class="fixture-button fixture-keep" onclick={() => (confirming = false)}
					>Keep editing</button
				>
				<button
					class="fixture-button fixture-discard"
					onclick={() => sduiEngine.closeBlade(blade.id, true)}>Discard and close</button
				>
			</div>{/if}
		{#if finish}<button class="fixture-button fixture-finish" onclick={finish}>Finish close</button
			>{/if}
		{#if reject}<button class="fixture-button fixture-reject" onclick={reject}>Reject close</button
			>{/if}
		<p class="fixture-long-copy">Selectable document content</p>
	</div>
	{#snippet footer()}<button class="fixture-button fixture-save">Save document</button><button
			class="fixture-button fixture-cancel">Cancel changes</button
		>{/snippet}
</Blade>
