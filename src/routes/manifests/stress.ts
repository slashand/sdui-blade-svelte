import { SduiElementType } from '@slashand/sdui-blade-core';
import type { OmniverseApp } from './types';

export const stressApp: OmniverseApp = {
	id: 'topology-stress',
	name: 'SDUI Topology Stress Test',
	category: 'Architecture',
	description:
		'Deep-nested CSS bounding box test. Cascades perfectly from full width down to a small terminal.',
	icon: '📐',
	payload: {
		version: '1.0',
		blade: {
			id: 'blade-stress-root',
			type: SduiElementType.Blade,
			properties: {
				title: 'Phase 1: Foundation',
				subtitle: 'Root Workspace (w-full)',
				width: 'full'
			},
			children: [
				{
					id: 'stress-btn-1',
					type: SduiElementType.Button,
					properties: {
						label: 'Spawn 7XL Dimensions (1920px)',
						action: {
							type: 'navigate',
							payload: {
								id: 'blade-stress-7xl',
								type: SduiElementType.Blade,
								properties: {
									title: 'Phase 2: 7XL Overlay',
									subtitle: 'Width Array: 1920px',
									width: '7xl'
								},
								children: [
									{
										id: 'stress-btn-2',
										type: SduiElementType.Button,
										properties: {
											label: 'Spawn 6XL Dimensions (1600px)',
											action: {
												type: 'navigate',
												payload: {
													id: 'blade-stress-6xl',
													type: SduiElementType.Blade,
													properties: {
														title: 'Phase 3: 6XL Overlay',
														subtitle: 'Width Array: 1600px',
														width: '6xl'
													},
													children: [
														{
															id: 'stress-btn-3',
															type: SduiElementType.Button,
															properties: {
																label: 'Spawn 5XL Dimensions (1440px)',
																action: {
																	type: 'navigate',
																	payload: {
																		id: 'blade-stress-5xl',
																		type: SduiElementType.Blade,
																		properties: {
																			title: 'Phase 4: 5XL Overlay',
																			subtitle: 'Width Array: 1440px',
																			width: '5xl'
																		},
																		children: [
																			{
																				id: 'stress-btn-4',
																				type: SduiElementType.Button,
																				properties: {
																					label: 'Spawn 4XL Dimensions (1280px)',
																					action: {
																						type: 'navigate',
																						payload: {
																							id: 'blade-stress-4xl',
																							type: SduiElementType.Blade,
																							properties: {
																								title: 'Phase 5: 4XL Overlay',
																								subtitle: 'Width Array: 1280px',
																								width: '4xl'
																							},
																							children: [
																								{
																									id: 'stress-btn-5',
																									type: SduiElementType.Button,
																									properties: {
																										label: 'Spawn 3XL Dimensions (1120px)',
																										action: {
																											type: 'navigate',
																											payload: {
																												id: 'blade-stress-3xl',
																												type: SduiElementType.Blade,
																												properties: {
																													title: 'Phase 6: 3XL Overlay',
																													subtitle: 'Width Array: 1120px',
																													width: '3xl'
																												},
																												children: [
																													{
																														id: 'stress-btn-6',
																														type: SduiElementType.Button,
																														properties: {
																															label: 'Spawn 2XL Dimensions (960px)',
																															action: {
																																type: 'navigate',
																																payload: {
																																	id: 'blade-stress-2xl',
																																	type: SduiElementType.Blade,
																																	properties: {
																																		title: 'Phase 7: 2XL Overlay',
																																		subtitle: 'Width Array: 960px',
																																		width: '2xl'
																																	},
																																	children: [
																																		{
																																			id: 'stress-btn-7',
																																			type: SduiElementType.Button,
																																			properties: {
																																				label:
																																					'Spawn XL Dimensions (800px)',
																																				action: {
																																					type: 'navigate',
																																					payload: {
																																						id: 'blade-stress-xl',
																																						type: SduiElementType.Blade,
																																						properties: {
																																							title:
																																								'Phase 8: XL Overlay',
																																							subtitle:
																																								'Width Array: 800px',
																																							width: 'xl'
																																						},
																																						children: [
																																							{
																																								id: 'stress-btn-8',
																																								type: SduiElementType.Button,
																																								properties: {
																																									label:
																																										'Spawn Large Dimensions (600px)',
																																									action: {
																																										type: 'navigate',
																																										payload: {
																																											id: 'blade-stress-large',
																																											type: SduiElementType.Blade,
																																											properties: {
																																												title:
																																													'Phase 9: Large Overlay',
																																												subtitle:
																																													'Width Array: 600px',
																																												width:
																																													'large'
																																											},
																																											children: [
																																												{
																																													id: 'stress-btn-9',
																																													type: SduiElementType.Button,
																																													properties:
																																														{
																																															label:
																																																'Spawn Medium Dimensions (480px)',
																																															action:
																																																{
																																																	type: 'navigate',
																																																	payload:
																																																		{
																																																			id: 'blade-stress-medium',
																																																			type: SduiElementType.Blade,
																																																			properties:
																																																				{
																																																					title:
																																																						'Phase 10: Medium Overlay',
																																																					subtitle:
																																																						'Width Array: 480px',
																																																					width:
																																																						'medium'
																																																				},
																																																			children:
																																																				[
																																																					{
																																																						id: 'stress-btn-10',
																																																						type: SduiElementType.Button,
																																																						properties:
																																																							{
																																																								label:
																																																									'Spawn Small Dimensions (320px)',
																																																								action:
																																																									{
																																																										type: 'navigate',
																																																										payload:
																																																											{
																																																												id: 'blade-stress-small',
																																																												type: SduiElementType.Blade,
																																																												properties:
																																																													{
																																																														title:
																																																															'Phase 11: Small Overlay',
																																																														subtitle:
																																																															'Width Array: 320px',
																																																														width:
																																																															'small'
																																																													},
																																																												children:
																																																													[
																																																														{
																																																															id: 'stress-btn-11',
																																																															type: SduiElementType.Button,
																																																															properties:
																																																																{
																																																																	label:
																																																																		'Spawn Menu Dimensions (240px)',
																																																																	action:
																																																																		{
																																																																			type: 'navigate',
																																																																			payload:
																																																																				{
																																																																					id: 'blade-stress-menu',
																																																																					type: SduiElementType.Blade,
																																																																					properties:
																																																																						{
																																																																							title:
																																																																								'Phase 12: Core Minimum',
																																																																							subtitle:
																																																																								'Width Array: 240px',
																																																																							width:
																																																																								'menu'
																																																																						},
																																																																					children:
																																																																						[
																																																																							{
																																																																								id: 'stress-alert',
																																																																								type: SduiElementType.Alert,
																																																																								properties:
																																																																									{
																																																																										type: 'success',
																																																																										title:
																																																																											'Target Acquired',
																																																																										message:
																																																																											'You have successfully traversed all 12 architectural bounding boxes natively.'
																																																																									}
																																																																							}
																																																																						]
																																																																				}
																																																																		}
																																																																}
																																																														}
																																																													]
																																																											}
																																																									}
																																																							}
																																																					}
																																																				]
																																																		}
																																																}
																																														}
																																												}
																																											]
																																										}
																																									}
																																								}
																																							}
																																						]
																																					}
																																				}
																																			}
																																		}
																																	]
																																}
																															}
																														}
																													}
																												]
																											}
																										}
																									}
																								}
																							]
																						}
																					}
																				}
																			}
																		]
																	}
																}
															}
														}
													]
												}
											}
										}
									}
								]
							}
						}
					}
				}
			]
		}
	}
};
