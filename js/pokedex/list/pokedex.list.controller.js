(
  function() {
    'use strict';
    angular.module('pokedex.list', [])
           .controller('PokedexListController', PokedexListController);

    function PokedexListController(PokedexFactory){
        var vm = this;
        vm.search = {
            limit: 10
        };

        // Methods
        vm.getPokemons = getPokemons;

        init();

        function init() {
            vm.getPokemons(vm.search);
        }
        
        function getPokemons(search) {
            PokedexFactory.cancel(vm._filterRequest); // Delete previous request if exists
            vm._filterRequest = PokedexFactory.filter(search)
            vm._filterRequest.then(function(data) {
                vm.pokemons = data.objects;
            })
        }
    }
  }
)();