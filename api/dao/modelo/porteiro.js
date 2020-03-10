'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Porteiro', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        usuarioId: {
            type: DataTypes.INTEGER,
            field: 'usuario_id',
            allowNull: false,
            comment: 'Usuario associado ao porteiro'
        },        
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Pessoa associada ao porteiro'
        }        
    }, {
        schema: 'public',
        tableName: 'porteiro',
        timestamps: false,
        name:{
            singular:'porteiro',
            plural  :'porteiros'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 

    var dataContext = require('../dao');
    var Porteiro = dataContext.Porteiro;
    var Pessoa = dataContext.Pessoa;
    var Usuario = dataContext.Usuario;    

    Porteiro.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Porteiro.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });
};

