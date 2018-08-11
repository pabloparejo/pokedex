(function() {
  'use strict';
  angular.module('pokedexApp')
    .config(stateConfig);

  function stateConfig($stateProvider, $urlRouterProvider) {
    // For unmatched routes
    $urlRouterProvider.otherwise('/');
    // Application routes
    $stateProvider
      .state('site', {
        template: '<div ui-view></div>'
      })
  }
})();
