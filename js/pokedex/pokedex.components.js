(function() {
  'use strict';

  angular
    .module('pokedex')
    .component('typesComponent', {
        templateUrl: 'templates/types.component.html',
        bindings: {
            types: '='
        }
    });
})();
