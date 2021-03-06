(function() {
  'use strict';

  angular
    .module('pokedex.filters', [])
    .filter('getImage', getImage);

  function getImage() {
    return function(pokemon) {
      if (pokemon) {
        if (pokemon._loading) {
            return 'https://www.hudson29.com/desktopmodules/avatarsoft/ActionForm/static/loader/fading-line.GIF';
        }else{
            return pokemon.sprites.front_default;
        }
      }
    }
  }

})();
