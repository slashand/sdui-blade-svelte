<script lang="ts">
	import { SduiParser } from '@slashand/sdui-blade-core';
	import type { SduiBladeNode } from '@slashand/sdui-blade-core';
	import { BladeHost, sduiEngine } from '$lib';
	import { CORE_PILLARS, generateProceduralPayload } from './manifests';
	import type { OmniverseApp } from './manifests';
	import { demoRegistry } from './registry';
	import '../app.css';

	let jsonInput = $state('');
	let showJson = $state(false);
	let backdropEnabled = $state(true);
	let optionsOpen = $state(false);
	let selectedTileId = $state<string | null>(null);
	let validationError = $derived.by(() => {
		if (!jsonInput) return null;
		try {
			SduiParser.parseManifest(JSON.parse(jsonInput));
			return null;
		} catch (err: unknown) {
			return (err as Error).message;
		}
	});
	let inspectorInput = $state<HTMLTextAreaElement>();
	let inspectorToggle = $state<HTMLButtonElement>();
	let optionsToggle = $state<HTMLButtonElement>();
	let demoHeader = $state<HTMLElement>();
	let lastGalleryTrigger: HTMLElement | null = null;

	function trackBladeFocus(node: HTMLElement) {
		let previousClose: HTMLButtonElement | null = null;
		const syncFocus = () => {
			const closeButtons = node.querySelectorAll<HTMLButtonElement>('.blade-close-button');
			const topClose = closeButtons.item(closeButtons.length - 1);
			if (topClose === previousClose) return;
			if (topClose) topClose.focus();
			else if (previousClose) lastGalleryTrigger?.focus();
			previousClose = topClose;
		};
		const observer = new MutationObserver(syncFocus);
		observer.observe(node, { childList: true, subtree: true });
		syncFocus();
		return { destroy: () => observer.disconnect() };
	}

	function openInspector() {
		showJson = true;
		requestAnimationFrame(() => inspectorInput?.focus());
	}

	function closeInspector() {
		showJson = false;
		requestAnimationFrame(() =>
			(window.matchMedia('(max-width: 639px)').matches ? optionsToggle : inspectorToggle)?.focus()
		);
	}

	function launchOmniverseApp(app: OmniverseApp, tileId = app.id) {
		try {
			lastGalleryTrigger =
				document.activeElement instanceof HTMLElement ? document.activeElement : null;
			const manifest = SduiParser.parseManifest(app.payload);
			jsonInput = JSON.stringify(app.payload, null, 2);
			sduiEngine.setAppBlade(manifest.blade as SduiBladeNode);
			selectedTileId = tileId;
		} catch (err: unknown) {
			alert(`[SDUI ENGINE FATAL] Payload syntactically invalid:\n\n${(err as Error).message}`);
		}
	}

	function handleApplyJson() {
		try {
			const rawObj = JSON.parse(jsonInput);
			const manifest = SduiParser.parseManifest(rawObj);
			sduiEngine.setAppBlade(manifest.blade as SduiBladeNode);
			showJson = false;
		} catch (err: unknown) {
			alert(`Invalid JSON Payload:\n\n${(err as Error).message}`);
		}
	}
	const themes = [
		{
			id: 'dark',
			name: 'Default Dark',
			vars: {}
		},
		{
			id: 'neon',
			name: 'Neon Cyberpunk',
			vars: {
				'--bg': '#05010a',
				'--code-bg': '#0a0112',
				'--th-panel-bg': '#130224',
				'--th-element-bg': '#241132',
				'--th-element-bg-hover': '#351747',
				'--border': '#461376',
				'--th-border': '#681b99',
				'--th-text-primary': '#f9e7ff',
				'--th-text-secondary': '#d6b7e6',
				'--text': '#e6a3ff',
				'--text-h': '#00ffcc',
				'--accent': '#ff00aa',
				'--accent-border': '#ff00aa',
				'--accent-hover': '#ff33bb'
			}
		},
		{
			id: 'light',
			name: 'Light Minimal',
			vars: {
				'--bg': '#f9fafb',
				'--code-bg': '#ffffff',
				'--th-panel-bg': '#ffffff',
				'--th-element-bg': '#f1f5f9',
				'--th-element-bg-hover': '#e2e8f0',
				'--border': '#e5e7eb',
				'--th-border': '#d1d5db',
				'--th-text-primary': '#111827',
				'--th-text-secondary': '#4b5563',
				'--th-accent': '#1d4ed8',
				'--th-accent-hover': '#1e40af',
				'--text': '#4b5563',
				'--text-h': '#111827',
				'--accent': '#2563eb',
				'--accent-border': '#3b82f6',
				'--accent-hover': '#60a5fa'
			}
		}
	];

	let currentThemeIdx = $state(0);

	function toggleTheme() {
		currentThemeIdx = (currentThemeIdx + 1) % themes.length;
		const theme = themes[currentThemeIdx];
		const root = document.documentElement;

		// Reset all inline styles first to clear previous theme
		root.removeAttribute('style');
		root.style.colorScheme = theme.id === 'light' ? 'light' : 'dark';

		if (theme.id !== 'dark') {
			for (const [key, value] of Object.entries(theme.vars)) {
				root.style.setProperty(key, value);
			}
		}
	}
