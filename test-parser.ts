import { SduiParser } from '@slashand/sdui-blade-core';
import { allBladesApp } from './src/routes/manifests/all-blades.js';

try {
	SduiParser.parseManifest(allBladesApp.payload);
	console.log('Success!');
} catch (err) {
	console.error('Validation error:', err.message);
}
