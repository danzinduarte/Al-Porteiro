const dataContext = require('../dao/dao'),
    util          = require('../util/util');

function carregaTudo(req,res) {
    
    if (req.query.condominoId) {
		return dataContext.CondominoConvidado.findAll({			
            include : [
                {
                    model : dataContext.Pessoa,
                    where : {
                        nome : {
                            $ilike : '%'+req.query.search+'%'
                        }
                    }
                }
            ],   
            where : {	
                condominoId : Number(req.query.condominoId)
            }			
		}).then(function(convidados){
			res.status(200).json({				
				sucesso : true,
				data : convidados
			})		

		});
			
    }   
    
    return dataContext.CondominoConvidado.findAll({
        include : [
            {
                model : dataContext.Pessoa
            },
            {
                model : dataContext.Condomino,
                attributes : ['endereco'],
                    include :{
                        model : dataContext.Pessoa,
                        attributes :['nome']
                    }
            }
        ],           
        order : 'id'
    }).then(function(convidados){        

        convidados = convidados.map(function(conv){
           
            conv = conv.get({plain : true})

            delete conv.pessoa_id;
            delete conv.condomino_id;
        
            return conv;
        });
        res.status(200).json({
			sucesso : true,
			data : convidados
		})
       
    })
    
}    


function carregaPorId(req,res) {
    //req.param.id porque passei na URL

    return dataContext.CondominoConvidado.findById(req.params.id,{
        include : [
            {
                model : dataContext.Pessoa
            }
        ]    
    }).then(function(convidado){       

        //Por padrão retorna o status
        res.status(200).json({
			sucesso: true,
			data: convidado
		})
    })


} 

function salvaConvidado(req,res){
    //req.body campos do body
    //Mesma coisa que [FromBody] no C#           
       let convidado = req.body.convidado,
            pessoa = {
               nome                : convidado.pessoa.nome,
               cpf                 : convidado.pessoa.cpf,
               nascimento          : convidado.pessoa.nascimento,
               digital             : util.geraDigital(),
               enderecoLogradouro  : convidado.pessoa.enderecoLogradouro,
               enderecoNumero      : convidado.pessoa.enderecoNumero,
               enderecoBairro      : convidado.pessoa.enderecoBairro,
               enderecoCidade      : convidado.pessoa.enderecoCidade,
               enderecoUf          : convidado.pessoa.enderecoUf,
               criacao             : new Date()
           }
           
   
    if (!convidado) {
     res.status(404).json({
        sucesso: false, 
        msg: "Formato de entrada inválido."
     })
     return;
    }    
       
       //variavel para receber o usuario criado devido ao "Clojure"
       let resposta;
   
       dataContext.Pessoa.create(pessoa).then(function(novaPessoa){     
           respostaPessoa = novaPessoa;
           return dataContext.CondominoConvidado.create({
               condominoId : convidado.condominoId,
               pessoaId  : respostaPessoa.id,
               favorito : false 
           })
       })
       .then(function(convidado){
                      
           res.status(201).json({
               sucesso : true,
               msg : "Visitante cadastrado com exito",
               data : resposta
           })
       })
       .catch(function(e){
           console.log(e)
           res.status(409).json({ 
               sucesso: false,
               msg: "Falha ao incluir novo visitante" 
           })
       })
   }

function excluiConvidado(req,res){
    
    if (!req.params.id) {
		res.status(409).json({sucesso: false, msg: "Formato de entrada inválido."})
		return;
	}

	dataContext.CondominoConvidado.findById(req.params.id).then(function(convidado){
        
		if (!convidado) {
			res.status(404).json({sucesso: false, msg: "Convidado não encontrado."})
			return;
        }
        return dataContext.Pessoa.findById(convidado.pessoaId).then(function(pessoa){
            pessoa.destroy()
            .then(function(){
                convidado.destroy()
                res.status(200).json({sucesso: true, msg: "Convidado excluido com sucesso"})
            })          
        })
    
    }).catch(function(erro){
        console.log(erro);
        res.status(409).json({ sucesso: false, msg: "Falha ao excluir convidado" });	
    })
}

function atualizaConvidado(req,res){
	
	if (!req.params.id) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}
    
    let convidado = req.body.CondominoConvidado;   
    let conv = req.body.CondominoConvidado;
  

	if (!convidado) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}

	dataContext.CondominoConvidado.findById(req.params.id).then(function(convidado){
		
		if (!convidado) {
			res.status(404).json({sucesso: false, msg: "Convidado não encontrado."})
			return;
        }
        
        let updateConvidado = {
            condominoId : conv.condominoId,
            favorito : conv.favorito
        }

        convidado.update(updateConvidado).then(function(){        

            return dataContext.Pessoa.findById(porteiro.pessoaId).then(function(pessoa){                
            
                let updateFields = {
                    
                    nome                : port.pessoa.nome,
                    cpf                 : port.pessoa.cpf,
                    nascimento          : port.pessoa.nascimento,
                    enderecoLogradouro  : port.pessoa.enderecoLogradouro,
                    enderecoNumero      : port.pessoa.enderecoNumero,
                    enderecoBairro      : port.pessoa.enderecoBairro,
                    enderecoCidade      : port.pessoa.enderecoCidade,
                    enderecoUf          : port.pessoa.enderecoUf,
            
                }        
            
            pessoa.update(updateFields).then(function(convAtualizado){     
                    
                res.status(200).json({
                    sucesso: true,
                    msg: "Convidado atualizado.",
                    data:convAtualizado
                })
            })
        })
	})
        
        }).catch(function(erro){
                console.log(erro);
                res.status(409).json({ sucesso: false, msg: "Falha ao excluir porteiro" });	
        })

}


module.exports = {
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaConvidado,
    exclui 			: excluiConvidado,
    atualiza 		: atualizaConvidado    
}