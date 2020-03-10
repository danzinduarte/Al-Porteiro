'use strict';

var pg = require('pg');

/// Conexao do sequelize
let Sequelize   = require('sequelize'),
    conexao     = new Sequelize('AloPorteiro', 'postgres', '123456789',
    {
        host: '127.0.0.1',
        port:5432,
        dialect: 'postgres',
        logging: false,
        isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED        
    });


// Configurações para o POSTGRES
var types = {
    FLOAT4: 700,
    FLOAT8: 701,
    NUMERIC: 1700,
    FLOAT4_ARRAY: 1021,
    FLOAT8_ARRAY: 1022,
    NUMERIC_ARRAY: 1231
},

formataFloat = function fnFormataFloat(valor) {
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/.test(valor))
        return Number(valor);
    return 0;
}

pg.types.setTypeParser(types.FLOAT4, 'text', formataFloat);
pg.types.setTypeParser(types.FLOAT8, 'text', formataFloat);
pg.types.setTypeParser(types.NUMERIC, 'text', formataFloat);




/// Instancias dos modelos
var model = {};
var initialized = false;


function init() {
    delete module.exports.init;     
    initialized = true;
    
    
	// Modelos
    model.Usuario               = conexao.import('./modelo/usuario.js');
    model.Porteiro              = conexao.import('./modelo/porteiro.js');
    model.Condomino             = conexao.import('./modelo/condomino.js');
    model.Pessoa                = conexao.import('./modelo/pessoa.js');
    model.Visita                = conexao.import('./modelo/visita.js');
    model.CondominoConvidado    = conexao.import('./modelo/condominoConvidado.js')

    // Arquivos
    require('./modelo/condomino.js').initRelations();
    require('./modelo/porteiro.js').initRelations();
    require('./modelo/usuario.js').initRelations(); 
    require('./modelo/pessoa.js').initRelations();  
    require('./modelo/visita.js').initRelations(); 
    require('./modelo/condominoConvidado.js').initRelations();

    return model;
}

model.Sequelize = Sequelize;
model.conexao   = conexao;

module.exports = model;
module.exports.init = init;
module.exports.isInitialized = initialized;