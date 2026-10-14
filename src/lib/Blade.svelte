<script lang="ts">
	import { sduiEngine } from './blade-state.svelte';
	import { onDestroy, type Snippet } from 'svelte';
	import type { BladeCloseRequestHandler } from './types';
	import './blade-chrome.css';
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
		onCloseRequest,
		closeDisabled = false,
		closeLabel = 'Close blade',
		closeErrorLabel = 'Unable to close blade. Please try again.',
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
		/** Owns the close decision, including confirmation and final engine close. No automatic close follows this callback. */
		onCloseRequest?: BladeCloseRequestHandler;
		/** Disables the native close control while application work cannot be interrupted. */
		closeDisabled?: boolean;
		/** Accessible close label supplied by the consumer's localization system. */
		closeLabel?: string;
		/** Recoverable alert shown if an asynchronous close callback rejects. */
		closeErrorLabel?: string;
		[key: string]: unknown;
	} = $props();

	/**
	 * Initiates the close sequence for this blade.
	 * If no bladeId is provided, closes the top-most active blade.
	 */
	let closing = $state(false);
	let closeFailed = $state(false);
	let disposed = false;
	onDestroy(() => {
		disposed = true;
	});
	async function closeBlade() {
		if (closeDisabled || closing) return;
		const requestedId = bladeId;
		const handler = onCloseRequest;
		closing = true;
		closeFailed = false;
		try {
			if (handler) await handler();
			else if (requestedId) sduiEngine.closeBlade(requestedId);
			else sduiEngine.closeTopBlade();
		} catch {
			if (!disposed && requestedId === bladeId) closeFailed = true;
		} finally {
			if (!disposed) closing = false;
		}
	}
</script>

<div
	class="blade-wrapper-div {className ||
		'flex flex-col h-full w-full bg-[var(--th-panel-bg)] text-[var(--th-text-primary)]'}"
	{...rest}
>
	<header
		class="blade-header-element {headerClass ||
			'flex-none p-4 border-b border-[var(--th-border)] flex justify-between items-center bg-[var(--th-panel-bg)]'}"
	>
		<div class="blade-title-container-div">
			<h2 class="blade-title-h2 {titleClass || 'text-xl font-semibold m-0 leading-tight'}">
				{title}
			</h2>
			{#if subtitle}
				<p class="blade-subtitle-p {subtitleClass || 'text-sm text-[var(--th-accent)] m-0 mt-1'}">
					{subtitle}
				</p>
			{/if}
		</div>
		<div class="blade-commands-container-div flex items-center gap-2">
			{#if commands}
				{@render commands()}
			{/if}
			<button
				type="button"
				class="blade-close-button sdui-action-button {closeButtonClass ||
					'p-2 bg-transparent border-none text-[var(--th-text-primary)] cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 rounded'}"
				onclick={closeBlade}
				aria-label={closeLabel}
				disabled={closeDisabled || closing}
				aria-busy={closing}
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
				{#if closing}<span class="blade-close-progress" aria-hidden="true"></span>{/if}
			</button>
		</div>
	</header>
	<div class="blade-content-container-div {contentClass || 'flex-1 overflow-auto p-4 relative'}">
		{#if closeFailed}<p class="blade-close-error" role="alert">{closeErrorLabel}</p>{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
	{#if footer}
		<footer
			class="blade-footer-element {footerClass ||
				'flex-none p-4 border-t border-[var(--th-border)] bg-[var(--th-panel-bg)]'}"
		>
			{@render footer()}
		</footer>
	{/if}
</div>
