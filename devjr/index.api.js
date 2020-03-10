(function ()
{
    'use strict';

    angular
        .module('app')
        .factory('api', apiService);

    /** @ngInject */
    function apiService($resource)
    {

      var api = {}      

      // Base Url
      api.baseUrl = 'http://localhost:3000/api/';
      

      /* Recursos da API */ 
      api.condomino   = $resource(api.baseUrl + 'visita/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.pessoa   = $resource(api.baseUrl + 'pessoa/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })

      api.porteiro   = $resource(api.baseUrl + 'porteiro/:id', {id : '@id'},
        {update: {
          method: 'PUT'
        }
      })


      

      return api;
    }

})();
