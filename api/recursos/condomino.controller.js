const dataContext = require('../dao/dao'),
    util          = require('../util/util');

function carregaTudo(req,res) {
    
    return dataContext.Condomino.findAll({
            include : [
                {
                    model       : dataContext.Usuario,
                    attributes : ['email','senha']
                },
                {
                    model : dataContext.Pessoa
                }
            ],           
        order : 'id'
    }).then(function(condominos){
        res.status(200).json({
			sucesso : true,
			data : condominos
		})
    })
}    


function carregaPorId(req,res) {
    //req.param.id porque passei na URL
    return dataContext.Condomino.findById(req.params.id,{
        include : [
            {
                model       : dataContext.Usuario,
                attributes : ['email','desativado']
            },
            {
                model : dataContext.Pessoa
            }
        ]    
    }).then(function(condomino){
        
        condomino = condomino.get({plain : true})

        delete condomino.pessoa_id;
        delete condomino.usuario_id;

        //Por padrão retorna o status
        res.status(200).json({
			sucesso: true,
			data: condomino
		})
    })


} 

function salvaCondomino(req,res){
    //req.body campos do body
    //Mesma coisa que [FromBody] no C#
       let condomino = req.body.condomino,  
           usuario = {
               email : condomino.usuario.email,
               senha : condomino.usuario.senha,
               tipo  : 2,
               desativado : false,
               criacao : new Date()
           },
           pessoa = {
               nome                : condomino.pessoa.nome,
               cpf                 : condomino.pessoa.cpf,
               nascimento          : condomino.pessoa.nascimento,
               digital             : util.geraDigital(),
               enderecoLogradouro  : condomino.pessoa.enderecoLogradouro,
               enderecoNumero      : condomino.pessoa.enderecoNumero,
               enderecoBairro      : condomino.pessoa.enderecoBairro,
               enderecoCidade      : condomino.pessoa.enderecoCidade,
               enderecoUf          : condomino.pessoa.enderecoUf,
               criacao             : new Date()
           }

   
    if (!condomino) {
     res.status(404).json({
        sucesso: false, 
        msg: "Formato de entrada inválido."
     })
     return;
    }    
       
       //variavel para receber o usuario criado devido ao "Clojure"
       let resposta;
   
       dataContext.Usuario.create(usuario).then(function(novoUsuario){     
           respostaUsuario = novoUsuario;
           return dataContext.Pessoa.create(pessoa)
       })
       .then(function(novaPessoa){
           respostaPessoa = novaPessoa;
           return dataContext.Condomino.create({
               usuarioId : respostaUsuario.id,
               pessoaId  : respostaPessoa.id,
               endereco : condomino.endereco
           })
       })
       .then(function(novoCondomino){
           respostaCondomino = novoCondomino;
           
           res.status(201).json({
               sucesso : true,
               msg : "Condomino incluido com exito",
               data : resposta
           })
       })
       .catch(function(e){
           
           res.status(409).json({ 
               sucesso: false,
               msg: "Falha ao incluir o condomino" 
           })
       })
   }

function excluiCondomino(req,res){
    
    if (!req.params.id) {
		res.status(409).json({sucesso: false, msg: "Formato de entrada inválido."})
		return;
	}

	dataContext.Condomino.findById(req.params.id).then(function(condomino){
        
		if (!condomino) {
			res.status(404).json({sucesso: false, msg: "Condomino não encontrado."})
			return;
        }
        return dataContext.Usuario.findById(condomino.usuarioId).then(function(usuario){
            usuario.destroy()
            .then(function(){
                return dataContext.Pessoa.findById(condomino.pessoaId).then(function(pessoa){ 
                pessoa.destroy()    	
            })
            .then(function(){
                condomino.destroy()
                res.status(200).json({sucesso: true, msg: "Condomino excluido com sucesso"})
            })          
        })    
    })
    
    }).catch(function(erro){
        console.log(erro);
        res.status(409).json({ sucesso: false, msg: "Falha ao excluir condomino" });	
    })
}

function atualizaCondomino(req,res){
	
	if (!req.params.id) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}
    
    let condomino = req.body.condomino;   
    let cond = req.body.condomino;
  

	if (!condomino) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}

	dataContext.Condomino.findById(req.params.id).then(function(condomino){
		
		if (!condomino) {
			res.status(404).json({sucesso: false, msg: "Condomino não encontrado."})
			return;
        }

        let updateCondomino = {
            endereco : cond.endereco
        }

        condomino.update(updateCondomino).then(function(){
            
        return dataContext.Pessoa.findById(condomino.pessoaId).then(function(pessoa){                
        
            let updateFields = {
               
                nome                : cond.pessoa.nome,
                cpf                 : cond.pessoa.cpf,
                nascimento          : cond.pessoa.nascimento,
                enderecoLogradouro  : cond.pessoa.enderecoLogradouro,
                enderecoNumero      : cond.pessoa.enderecoNumero,
                enderecoBairro      : cond.pessoa.enderecoBairro,
                enderecoCidade      : cond.pessoa.enderecoCidade,
                enderecoUf          : cond.pessoa.enderecoUf,
        
            }        
        
		pessoa.update(updateFields).then(function(){
            
            return dataContext.Usuario.findById(condomino.usuarioId).then(function(usuario){ 
                
                let updateUsuario = {               
                    email                : cond.usuario.email,
                    senha                : cond.usuario.senha,
                }

                usuario.update(updateUsuario).then(function(condAtualizado){
                    res.status(200).json({
                        sucesso: true,
                        msg: "Condomino atualizado",
                        data:condAtualizado
                    })
                })
            })
		})
    })
})
	
        }).catch(function(erro){
            console.log(erro);
            res.status(409).json({ sucesso: false, msg: "Falha ao excluir condomino" });	
     })

}


module.exports = {
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaCondomino,
    exclui 			: excluiCondomino,
    atualiza 		: atualizaCondomino    
}