import type { Component } from 'svelte';
import { SduiElementType } from '@slashand/sdui-blade-core';
import DashboardBlade from './blades/DashboardBlade.svelte';
import DetailBlade from './blades/DetailBlade.svelte';
import SduiButton from './blades/SduiButton.svelte';

export const demoRegistry: Record<string, Component<Record<string, unknown>>> = {
	[SduiElementType.Blade]: DashboardBlade as unknown as Component<Record<string, unknown>>,
	[SduiElementType.Button]: SduiButton as unknown as Component<Record<string, unknown>>,
	dashboard: DashboardBlade as unknown as Component<Record<string, unknown>>,
	detail: DetailBlade as unknown as Component<Record<string, unknown>>
};
