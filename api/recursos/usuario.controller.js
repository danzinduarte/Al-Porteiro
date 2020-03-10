let dataContext = require('../dao/dao');

function carregaTudo(req,res) {
    
    return dataContext.Usuario.findAll({
    	order : 'id'
    }).then(function(usuarios){
        res.status(200).json({
			sucesso : true,
			data : usuarios
		})
    })
}    


function carregaPorId(req,res) {
    
    return dataContext.Usuario.findById(req.params.id).then(function(usuarios){
        res.status(200).json({
			sucesso : true,
			data : usuarios
		})
    })


} 

function salvaUsuario(req,res){
	
	let usuario = req.body.usuario;

	usuario.criacao = new Date();
	usuario.desativado = false;
	
	if (!usuario) {
		res.status(409).json({sucesso: false, msg: "Formato de entrada inválido."})
		return;
	}

	
	dataContext.Usuario.create(usuario)
	.then(function(novoUsuario){
		res.status(201).json({sucesso: true, data: novoUsuario})
	})
	.catch(function(erro){
		console.log(erro);
		res.status(409).json({ sucesso: false, msg: "Falha ao incluir a novo usuario" });
	})
}

function excluiUsuario(req,res){
	if (!req.params.id) {
		res.status(409).json({sucesso: false, msg: "Formato de entrada inválido."})
		return;
	}

	dataContext.Usuario.findById(req.params.id).then(function(usuario){
        
		if (!usuario) {
			res.status(404).json({sucesso: false, msg: "Pessoa não encontrada."})
			return;
		}

		usuario.destroy()
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

function atualizaUsuario(req,res){
	
	if (!req.params.id) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}

	let usuario = req.body.usuario;

	if (!usuario) {
		res.status(409).json({sucesso : false, msg: "Formato de entrada inválido."})
		return;
	}


	dataContext.Usuario.findById(req.params.id).then(function(usuario){
		
		if (!usuario) {
			res.status(404).json({sucesso: false, msg: "Pessoa não encontrada."})
			return;
		}
		
		let updateFields = {
			email  : usuario.email,
			tipo   : usuario.tipo,
			senha  : usuario.senha,			
		}

		usuario.update(updateFields)
		.then(function(usuarioAtualizado){
			res.status(200).json({
        		sucesso: true,
        		msg: "Registro atualizado com sucesso",
        		data: usuarioAtualizado
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
    salva 			: salvaUsuario,
    exclui 			: excluiUsuario,
    atualiza 		: atualizaUsuario    
}