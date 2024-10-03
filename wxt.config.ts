import { defineConfig } from 'wxt';

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ['@wxt-dev/module-react'],
  manifest: {
    name: 'LinkedIn AI Reply',
    description: 'Enhance your LinkedIn messaging experience with AI-powered replies.',
    version: '0.0.1',
    type: 'popup',
  }
});
