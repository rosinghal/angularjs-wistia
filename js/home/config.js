(function () {
  'use strict';

  angular
    .module('home')
    .config(config)
    .controller('HomeController', HomeController);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl : 'js/home/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      });

    $urlRouterProvider.otherwise('/');
  }

  function HomeController() {
    var vm = this;
    vm.title = 'AngularJS Wistia Multiple File Uploader';
  }
}());
