(
  function() {
    'use strict';
    angular.module('pokedex.search')
      .controller('SearchController', SearchController);

    function SearchController(PokedexSearchFactory) {
        var vm = this;
        vm.search = {}
        vm.onSearch = onSearch;

        function onSearch(search) {
            PokedexSearchFactory.searchChange(search);
        }
    }
  }
)();
