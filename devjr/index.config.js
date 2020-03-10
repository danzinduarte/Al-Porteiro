(function ()
{
    'use strict';

    angular
        .module('app')
        .config(config);
    
    function config($mdDateLocaleProvider, $mdAriaProvider)
    {
        // Formata de data brasileiro
        $mdDateLocaleProvider.formatDate = function(date) {
          return date ? moment(date).format('DD/MM/YYYY') : null;
        };

        // Desativar os warnings de ARIA-LABEL (label para tecnologias assistivas)
        $mdAriaProvider.disableWarnings();      


    }

})();