</script>

<svelte:head>
	<title>SDUI Omniverse SDK Matrix</title>
</svelte:head>

<svelte:window
	onpointerdown={(event) => {
		if (optionsOpen && !demoHeader?.contains(event.target as Node)) optionsOpen = false;
	}}
	onkeydown={(event) => {
		if (event.key !== 'Escape') return;
		if (optionsOpen) {
			event.preventDefault();
			optionsOpen = false;
			optionsToggle?.focus();
			return;
		}
		if (showJson) {
			closeInspector();
			return;
		}
		const closeButtons = document.querySelectorAll<HTMLButtonElement>('.blade-close-button');
		const topClose = closeButtons.item(closeButtons.length - 1);
		if (topClose && !topClose.disabled) {
			event.preventDefault();
			topClose.click();
		}
	}}
/>

<div
	class="sdui-app-shell flex flex-col h-screen w-screen bg-[var(--bg)] text-[var(--text-h)] overflow-hidden font-sans transition-colors duration-500 relative"
>
	<a href="#demo-main" class="sdui-skip-link">Skip to demo gallery</a>
	<!-- GLOBAL HEADINGS -->
	<header
		id="sdui-global-header"
		bind:this={demoHeader}
		class="sdui-global-header flex items-center h-14 shrink-0 bg-[var(--bg)] border-b border-[var(--border)] px-6 z-50 shadow-sm transition-colors duration-500"
	>
		<h1
			aria-label="sdui Omniverse SDK Matrix Svelte 5"
			class="sdui-brand-title text-[var(--text-h)] text-lg font-bold m-0 tracking-wide flex items-center gap-2"
		>
			<span class="opacity-70 text-[var(--accent)]">sdui ::</span>
			<span class="sdui-brand-long">Omniverse </span>SDK Matrix
			<span class="text-[var(--text)] font-normal text-sm ml-2">Svelte 5</span>
		</h1>
		<button
			bind:this={optionsToggle}
			type="button"
			class="sdui-options-toggle"
			aria-label="Demo options"
			aria-controls="sdui-demo-options"
			aria-expanded={optionsOpen}
			onclick={() => (optionsOpen = !optionsOpen)}>⋯</button
		>
		<div
			id="sdui-demo-options"
			class={[
				'sdui-header-actions ml-auto flex gap-4 items-center',
				{ 'sdui-options-open': optionsOpen }
			]}
		>
			<span class="text-[var(--accent)] text-[10px] font-bold uppercase tracking-wider">
				Current Theme: {themes[currentThemeIdx].name}
			</span>
			<button
				type="button"
				class="sdui-menu-theme"
				onclick={() => {
					toggleTheme();
					optionsOpen = false;
				}}>Change theme</button
			>
			<button
				type="button"
				onclick={() => {
					backdropEnabled = !backdropEnabled;
					optionsOpen = false;
				}}
				aria-pressed={backdropEnabled}
				class="sdui-toggle-backdrop-button text-[var(--text)] hover:text-[var(--text-h)] text-[10px] cursor-pointer px-4 py-1.5 rounded border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] transition-all uppercase font-bold tracking-wider"
			>
				Backdrop: {backdropEnabled ? 'Enabled' : 'Disabled'}
			</button>
			<button
				bind:this={inspectorToggle}
				type="button"
				onclick={() => {
					if (showJson) closeInspector();
					else openInspector();
					optionsOpen = false;
				}}
				class="sdui-toggle-json-button text-[var(--text)] hover:text-[var(--text-h)] text-[10px] cursor-pointer px-4 py-1.5 rounded border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] transition-all uppercase font-bold tracking-wider"
			>
				{showJson ? 'Close Payload Inspector' : 'Inspect Raw SduiManifest Array'}
			</button>
		</div>
	</header>

	<!-- MATRIX WORK SURFACE -->
	<div class="sdui-body-container flex flex-1 overflow-hidden relative">
		<aside
			aria-label="Demo navigation"
			class="sdui-global-sidebar w-14 shrink-0 bg-[var(--code-bg)] border-r border-[var(--border)] flex flex-col items-center py-4 gap-6 z-40 transition-colors duration-500"
		>
			<span
				title="Pillar Applications"
				class="w-8 h-8 rounded-md bg-[var(--accent)] flex items-center justify-center shadow-lg text-white text-xl"
			>
				✨
			</span>
			<!-- THEME SWITCHER -->
			<button
				title="Toggle Global Theme"
				type="button"
				aria-label="Change demo theme"
				onclick={toggleTheme}
				class="w-8 h-8 rounded-md flex items-center justify-center cursor-pointer hover:bg-[var(--bg)] transition-colors text-xl border border-[var(--border)]"
			>
				🎨
			</button>
			<span
				title="Telemetry Metrics"
				class="w-8 h-8 rounded-md flex items-center justify-center text-xl grayscale opacity-30"
			>
				📊
			</span>
		</aside>

		<div use:trackBladeFocus class="sdui-demo-workspace relative flex-1 min-w-0 min-h-0">
			<main
				id="demo-main"
				tabindex="-1"
				class="sdui-work-surface flex-1 relative overflow-y-auto bg-[var(--bg)] p-10 transition-colors duration-500"
			>
				<div class="max-w-6xl mx-auto">
					<div class="mb-10 text-center">
						<h2 class="text-4xl font-extrabold text-[var(--text-h)] tracking-tight mb-3">
							SDUI Framework Orchestrator
						</h2>
						<p class="text-lg text-[var(--text)] max-w-2xl mx-auto">
							Explore blade sizes, nested journeys, scrolling and footer layouts. Svelte mounts each
							example through the SDK.
						</p>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<!-- INFINITE PROCEDURAL GENERATOR TILE -->
						<div
							role="button"
							tabindex="0"
							onkeydown={(event) => {
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									launchOmniverseApp(generateProceduralPayload(), 'procedural');
								}
							}}
							onclick={() => launchOmniverseApp(generateProceduralPayload(), 'procedural')}
							data-selected={selectedTileId === 'procedural'}
							aria-pressed={selectedTileId === 'procedural'}
							class="sdui-matrix-tile group flex flex-col p-6 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] hover:border-[var(--th-border-hover)] shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
						>
							<div class="flex items-center gap-4 mb-3">
								<span
									class="text-3xl bg-[var(--bg)] rounded-full w-12 h-12 flex items-center justify-center shadow"
									>🌌</span
								>
								<h3
									class="text-lg font-bold text-[var(--text-h)] leading-tight group-hover:text-white transition-colors"
								>
									Synthesize Infinite App
								</h3>
							</div>
							<p class="text-sm text-[var(--text)] leading-relaxed flex-1">
								Execute a mathematical algorithm capable of generating thousands of unique layout
								structures. Prove the SduiRenderer recursion handles unimaginable complexity.
							</p>
							<div
								class="mt-4 pt-4 border-t border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--text)] group-hover:text-[var(--text-h)] transition-colors"
							>
								DISPATCH CHAOS ENGINE →
							</div>
						</div>

						<!-- DETERMINISTIC PILLAR APPS -->
						{#each CORE_PILLARS as app (app.id)}
							<div
								role="button"
								tabindex="0"
								onkeydown={(event) => {
									if (event.key === 'Enter' || event.key === ' ') {
										event.preventDefault();
										launchOmniverseApp(app);
									}
								}}
								onclick={() => launchOmniverseApp(app)}
								data-selected={selectedTileId === app.id}
								aria-pressed={selectedTileId === app.id}
								class="sdui-matrix-tile group flex flex-col p-6 rounded-xl border border-[var(--border)] bg-[var(--code-bg)] hover:bg-[var(--border)] hover:border-[var(--th-border-hover)] shadow-md cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl"
							>
								<div class="flex items-center gap-4 mb-3">
									<span
										class="text-3xl bg-[var(--bg)] rounded-full w-12 h-12 flex items-center justify-center shadow-sm border border-[var(--border)]"
										>{app.icon}</span
									>
									<div class="flex flex-col">
										<span
											class="text-[10px] uppercase tracking-wider text-[var(--accent)] font-bold"
											>{app.category}</span
										>
										<h3
											class="text-lg font-bold text-[var(--text-h)] leading-tight mt-0.5 group-hover:text-white transition-colors"
										>
											{app.name}
										</h3>
									</div>
								</div>
								<p class="text-sm text-[var(--text)] leading-relaxed flex-1">
									{app.description}
								</p>
								<div
									class="mt-4 pt-4 border-t border-[var(--border)] text-xs font-bold uppercase tracking-wider text-[var(--text)] group-hover:text-[var(--text-h)] transition-colors"
								>
									LOAD MANIFEST & MOUNT BLADE →
								</div>
							</div>
						{/each}
					</div>
				</div>
			</main>
			<!-- BLADE ORCHESTRATION HOST MOUNTS IN ABSOLUTE OVERLAY -->
			<!-- Set the host CSS variables directly on the BladeHost container or as a parent -->
			<div class="absolute inset-0 pointer-events-none z-[100]">
				<!-- The host fills the workspace below this demo's global header. -->
				<BladeHost
					registry={demoRegistry}
					headerSelector={null}
					backdrop={{ enabled: backdropEnabled, opacity: 0.36, blur: 3 }}
				/>
			</div>
		</div>

		<!-- ABSOLUTE JSON EDITOR OVERLAY -->
		{#if showJson}
			<aside
				aria-label="JSON AST Inspector"
				class="sdui-json-editor-overlay absolute right-0 top-0 bottom-0 w-[550px] bg-[var(--code-bg)] border-l border-[var(--border)] z-[200] flex flex-col shadow-2xl transition-transform"
			>
				<div
					class="sdui-json-header h-14 border-b border-[var(--border)] flex items-center px-6 justify-between bg-[var(--bg)]"
				>
					<div class="flex flex-col">
						<h3
							class="sdui-json-title text-sm font-bold tracking-wider uppercase text-[var(--text-h)] m-0"
						>
							JSON AST Inspector
						</h3>
						<span class="text-[10px] text-[var(--text)] uppercase tracking-wide mt-0.5"
							>Live Schema Mutator</span
						>
					</div>
					<div class="flex gap-2">
						<button
							onclick={() => {
								navigator.clipboard.writeText(jsonInput);
								alert('Schema copied to clipboard!');
							}}
							class="sdui-json-copy-button bg-[var(--code-bg)] hover:bg-[var(--border)] text-[var(--text)] hover:text-[var(--text-h)] cursor-pointer px-3 py-1.5 text-xs rounded transition-colors uppercase font-bold tracking-wider"
						>
							<span class="flex items-center gap-1">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path
										d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"
									/></svg
								>
								Copy
							</span>
						</button>
						<button
							type="button"
							aria-label="Close JSON inspector"
							onclick={closeInspector}
							class="sdui-json-close-button text-[var(--text)] hover:text-[var(--danger)] cursor-pointer p-2 text-2xl transition-colors"
							>×</button
						>
					</div>
				</div>

				{#if validationError}
					<div
						class="sdui-json-error-banner bg-[var(--th-danger)]/10 border-l-4 border-[var(--th-danger)] p-4 text-xs font-mono"
					>
						<strong
							class="sdui-json-error-label text-[var(--th-danger)] block mb-1 uppercase tracking-wider font-bold"
							>STRICT VALIDATION ERROR:</strong
						>
						<span class="text-red-200">{validationError}</span>
					</div>
				{/if}

				<div class="flex flex-1 relative bg-[#1e1e1e]">
					<textarea
						bind:this={inspectorInput}
						aria-label="Manifest JSON"
						bind:value={jsonInput}
						spellcheck={false}
						placeholder="Select an App from the Matrix to load its schema..."
						class="sdui-json-textarea absolute inset-0 w-full h-full bg-transparent text-[#d4d4d4] p-6 text-[11px] font-mono outline-none resize-none border-none leading-relaxed"
					></textarea>
				</div>

				<div class="sdui-json-footer p-4 border-t border-[var(--border)] bg-[var(--bg)]">
					<button
						onclick={handleApplyJson}
						disabled={!!validationError}
						class="sdui-json-apply-button w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:bg-[var(--border)] disabled:text-[var(--text)] disabled:cursor-not-allowed text-[var(--bg)] text-[11px] uppercase tracking-wider font-bold py-3 rounded transition-colors cursor-pointer shadow-md"
					>
						Force Pipeline Rehydration Injection
					</button>
				</div>
			</aside>
		{/if}
	</div>
</div>
