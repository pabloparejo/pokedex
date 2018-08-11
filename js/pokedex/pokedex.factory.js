(function() {
  'use strict';

  angular
    .module('pokedex.factory', [])
    .factory('PokedexFactory', PokedexFactory);

  function PokedexFactory($q, $http) {
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
      url = url ? url : 'https://pokeapi.co/api/v2/pokemon/';
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

})();
