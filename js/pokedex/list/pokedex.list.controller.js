(
  function() {
    'use strict';
    angular.module('pokedex.list', ['pokedex.search'])
           .controller('PokedexListController', PokedexListController);

    function PokedexListController(PokedexFactory, PokedexSearchFactory){
        var vm = this;
        vm.pagination = {};
        vm.search = {
            limit: 8
        };

        // Methods
        vm.getPokemons = getPokemons;
        vm.searchChange = searchChange;
        vm.nextPage = nextPage;
        vm.prevPage = prevPage;

        init();

        function init() {
            PokedexSearchFactory.onSearch(vm.searchChange)
            vm.getPokemons(vm.search);
        }
        
        function getPokemons(search, url) { 
            PokedexFactory.cancel(vm._filterRequest); // Delete previous request if exists
            vm._filterRequest = PokedexFactory.list(search, url)
            vm._filterRequest.then(function(data) {
                vm.pagination.prev = data.previous;
                vm.pagination.next = data.next;
                for (var i = 0; i < data.results.length; i++) {
                    fetchDetail(data.results[i]);
                }
                vm.pokemons = data.results;
            })
        }

        function fetchDetail(pokemon) {
            pokemon._loading = true;

            // Sorry, PokeApi :(
            PokedexFactory.detail(pokemon)
                .then(function(data) {
                    pokemon._detail = data;
                    pokemon._loading = false;
                })
        }

        function searchChange(search) {
            vm.search.query = search.query;
        }

        function nextPage() {
            vm.getPokemons({}, vm.pagination.next)
        }

        function prevPage() {
            vm.getPokemons({}, vm.pagination.prev)
        }
    }
  }
)();