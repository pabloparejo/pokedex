(function() {
  'use strict';

  angular
    .module('pokedex.filters', [])
    .filter('getImage', getImage);

  function getImage() {
    return function(input) {
        return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' + input.pkdx_id + '.png';
    }
  }

})();
