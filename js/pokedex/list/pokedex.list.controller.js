(
  function() {
    'use strict';
    angular.module('pokedex.list', ['pokedex.search'])
           .controller('PokedexListController', PokedexListController);

    function PokedexListController(PokedexFactory, PokedexSearchFactory){
        var vm = this;
        vm.search = {
            limit: 25
        };

        // Methods
        vm.getPokemons = getPokemons;
        vm.searchChange = searchChange;

        init();

        function init() {
            PokedexSearchFactory.onSearch(vm.searchChange)
            vm.getPokemons(vm.search);
        }
        
        function getPokemons(search) {
            PokedexFactory.cancel(vm._filterRequest); // Delete previous request if exists
            vm._filterRequest = PokedexFactory.filter(search)
            vm._filterRequest.then(function(data) {
                vm.pokemons = data.objects;
            })
        }

        function searchChange(search) {
            vm.search.query = search.query;
        }
    }
  }
)();