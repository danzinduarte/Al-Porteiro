(function ()
{
    'use strict';

    angular
        .module('app')
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider)
    {
        $locationProvider.html5Mode(true);

        /**
         * Interceptação do serviço para adicionar a autorização ao Header das requisições a API          
         * */
        $httpProvider.interceptors.push(function($q, $injector, $localStorage) {
          return {
            'request': function (config) {
              config.headers = config.headers || {};
              if ($localStorage.token) {
                config.headers.Authorization = 'Baerer ' + $localStorage.token;
              }

              return config;
            },
            'responseError': function(response) {
              switch (response.status) {
                case 401:
                  var stateService = $injector.get('$state');
                  stateService.go('app.login');
                  break;                

                default :
                  return $q.reject(response);
              }
            }
          };
        });


        $urlRouterProvider.otherwise('/');
        

        // State definitions
        $stateProvider
        .state('app',
        { 
          abstract: true,  
          views   : {
            'main@'         : {
                templateUrl: './main/main.html'
            }
          }
        })
        .state('app.condominio',
          { 
            abstract: true
        })
    }

})();
