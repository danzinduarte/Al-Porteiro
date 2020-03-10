const dataContext = require('../dao/dao'),
	util = require('../util/util');

function carregaTudo(req,res) {

	if (req.query.search) {
		return dataContext.Pessoa.findAll({			
		where : {	
			nome : {
				$ilike : '%'+req.query.search+'%'
			}
		}			
		}).then(function(pessoas){
			res.status(200).json({				
				sucesso : true,
				data : pessoas
			})		

		});
			
	}
    
    return dataContext.Pessoa.findAll({
    	order : 'id'
    }).then(function(pessoas){
        res.status(200).json({
			sucesso : true,
			data : pessoas
		})
    })
}    


function carregaPorId(req,res) {
    
    return dataContext.Pessoa.findById(req.params.id).then(function(pessoa){
        res.status(200).json({
			sucesso : true,
			data : pessoa
		})
    })

} 

function salvaPessoa(req,res){
	
	let pessoa = req.body.pessoa;	

	pessoa.criacao = new Date();
	pessoa.digital = util.geraDigital();

	if (!pessoa) {
		res.status(409).json({sucesso: false, msg: "Formato de entrada inválido."})
		return;
	}

	
	dataContext.Pessoa.create(pessoa)
	.then(function(novaPessoa){
		res.status(201).json({sucesso: true, data: novaPessoa})
	})
	.catch(function(erro){
		console.log(erro);
		res.status(409).json({ sucesso: false, msg: "Falha ao incluir a nova pessoa" });
	})
}

function excluiPessoa(req,res){
	if (!req.params.id) {
		res.status(409).json({sucesso: false, msg: "Formato de entrada inválido."})
		return;
	}

	dataContext.Pessoa.findById(req.params.id).then(function(pessoa){
        
		if (!pessoa) {
			res.status(404).json({sucesso: false, msg: "Pessoa não encontrada."})
			return;
		}

		pessoa.destroy()
		.then(function(){
			res.status(200).json({
        		sucesso: true,
        		msg: "Registro excluído com sucesso",
        		data: []
        	})	        	
		})
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({ sucesso: false, msg: "Falha ao excluir a pessoa" });	
		})

    })
	
}

function atualizaPessoa(req,res){
	
	if (!req.params.id) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}

	let pessoa = req.body.pessoa;

	if (!pessoa) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}


	dataContext.Pessoa.findById(req.params.id).then(function(pessoa){
		
		if (!pessoa) {
			res.status(404).json({sucesso: false, msg: "Pessoa não encontrada."})
			return;
		}
		
		let updateFields = {
			nome  : pessoa.nome,
			nascimento : pessoa.nascimento,
			enderecoLogradouro : pessoa.endereco.logradouro,
			enderecoNumero : pessoa.endereco.numero,
			enderecoBairro : pessoa.endereco.bairro,
			enderecoCidade : pessoa.endereco.cidade,
			enderecoUf 	   : pessoa.endereco.uf,
		}

		pessoa.update(updateFields)
		.then(function(pessoaAtualizada){
			res.status(200).json({
        		sucesso: true,
        		msg: "Registro atualizado com sucesso",
        		data: pessoaAtualizada
        	})	
		})
		.catch(function(erro){
			console.log(erro);
			res.status(409).json({sucesso: false, msg: "Falha ao atualizar a pessoa" });	
		})

	})
	
}


module.exports = {
    carregaTudo  	: carregaTudo,
    carregaPorId 	: carregaPorId,
    salva 			: salvaPessoa,
    exclui 			: excluiPessoa,
    atualiza 		: atualizaPessoa    
}