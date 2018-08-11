(function() {
  'use strict';

  angular
    .module('pokedex.factory', [])
    .factory('PokedexFactory', PokedexFactory);

  function PokedexFactory($q, $http) {
    var modelName = 'artists';
    var service = {
      cancel: cancel,
      filter: filter,
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

    function filter(query) {
      var queryAux = angular.copy(query);
      if (queryAux.query) queryAux.query = encodeURIComponent(queryAux.query);
      var url = 'https://pokeapi.co/api/v1/pokemon/',
          deferred = $q.defer(),
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

    function list() {
      return filter({});
    }
  }

})();
