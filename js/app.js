(
  function() {
    'use strict';
    angular.module('pokedex.search', ['pokedex.search.factory']);
  }
)();

(function() {
  'use strict';

  PokedexSearchFactory.$inject = ["$q", "$http"];
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

(
  function() {
    'use strict';
    SearchController.$inject = ["PokedexSearchFactory"];
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

(
  function() {
    'use strict';
    angular.module('pokedex.search')
      .component('searchComponent', {
        templateUrl: 'templates/search.component.html',
        controller: 'SearchController',
        controllerAs: 'Search'
      });
  }
)();

(
  function() {
    'use strict';
    PokedexListController.$inject = ["PokedexFactory", "PokedexSearchFactory"];
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
        vm.selectPokemon = selectPokemon;

        vm.nextPage = nextPage;
        vm.prevPage = prevPage;

        init();

        function init() {
            PokedexSearchFactory.onSearch(_searchChange);
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
                    for(var key in data) pokemon[key] = data[key];
                    pokemon._loading = false;
                })
        }

        function _searchChange(search) {
            vm.search.query = search.query;

            // If PokeAPI would have search
            // vm.getPokemons(vm.search)
        }

        function selectPokemon(pokemon) {
            vm.selectedPokemon = pokemon;
            vm.showDetail = true;
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
(
  function() {
    'use strict';
    angular.module('pokedex.detail', []);
  }
)();

(
  function() {
    'use strict';
    PokedexDetailController.$inject = ["SpeciesFactory"];
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

(
  function() {
    'use strict';
    angular.module('pokedex', ['pokedex.factory', 'pokedex.search', 'pokedex.list', 
                               'pokedex.detail', 'pokedex.filters']);
  }
)();

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

(function() {
  'use strict';

  PokedexFactory.$inject = ["$q", "$http", "API_URL"];
  SpeciesFactory.$inject = ["$q", "$http"];
  angular
    .module('pokedex.factory', [])
    .constant('API_URL', 'https://pokeapi.co/api/v2/')
    .factory('PokedexFactory', PokedexFactory)
    .factory('SpeciesFactory', SpeciesFactory)

  function PokedexFactory($q, $http, API_URL) {
    var service = {
      cancel: cancel,
      detail: detail,
      list: list
    };

    return service;
    ///////////////

    function cancel(promise) {
      // If the promise does not contain a hook into the deferred timeout,
      // then simply ignore the cancel request.
      if (promise && promise._httpTimeout && promise._httpTimeout.resolve) {
        promise._httpTimeout.resolve();
      }
    }

    function list(query, url) {
      var queryAux = angular.copy(query);
      if (queryAux.query) queryAux.query = encodeURIComponent(queryAux.query);
      url = url ? url : API_URL + 'pokemon/';
      var deferred = $q.defer(),
          config = {
            timeout: deferred.promise,
            params: queryAux
          };

      $http.get(url, config).then(function(response) {
        deferred.resolve(response.data);
      }, function(reason) {
        deferred.reject(reason);
      });

      deferred.promise._httpTimeout = deferred;
      return deferred.promise;
    }

    function detail(pokemon) {
      var deferred = $q.defer();

      $http.get(pokemon.url).then(function(response) {
        deferred.resolve(response.data);
      }, function(reason) {
        deferred.reject(reason);
      });
      return deferred.promise;
    }
  }

  function SpeciesFactory($q, $http) {
    var service = {
      cancel: cancel,
      detail: detail
    };

    return service;
    ///////////////

    function cancel(promise) {
      // If the promise does not contain a hook into the deferred timeout,
      // then simply ignore the cancel request.
      if (promise && promise._httpTimeout && promise._httpTimeout.resolve) {
        promise._httpTimeout.resolve();
      }
    }

    function detail(pokemon) {
      var deferred = $q.defer(),
          config = {
            timeout: deferred.promise
          };

      $http.get(pokemon.species.url, config).then(function(response) {
        deferred.resolve(response.data);
      }, function(reason) {
        deferred.reject(reason);
      });

      deferred.promise._httpTimeout = deferred;
      return deferred.promise;
    }
  }

})();

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

(
  function() {
    'use strict';
    angular.module('pokedexApp', ['ui.router', 'pokedex']);
  }
)();

(function() {
  'use strict';
  stateConfig.$inject = ["$stateProvider", "$urlRouterProvider"];
  angular.module('pokedexApp')
    .config(stateConfig);

  function stateConfig($stateProvider, $urlRouterProvider) {
    // For unmatched routes
    $urlRouterProvider.otherwise('/');
    // Application routes
    $stateProvider
      .state('site', {
        template: '<div ui-view></div>'
      })
      .state('site.home', {
        url: '/',
        controller: 'PokedexListController',
        controllerAs: 'Pokedex',
        templateUrl: 'templates/pokedex.list.html'
      })
  }
})();
