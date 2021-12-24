import { viteMockServe } from 'vite-plugin-mock';

export default viteMockServe({
  mockPath: 'mock',
  injectCode: `
		import { setupMockServer } from '../mock';
		setupMockServer();
	`
});
