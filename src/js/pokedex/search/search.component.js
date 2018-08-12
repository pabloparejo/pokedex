(
  function() {
    'use strict';
    angular.module('pokedex.search')
      .component('searchComponent', {
        templateUrl: 'templates/search.component.html',
        controller: 'SearchController',
        controllerAs: 'Search'
      });
  }
)();
