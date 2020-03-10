let rota = require('express').Router();


let pessoaController = require('../recursos/pessoa.controller');
let usuarioController = require('../recursos/usuario.controller');
let porteiroController = require('../recursos/porteiro.controller');
let condominoController = require('../recursos/condomino.controller');
let visitaController = require('../recursos/visita.controller');
let convidadoController = require('../recursos/condominoConvidado.controller');

rota.get('/pessoa', pessoaController.carregaTudo);
rota.get('/pessoa/:id', pessoaController.carregaPorId);
rota.post('/pessoa', pessoaController.salva)
rota.delete('/pessoa/:id', pessoaController.exclui)
rota.put('/pessoa/:id', pessoaController.atualiza)

rota.get('/usuario',usuarioController.carregaTudo)
rota.get('/usuario/:id',usuarioController.carregaPorId)
rota.post('/usuario', usuarioController.salva)
rota.delete('/usuario/:id',usuarioController.exclui)
rota.put('/usuario/:id',usuarioController.atualiza)

rota.get('/porteiro',porteiroController.carregaTudo)
rota.get('/porteiro/:id',porteiroController.carregaPorId)
rota.post('/porteiro', porteiroController.salva)
rota.delete('/porteiro/:id',porteiroController.exclui)
rota.put('/porteiro/:id',porteiroController.atualiza)

rota.get('/condomino',condominoController.carregaTudo)
rota.get('/condomino/:id',condominoController.carregaPorId)
rota.post('/condomino', condominoController.salva)
rota.delete('/condomino/:id',condominoController.exclui)
rota.put('/condomino/:id',condominoController.atualiza)

rota.get('/visita',visitaController.carregaTudo)
rota.get('/visita/:id',visitaController.carregaPorId)
rota.post('/visita', visitaController.salva)
rota.delete('/visita/:id',visitaController.exclui)
rota.put('/visita/:id',visitaController.atualiza)

rota.get('/condominoConvidado',convidadoController.carregaTudo)
rota.get('/condominoConvidado/:id',convidadoController.carregaPorId)
rota.post('/condominoConvidado', convidadoController.salva)
rota.delete('/condominoConvidado/:id',convidadoController.exclui)
rota.put('/condominoConvidado/:id',convidadoController.atualiza)


module.exports = rota;