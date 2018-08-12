(
  function() {
    'use strict';
    angular.module('pokedex.detail')
      .component('pokedexDetailComponent', {
        templateUrl: 'templates/pokedex.detail.component.html',
        controller: 'PokedexDetailController',
        controllerAs: 'Detail',
        bindings: {
            pokemon: '<',
            show: '='
        }
      });
  }
)();
