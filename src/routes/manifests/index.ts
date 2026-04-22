import { fintechApp } from './fintech';
import { healthApp } from './health';
import { logisticsApp } from './logistics';
import { cyberApp } from './cyber';
import { aiApp } from './ai';
import { crmApp } from './crm';
import { mediaApp } from './media';
import { retailApp } from './retail';
import { hrApp } from './hr';
import { stressApp } from './stress';
import { allBladesApp } from './all-blades';

export * from './types';
export * from './procedural';

export const CORE_PILLARS = [
	fintechApp,
	healthApp,
	logisticsApp,
	cyberApp,
	aiApp,
	crmApp,
	mediaApp,
	retailApp,
	hrApp,
	stressApp,
	allBladesApp
];
