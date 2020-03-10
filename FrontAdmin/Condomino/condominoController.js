angular.module('appAloPorteiro')
.controller('condominoListaController',condominoListaController)
.controller('condominoController',condominoController)
.controller('condominoEditarController',condominoEditarController);

function condominoListaController($scope,$resource,$mdDialog){
    
    $scope.vm = {}
    let vm = $scope.vm

    let condominoApi = $resource('http://localhost:3000/api/condomino/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })
    
    function init(){
        carregaCondominos();
    }    
    init();

    
    vm.carregaCondominos = carregaCondominos;
    vm.cadastraCondomino = cadastraCondomino;
    vm.editaCondomino    = editaCondomino;
    vm.excluiCondomino   = excluiCondomino;
    vm.excluir          = excluir; 



    function carregaCondominos(){
        vm.condominos = new condominoApi()
        vm.condominos.$get().then(function(resposta){
            console.log(resposta)
            vm.condominos.data = resposta.data
        })
    } 

    function cadastraCondomino(ev){
        $mdDialog.show({
            templateUrl: 'condomino/novoCondomino.html',
            controller: 'condominoController',            
            parent: angular.element(document.body),
            targetEvent: ev            
        }).then(function(novoCondomino){
            if (novoCondomino) {
                vm.carregaCondominos()
            }
        })    
    }

    function editaCondomino(ev,condomino){
        $mdDialog.show({
            locals:{data: condomino},
            templateUrl: 'condomino/editaCondomino.html',
            controller: 'condominoEditarController',            
            parent: angular.element(document.body),
            targetEvent: ev,
            bindToController : true            
        }).then(function(editaCondomino){
            if (editaCondomino) {
                vm.carregaCondominos()
            }
        })        
    }

    function excluiCondomino(ev,condomino){
		
        let confirmacao = $mdDialog.confirm()
                .title('Aguardando confirmação')
                .textContent('Confirma a exclusão do condomino ' + condomino.pessoa.nome)
                .ariaLabel('Msg interna do botao')
                .targetEvent(ev)
                .ok('Sim')
                .cancel('Não');

        $mdDialog.show(confirmacao).then(function() {
                vm.excluir(condomino.id)
        });
    }
        
    
    function excluir(condominoId){
        let dsCondomino = new condominoApi();

        dsCondomino.id = condominoId;

        let sucesso = function(resposta){			
            if (resposta.sucesso) {
                toastr.info('Condomino excluido com sucesso :)');
            }
            carregaCondominos();
        }

        let erro = function(resposta){
            console.log(resposta)	
        }

        dsCondomino.$delete({id: condominoId},sucesso,erro);
        
    }
}


function condominoController($scope, $resource,$mdDialog){
    $scope.vm = {}
    let vm = $scope.vm

    let condominoApi = $resource('http://localhost:3000/api/condomino/:id' , {id :'@id'}, {
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
        let dsCondomino = new condominoApi();
        let condomino = {
            endereco : vm.condominoEndereco,
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
            },
            
        };
            
        dsCondomino.condomino = condomino;        

        
        let sucesso = function(resposta){
			console.log(resposta)
			
			if (resposta.sucesso) {				

				if (vm.condominoId) {
					toastr.info("Condomino atualizado com êxito","SUCESSO")
				} else {
					toastr.success("Condomino incluído com êxito :)","SUCESSO")	
				}
    
                $mdDialog.hide(true);
			}
			
		}

		let erro = function(resposta){
			console.log(resposta)	
        }
        
        if (vm.condominoId) {
			dsCondomino.id = vm.condominoId;
			dsCondomino.$update().then(sucesso,erro);
			//vm.pessoaForm.$setUntouched();								
		} else {
			dsCondomino.$save().then(sucesso,erro)               				
		}
    
    }     
  
    
}

function condominoEditarController($scope,$resource,$mdDialog,data){
    
    $scope.vm = {}
    let vm = $scope.vm

    let condominoApi = $resource('http://localhost:3000/api/condomino/:id' , {id :'@id'}, {
        update : {
            method : 'PUT'
        }
    })
    
    vm.carregaCondominos = carregaCondominos;
    vm.salvar = salvar;
    vm.cancelar = cancelar;


    function carregaCondominos(){
        vm.dsCondominos = new condominoApi()
        vm.dsCondominos.$get().then(function(resposta){
            console.log(resposta)
            vm.dsCondominos.data = resposta.data
        })
    } 

    function cancelar() {
        $mdDialog.cancel();
    }
    
    function salvar(){
        let dsCondomino = new condominoApi();
        let condomino = {
            endereco : vm.condominoEndereco,
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
            },
            
        };
            
        dsCondomino.condomino = condomino;
        

        
        let sucesso = function(resposta){
			console.log(resposta)
			
			if (resposta.sucesso) {				

				if (vm.condominoId) {
					toastr.info("Condomino atualizado com êxito","SUCESSO")
				} else {
					toastr.success("Condomino incluído com êxito :)","SUCESSO")	
				}
    
                $mdDialog.hide(true);
            }
            carregaCondominos();
			
		}

		let erro = function(resposta){
			console.log(resposta)	
        }
        
        if (vm.condominoId) {
			dsCondomino.id = vm.condominoId;
			dsCondomino.$update().then(sucesso,erro);
			//vm.pessoaForm.$setUntouched();								
		} else {
			dsCondomino.$save().then(sucesso,erro)               				
		}
    
    }

    vm.condominoId               = data.id;   
    
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

    vm.condominoEndereco        = data.endereco
    vm.porteiroSenha1           = vm.usuarioSenha
}