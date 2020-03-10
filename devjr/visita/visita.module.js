(function ()
{
  'use strict';

  angular
    .module('app.visita')
    .config(config);

  /** @ngInject */
  function config($stateProvider)
  {
    // State
    $stateProvider
      .state('app.condominio.visita', {
        url    : '/visita/lista',
        templateUrl:'./visita/lista.html',
        controller : 'VisitaListaController as vm'        
      })
      .state('app.condominio.condomino.novo', {
        url    : './codomino/novo',
        views  : {
          'main@content': {
            templateUrl:'./condomino/novo.html',            
            controller : 'VisitaListaController as vm'            
          }
        }
      })
      .state('app.condominio.condomino.ver', {
        url    : '/condomino/:id',
        views  : {
          'main@content': {
            template:'./condomino/ver.html',
            controller : 'VisitaListaController as vm'            
          }
        }
      })
  }
})()
