# SDUI Blade Svelte (`[sbs]`)

> **The Svelte 5 Implementation Shell for the SDUI Blade Architecture.**

`sdui-blade-svelte` is a highly-abstracted, horizontal spatial interface (The Journey Protocol) engine built natively for **Svelte 5**. Leveraging Svelte 5 Runes (`$state`, `$derived`, `$effect`) and native `snippet` templating, it provides a high-performance presentation layer over the agnostic state machine of `sdui-blade-core`.

Originally forged as the core spatial orchestration engine for **Gravity English (`[ge]`)**—a multi-tenant educational platform—the underlying `sdui-blade-core` engine handles the abstract mathematical logic, state caching, and the "Inversion of Mount Points". This Svelte library (`[sbs]`) acts as the native adapter, interpreting that state machine into an elegant, non-blocking, and highly interactive UI tailored for the Svelte ecosystem.

## Features

- **Svelte 5 Native**: Built exclusively around modern Svelte 5 APIs. Zero legacy reactivity (`$:`); 100% Runes and Snippets.
- **The Journey Protocol**: Implements horizontal, Azure-style overlapping panels (Blades) rather than blocking modals.
- **Agnostic Theming**: Fully decoupled presentation layer. Bring your own CSS variables (e.g., Tailwind CSS v4) to style the geometry without fighting baked-in colors.
- **Responsive Geometry**: Blades intelligently scale into mobile viewports while maintaining their proportional constraints via native `max-width` cascading.
- **Core Orchestration**: Powered by `@slashand/sdui-blade-core` (`[sbc]`) for bulletproof state-machine interactions and spatial history.

## Installation

```bash
npm install sdui-blade-svelte @slashand/sdui-blade-core
```

_(Or use `pnpm` / `yarn` depending on your workspace)._

## Quick Start

### 1. Register your Blades

Register your Svelte components with the core engine and Svelte's `Component` registry.

```svelte
<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { sduiEngine } from 'sdui-blade-svelte';
	import { setContext } from 'svelte';
	import MyDetailBlade from './blades/MyDetailBlade.svelte';

	// Register the agnostic state machine
	sduiEngine.registerBlade('my-detail', {
		type: 'my-detail',
		properties: { width: 'xlarge' }
	});

	// Provide the Svelte UI Registry
	const registry = {
		'my-detail': MyDetailBlade
	};
</script>

<slot />
```

### 2. Implement the Blade Host

Mount the `BladeHost` at the root of your application to catch and render spatial navigations.

```svelte
<!-- src/routes/+page.svelte -->
<script lang="ts">
	import { BladeHost, sduiEngine } from 'sdui-blade-svelte';

	function openBlade() {
		sduiEngine.navigate({ type: 'my-detail', id: 'detail-1' });
	}
</script>

<button onclick={openBlade}>Open Detail Blade</button>

<BladeHost {registry} showBackdrop={false} />
```

### 3. Build a Blade Component

Construct your blades using the provided structural primitives to ensure correct layout math.

```svelte
<!-- src/routes/blades/MyDetailBlade.svelte -->
<script lang="ts">
	import { Blade } from 'sdui-blade-svelte';
</script>

{#snippet commands()}
	<button>Action</button>
{/snippet}

{#snippet footer()}
	<div>Save Changes</div>
{/snippet}

<Blade title="Detail View" subtitle="Sub-context here" {commands} {footer}>
	<div class="content">Main blade content flows here...</div>
</Blade>
```

## Architecture Notes

- **Inversion of Mount Points:** `sdui-blade-svelte` does not define what your UI looks like internally. It establishes a semantic wrapper and broadcasts JSON state.
- **Transient Memory:** Spatial journeys are tracked and can be synced to `popstate` / `window.location` for deep-linking.
- **No Naked Elements:** The structural components are meticulously tagged with purpose-driven class names (e.g., `blade-wrapper-div`, `blade-header-element`) for reliable E2E testing and DOM targeting.

## License

MIT
