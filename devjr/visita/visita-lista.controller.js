angular.module('app.visita')
.controller('VisitaListaController',visitaListaController)

function visitaListaController($scope,$resource,$mdDialog, $localStorage){
    
    $scope.vm = {}
    let vm = $scope.vm

    let visitaApi = $resource('http://localhost:3000/api/visita/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })
    
    function init(){
        carregaVisitas($localStorage.condomino.id);

        $localStorage.condomino = {
            id : 5,
            nome : 'Jose Mayer'
        }
    }    
    init();

    
    vm.carregaVisitas = carregaVisitas;
    vm.cadastraVisita = cadastraVisita;
    vm.editaVisita    = editaVisita;
    vm.excluiVisita   = excluiVisita;
    vm.excluir          = excluir; 



    function carregaVisitas(condominoId){
        vm.visitas = new visitaApi()
        vm.visitas.$get({where: condominoId}).then(function(resposta){
            console.log(resposta)
            vm.visitas.data = resposta.data

            respostas =  vm.visitas.data
            
            respostas = respostas.map(function(resp){

                if (new Date() >= new Date(resp.dataHoraExpiracao)){
                    resp.situacao = "Expirado";
                } 

                switch (resp.situacao) {
                    case 1:
                        resp.situacao = "Agendado"
                        break;
                    case 2:
                        resp.situacao = "Liberado"
                        break;    
                    case 3:
                        resp.situacao = "Expirado"
                        break;
                    case 4:
                        resp.situacao = "Cancelado"
                        break;
                    case 5:
                        resp.situacao = "Negado"
                        break;                
                    default:
                        break;
                }
            
               
                
            })
        })
    } 

    function cadastraVisita(ev){
        $mdDialog.show({
            templateUrl: 'visita/novaVisita.html',
            controller: 'visitaController',            
            parent: angular.element(document.body),
            targetEvent: ev            
        }).then(function(novaVisita){
            if (novaVisita) {
                window.location.reload();
            }
        })    
    }

    function editaVisita(ev,visitas){
        $mdDialog.show({
            locals:{data: visitas},
            templateUrl: 'visita/editaVisita.html',
            controller: 'visitaEditarController',            
            parent: angular.element(document.body),
            targetEvent: ev,
            bindToController : true            
        }).then(function(editaVisita){
            if (editaVisita) {
                window.location.reload();
            }
        })        
    }

    function excluiVisita(ev,visitas){
		
        let confirmacao = $mdDialog.confirm()
                .title('Aguardando confirmação')
                .textContent('Confirma o cancelamento da visita de ' + visitas.nomeConvidado)
                .ariaLabel('Msg interna do botao')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');

        $mdDialog.show(confirmacao).then(function() {
                vm.excluir(visitas.id)
        });
    }
        
    
    function excluir(visitaId){
        let dsVisita = new visitaApi();

        dsVisita.id = visitaId;
 
        let sucesso = function(resposta){			
            if (resposta.sucesso) {
                toastr.info('Visita cancelada com sucesso :)');
            }
            window.location.reload();
        }

        let erro = function(resposta){
            console.log(resposta)	
        }

        dsVisita.$delete({id: visitaId},sucesso,erro);
        
    }
}

