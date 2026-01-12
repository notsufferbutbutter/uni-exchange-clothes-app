import 'jest-preset-angular/setup-env/zone';
import { TestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

beforeAll(() => {
	TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
});

// Global mock for Supabase client used across services/components
jest.mock('./app/supabase/superbase-client', () => ({
	supabase: {
		auth: {
			getSession: async () => ({ data: { session: null } }),
		},
		channel: () => ({ on: () => ({ subscribe: () => ({}) }) }),
		removeChannel: async () => {},
	},
}));