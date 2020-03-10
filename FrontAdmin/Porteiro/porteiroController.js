angular.module('appAloPorteiro')
.controller('porteiroListaController',porteiroListaController)
.controller('porteiroController',porteiroController)
.controller('porteiroEditarController',porteiroEditarController);

function porteiroListaController($scope,$resource,$mdDialog){
    
    $scope.vm = {}
    let vm = $scope.vm

    let porteiroApi = $resource('http://localhost:3000/api/porteiro/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })
    
    function init(){
        carregaPorteiros();
    }    
    init();

    
    vm.carregaPorteiros = carregaPorteiros;
    vm.cadastraPorteiro = cadastraPorteiro;
    vm.editaPorteiro    = editaPorteiro;
    vm.excluiPorteiro   = excluiPorteiro;
    vm.excluir          = excluir; 



    function carregaPorteiros(){
        vm.porteiros = new porteiroApi()
        vm.porteiros.$get().then(function(resposta){
            console.log(resposta)
            vm.porteiros.data = resposta.data
        })
    } 

    function cadastraPorteiro(ev){
        $mdDialog.show({
            templateUrl: 'porteiro/novoPorteiro.html',
            controller: 'porteiroController',            
            parent: angular.element(document.body),
            targetEvent: ev            
        }).then(function(novoCadastro){
            if (novoCadastro) {
                vm.carregaPorteiros()
            }
        })    
    }

    function editaPorteiro(ev,porteiro){
        $mdDialog.show({
            locals:{data: porteiro},
            templateUrl: 'porteiro/editaPorteiro.html',
            controller: 'porteiroEditarController',            
            parent: angular.element(document.body),
            targetEvent: ev,
            bindToController : true            
        }).then(function(editaPorteiro){
            if (editaPorteiro) {
                vm.carregaPorteiros()
            }
        })        
    }

    function excluiPorteiro(ev,porteiro){
		
        let confirmacao = $mdDialog.confirm()
                .title('Aguardando confirmação')
                .textContent('Confirma a exclusão do porteiro ' + porteiro.pessoa.nome)
                .ariaLabel('Msg interna do botao')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');

        $mdDialog.show(confirmacao).then(function() {
                vm.excluir(porteiro.id)
        });
    }
        
    
    function excluir(porteiroId){
        let dsPorteiro = new porteiroApi();

        dsPorteiro.id = porteiroId;

        let sucesso = function(resposta){			
            if (resposta.sucesso) {
                toastr.info('Porteiro excluido com sucesso :)');
            }
            carregaPorteiros();
        }

        let erro = function(resposta){
            console.log(resposta)	
        }

        dsPorteiro.$delete({id: porteiroId},sucesso,erro);
        
    }



}


function porteiroController($scope, $resource,$mdDialog){
    $scope.vm = {}
    let vm = $scope.vm

    let porteiroApi = $resource('http://localhost:3000/api/porteiro/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })
    
    function init(){
        
    }      

    vm.cancelar = cancelar;
    vm.salvar   = salvar;   


    function cancelar() {
        $mdDialog.cancel();
    }

    function salvar(){
        let dsPorteiro = new porteiroApi();
        let porteiro = {
                usuario : {
                    email : vm.usuarioEmail,
                    senha : vm.usuarioSenha
                },
                pessoa : {
                    nome : vm.pessoaNome,
                    cpf : vm.pessoaCpf,
                    nascimento : vm.pessoaNascimento,
                    enderecoLogradouro : vm.pessoaLogradouro,
                    enderecoNumero  : vm.pessoaNumero,
                    enderecoBairro  : vm.pessoaBairro,
                    enderecoCidade  : vm.pessoaCidade,
                    enderecoUf  : vm.pessoaUf
                }
            };
            
        dsPorteiro.porteiro = porteiro;
        

        
        let sucesso = function(resposta){
			console.log(resposta)
			
			if (resposta.sucesso) {				

				if (vm.porteiroId) {
					toastr.info("Cliente atualizado com êxito","SUCESSO")
				} else {
					toastr.success("Cliente incluído com êxito :)","SUCESSO")	
				}
    
                $mdDialog.hide(true);
			}
			
		}

		let erro = function(resposta){
			console.log(resposta)	
        }
        
        if (vm.porteiroId) {
			dsPorteiro.id = vm.porteiroId;
			dsPorteiro.$update().then(sucesso,erro);
			//vm.pessoaForm.$setUntouched();								
		} else {
			dsPorteiro.$save().then(sucesso,erro)               				
		}
    
    }
     
  
    
}

function porteiroEditarController($scope,$resource,$mdDialog,data){
    
    $scope.vm = {}
    let vm = $scope.vm

    let porteiroApi = $resource('http://localhost:3000/api/porteiro/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })
    
    vm.carregaPorteiros = carregaPorteiros;
    vm.salvar = salvar;
    vm.cancelar = cancelar;


    function carregaPorteiros(){
        vm.porteiros = new porteiroApi()
        vm.porteiros.$get().then(function(resposta){
            console.log(resposta)
            vm.porteiros.data = resposta.data
        })
    } 

    function cancelar() {
        $mdDialog.cancel();
    }
    
    function salvar(){
        let dsPorteiro = new porteiroApi();
        let porteiro = {
                usuario : {
                    email : vm.usuarioEmail,
                    senha : vm.usuarioSenha
                },
                pessoa : {
                    nome : vm.pessoaNome,
                    cpf : vm.pessoaCpf,
                    nascimento : vm.pessoaNascimento,
                    enderecoLogradouro : vm.pessoaLogradouro,
                    enderecoNumero  : vm.pessoaNumero,
                    enderecoBairro  : vm.pessoaBairro,
                    enderecoCidade  : vm.pessoaCidade,
                    enderecoUf  : vm.pessoaUf
                }
            };
            
        dsPorteiro.porteiro = porteiro;
        

        
        let sucesso = function(resposta){
			console.log(resposta)
			
			if (resposta.sucesso) {				

				if (vm.porteiroId) {
					toastr.info("Cliente atualizado com êxito","SUCESSO")
				} else {
					toastr.success("Cliente incluído com êxito :)","SUCESSO")	
				}
    
                $mdDialog.hide(true);
            }
            carregaPorteiros();
			
		}

		let erro = function(resposta){
			console.log(resposta)	
        }
        
        if (vm.porteiroId) {
			dsPorteiro.id = vm.porteiroId;
			dsPorteiro.$update().then(sucesso,erro);
			//vm.pessoaForm.$setUntouched();								
		} else {
			dsPorteiro.$save().then(sucesso,erro)               				
		}
    
    }

    vm.porteiroId               = data.id;   
    
    vm.usuarioEmail				= data.usuario.email
    vm.usuarioSenha				= data.usuario.senha
     
    vm.pessoaCpf			 	= data.pessoa.cpf
    vm.pessoaNome			 	= data.pessoa.nome
    vm.pessoaNascimento		    = data.pessoa.nascimento   
    vm.pessoaLogradouro		    = data.pessoa.enderecoLogradouro
    vm.pessoaNumero			    = data.pessoa.enderecoNumero
    vm.pessoaBairro			    = data.pessoa.enderecoBairro
    vm.pessoaCidade			    = data.pessoa.enderecoCidade
    vm.pessoaUf				    = data.pessoa.enderecoUf  

}