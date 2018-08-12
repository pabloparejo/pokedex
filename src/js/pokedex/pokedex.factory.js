(function() {
  'use strict';

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
