import { defineConfig } from 'cypress';

export default defineConfig({
  retries: 2,
  viewportWidth: 1280,
  viewportHeight: 720,

  env: {
    appUrl: 'http://localhost:4200/#/kadai',
    adminUrl: '/administration',
    dropdownWait: 80,
    testValueClassificationSelectionName: 'L10303',
    testValueClassifications: 'CY-TEST-CLASSIFICATIONS',
    testValueWorkbasketSelectionName: 'basxet0',
    testValueWorkbaskets: 'CY-TEST-WORKBASKETS',
    isLocal: true,
    isHistoryEnabled: false
  },

  component: {
    devServer: {
      framework: 'angular',
      bundler: 'webpack'
    },
    specPattern: '**/*.cy.ts'
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    }
  }
});
