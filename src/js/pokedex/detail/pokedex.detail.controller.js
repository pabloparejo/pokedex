(
  function() {
    'use strict';
    angular.module('pokedex.detail')
           .controller('PokedexDetailController', PokedexDetailController);

    function PokedexDetailController(SpeciesFactory){
        var vm = this;
        vm.evolution = undefined;
        vm._detailRequest = undefined;

        vm.$onChanges = onChanges;

        function onChanges(changes) {
          if (vm.pokemon) {
            SpeciesFactory.cancel(vm._detailRequest);
            vm.evolution = undefined
            vm._detailRequest = SpeciesFactory.detail(vm.pokemon);
            vm._detailRequest.then(function(data) {
                vm.evolution = data['evolves_from_species'];
              })
          }
        }
    }
  }
)();