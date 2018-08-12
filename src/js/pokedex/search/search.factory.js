(function() {
  'use strict';

  angular
    .module('pokedex.search.factory', [])
    .factory('PokedexSearchFactory', PokedexSearchFactory);

  function PokedexSearchFactory($q, $http) {
    var _this = this
    _this.callbacks = [];
    var service = {
      onSearch: onSearch,
      searchChange: searchChange
    };

    return service;
    ///////////////

    function onSearch(fn){
        _this.callbacks.push(fn);
    }

    function searchChange(search) {
        angular.forEach(_this.callbacks, function(fn) {
            fn(search);
        });
    }
  }

})();
