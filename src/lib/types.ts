import type { Snippet } from 'svelte';

/** Consumer-owned confirmation and final close, preserving the SDK's native close chrome. */
export type BladeCloseRequestHandler = () => void | Promise<void>;

/**
 * Valid width configurations for the Aztec Blade Layout System.
 */
export type BladeWidth =
	| 'menu'
	| 'small'
	| 'medium'
	| 'large'
	| 'xlarge'
	| 'xl'
	| '2xl'
	| '3xl'
	| '4xl'
	| '5xl'
	| '6xl'
	| '7xl'
	| 'custom'
	| 'full'
	| number
	| string;

/**
 * Standard properties for the Blade component
 */
export interface BladeProps {
	/** Primary title displayed in the Blade header */
	title: string;
	/** Optional secondary title displayed beneath the primary title */
	subtitle?: string;
	/** Indicates if this is the root blade in a stack */
	isRoot?: boolean;
	/** Main content area of the blade */
	children: Snippet;
	/** Optional command nodes to inject into the right-hand header action area */
	commands?: Snippet;
	/** SDK-owned action area, fixed outside body scrolling and left-aligned by default. */
	footer?: Snippet;
	/** Owns confirmation and final dismissal; the SDK does not close again after this callback. */
	onCloseRequest?: BladeCloseRequestHandler;
	closeDisabled?: boolean;
	closeLabel?: string;
	closeErrorLabel?: string;
	/** Aztec layout width identifier, CSS variable, or raw pixel value */
	width?: BladeWidth;
	/** Optional override class for the blade container */
	widthClass?: string;
	/** Catch-all for HTML attributes like data-sdui-id */
	[key: string]: unknown;
}
