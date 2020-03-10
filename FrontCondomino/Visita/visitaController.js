angular.module('appAloPorteiro')
.controller('visitaListaController',visitaListaController)
.controller('visitaController',visitaController)
.controller('visitaEditarController',visitaEditarController);


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


function visitaController($scope, $resource,$mdDialog, $localStorage){
    $scope.vm = {}
    let vm = $scope.vm

    let visitaApi = $resource('http://localhost:3000/api/visita/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })

    let convidadoApi = $resource('http://localhost:3000/api/condominoConvidado/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })

    vm.query = {
        text : ''
    }

    
    function init(){
        carregaConvidados($localStorage.condomino.id);
        vm.condomino = $localStorage.condomino.nome
        vm.dataHoraReserva = new Date();
        
    }   
    init()      

    vm.cancelar = cancelar;
    vm.salvar   = salvar;  
    vm.carregaConvidados = carregaConvidados;
    vm.carregaCard = carregaCard

    function carregaConvidados(condominoId){
        vm.dsConvidado = new convidadoApi();
        return vm.dsConvidado.$get({search : condominoId}).then(function(convidados){ 
            console.log(condominoId)           
            return vm.dsConvidado.data = convidados.data            
        
        })    
    }

    function carregaCard(convidado){
        vm.query.item = convidado
        vm.query.text = vm.query.item.pessoa.nome
    }


    function cancelar() {
        $mdDialog.cancel();
    }

    function salvar(){
        let dsVisita = new visitaApi();
        
        vm.dataHoraReserva.setHours(vm.horaReserva.getHours()- 3)
        vm.dataHoraReserva.setMinutes(vm.horaReserva.getMinutes())
        
        let visita = {
            condominoId : $localStorage.condomino.id,
            pessoaId : vm.query.item.pessoa.id, 
            dataHoraReserva : vm.dataHoraReserva ,
            nomeConvidado : vm.query.item.pessoa.nome,
            condominoObservacao : vm.condominoObservacao,           
        };
            
        dsVisita.visita = visita;        

        
        let sucesso = function(resposta){
			console.log(resposta)
			
			if (resposta.sucesso) {				

				if (vm.visitaId) {
					toastr.info("Visita atualizada com sucesso","SUCESSO")
				} else {
					toastr.success("Visita agendada com sucesso :)","SUCESSO")	
				}
    
                $mdDialog.hide(true);
			}
			
		}

		let erro = function(resposta){
			console.log(resposta)	
        }
        
        if (vm.visitaId) {
			dsVisita.id = vm.visitaId;
			dsVisita.$update().then(sucesso,erro);
			//vm.pessoaForm.$setUntouched();								
		} else {
			dsVisita.$save().then(sucesso,erro)               				
		}
    
    }     

   
    
}



function visitaEditarController($scope,$resource,$mdDialog,data){
    
    $scope.vm = {}
    let vm = $scope.vm

    let visitaApi = $resource('http://localhost:3000/api/visita/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })
    
    vm.carregaVisitas = carregaVisitas;
    vm.salvar = salvar;
    vm.cancelar = cancelar;


    function carregaVisitas(){
        vm.dsVisita = new visitaApi()
        vm.dsVisita.$get().then(function(resposta){
            console.log(resposta)
            vm.dsVisita.data = resposta.data
        })
    } 

    function cancelar() {
        $mdDialog.cancel();
    }
    
    function salvar(){
        let dsVisita = new visitaApi();

        vm.dataHoraReserva = new Date(vm.dataHoraReserva)
        vm.dataHoraReserva.setHours(vm.horaReserva.getHours()- 3)
        vm.dataHoraReserva.setMinutes(vm.horaReserva.getMinutes())
        vm.dataHoraExpiracao = new Date(vm.dataHoraReserva)
        vm.dataHoraExpiracao.setHours(vm.dataHoraReserva.getHours() + 4)

        let visita = {
            condominoId : vm.condominoId,
            pessoaId : vm.pessoaId, 
            dataHoraReserva : vm.dataHoraReserva,
            nomeConvidado : vm.nomeConvidado,
            condominoObservacao : vm.condominoObservacao,
            dataHoraExpiracao : vm.dataHoraExpiracao           
        };
            
        dsVisita.visita = visita;       

        
        let sucesso = function(resposta){
			//console.log(resposta)
			
			if (resposta.sucesso) {				

				if (vm.visitaId) {
					toastr.info("Visita atualizada com sucesso","SUCESSO")
				} else {
					toastr.success("Visita agendada com sucesso :)","SUCESSO")	
				}
    
                $mdDialog.hide(true);
            }
            carregaVisitas();
			
		}

		let erro = function(resposta){
			console.log(resposta)	
        }
        
        if (vm.visitaId) {
			dsVisita.id = vm.visitaId;
			dsVisita.$update().then(sucesso,erro);
			//vm.pessoaForm.$setUntouched();								
		} else {
			dsVisita.$save().then(sucesso,erro)               				
		}
    
    }

    vm.visitaId                     = data.id;   
    
    vm.condominoId				    = data.condominoId
    vm.pessoaId				        = data.pessoaId     
    vm.dataHoraReserva			 	= data.dataHoraReserva
    vm.nomeConvidado			 	= data.nomeConvidado
    vm.condominoObservacao		    = data.condominoObservacao
    vm.dataHoraExpiracao            = data.dataHoraExpiracao
    vm.horaReserva                  = new Date(vm.dataHoraReserva)   
}
