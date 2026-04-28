<script lang="ts">
	import { sduiEngine } from './blade-state.svelte';
	import { type Snippet } from 'svelte';

	let {
		title = '',
		subtitle = '',
		bladeId = '',
		children,
		commands,
		footer,
		class: className = '',
		headerClass = '',
		titleClass = '',
		subtitleClass = '',
		closeButtonClass = '',
		contentClass = '',
		footerClass = '',
		...rest
	}: {
		title?: string;
		subtitle?: string;
		bladeId?: string;
		children?: Snippet;
		commands?: Snippet;
		footer?: Snippet;
		class?: string;
		headerClass?: string;
		titleClass?: string;
		subtitleClass?: string;
		closeButtonClass?: string;
		contentClass?: string;
		footerClass?: string;
		[key: string]: unknown;
	} = $props();

	function closeBlade() {
		if (bladeId) {
			sduiEngine.closeBlade(bladeId);
		} else {
			sduiEngine.closeTopBlade();
		}
	}
</script>

<div
	class="blade-wrapper-div flex flex-col h-full w-full bg-[var(--th-panel-bg)] text-[var(--th-text-primary)] {className}"
	{...rest}
>
	<header
		class="blade-header-element flex-none p-4 border-b border-[var(--th-border)] flex justify-between items-center bg-[var(--th-panel-bg)] {headerClass}"
	>
		<div class="blade-title-container-div">
			<h2 class="blade-title-h2 text-xl font-semibold m-0 leading-tight {titleClass}">{title}</h2>
			{#if subtitle}
				<p class="blade-subtitle-p text-sm text-[var(--th-accent)] m-0 mt-1 {subtitleClass}">{subtitle}</p>
			{/if}
		</div>
		<div class="blade-commands-container-div flex items-center gap-2">
			{#if commands}
				{@render commands()}
			{/if}
			<button
				class="blade-close-button sdui-action-button p-2 bg-transparent border-none text-[var(--th-text-primary)] cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 rounded {closeButtonClass}"
				onclick={closeBlade}
				aria-label="Close blade"
			>
				<svg
					class="blade-close-icon-svg"
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path class="blade-close-icon-path" d="M18 6L6 18M6 6l12 12" />
				</svg>
			</button>
		</div>
	</header>
	<div class="blade-content-container-div flex-1 overflow-auto p-4 relative {contentClass}">
		{#if children}
			{@render children()}
		{/if}
	</div>
	{#if footer}
		<footer
			class="blade-footer-element flex-none p-4 border-t border-[var(--th-border)] bg-[var(--th-panel-bg)] {footerClass}"
		>
			{@render footer()}
		</footer>
	{/if}
</div>
