(function (window) {
  'use strict';

  var applicationModuleName = 'dynamic';

  var service = {
    applicationModuleName: applicationModuleName,
    applicationModuleVendorDependencies: ['ui.router', 'ngSanitize'],
    registerModule: registerModule
  };

  window.ApplicationConfiguration = service;

  // Add a new vertical module
  function registerModule(moduleName, dependencies) {
    // Create angular module
    angular.module(moduleName, dependencies || []);

    // Add the module to the AngularJS configuration file
    angular.module(applicationModuleName).requires.push(moduleName);
  }
}(window));