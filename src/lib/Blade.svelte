<script lang="ts">
	/**
	 * [COMPONENT]
	 * Blade.svelte
	 *
	 * The core Blade component that acts as the visual shell for all NLE tools,
	 * panels, and workspaces. It delegates state to the sduiEngine.
	 *
	 * CORE RESPONSIBILITIES:
	 * 1. Render a consistent, highly themeable container for SDUI blades.
	 * 2. Provide overridable snippet slots for commands and footer actions.
	 * 3. Handle close actions via the global blade engine.
	 *
	 * DESIGN PATTERN: [PRESENTATIONAL SHELL]
	 *
	 * file: src/lib/Blade.svelte
	 */

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
		/** The main title of the blade. */
		title?: string;
		/** An optional subtitle displayed below the main title. */
		subtitle?: string;
		/** The unique identifier for this blade instance. Used for lifecycle management. */
		bladeId?: string;
		/** The primary content snippet of the blade. */
		children?: Snippet;
		/** An optional snippet for header command buttons (rendered next to close button). */
		commands?: Snippet;
		/** An optional snippet for the footer section. */
		footer?: Snippet;
		/** Custom CSS classes for the outermost wrapper element. */
		class?: string;
		/** Custom CSS classes to completely override the default header styles. */
		headerClass?: string;
		/** Custom CSS classes to completely override the default title styles. */
		titleClass?: string;
		/** Custom CSS classes to completely override the default subtitle styles. */
		subtitleClass?: string;
		/** Custom CSS classes to completely override the default close button styles. */
		closeButtonClass?: string;
		/** Custom CSS classes to completely override the default content area styles. */
		contentClass?: string;
		/** Custom CSS classes to completely override the default footer styles. */
		footerClass?: string;
		[key: string]: unknown;
	} = $props();

	/**
	 * Initiates the close sequence for this blade.
	 * If no bladeId is provided, closes the top-most active blade.
	 */
	function closeBlade() {
		if (bladeId) {
			sduiEngine.closeBlade(bladeId);
		} else {
			sduiEngine.closeTopBlade();
		}
	}
</script>

<div
	class="blade-wrapper-div {className || 'flex flex-col h-full w-full bg-[var(--th-panel-bg)] text-[var(--th-text-primary)]'}"
	{...rest}
>
	<header
		class="blade-header-element {headerClass || 'flex-none p-4 border-b border-[var(--th-border)] flex justify-between items-center bg-[var(--th-panel-bg)]'}"
	>
		<div class="blade-title-container-div">
			<h2 class="blade-title-h2 {titleClass || 'text-xl font-semibold m-0 leading-tight'}">{title}</h2>
			{#if subtitle}
				<p class="blade-subtitle-p {subtitleClass || 'text-sm text-[var(--th-accent)] m-0 mt-1'}">{subtitle}</p>
			{/if}
		</div>
		<div class="blade-commands-container-div flex items-center gap-2">
			{#if commands}
				{@render commands()}
			{/if}
			<button
				class="blade-close-button sdui-action-button {closeButtonClass || 'p-2 bg-transparent border-none text-[var(--th-text-primary)] cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 rounded'}"
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
	<div class="blade-content-container-div {contentClass || 'flex-1 overflow-auto p-4 relative'}">
		{#if children}
			{@render children()}
		{/if}
	</div>
	{#if footer}
		<footer
			class="blade-footer-element {footerClass || 'flex-none p-4 border-t border-[var(--th-border)] bg-[var(--th-panel-bg)]'}"
		>
			{@render footer()}
		</footer>
	{/if}
</div>
