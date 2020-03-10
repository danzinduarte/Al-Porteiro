'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('CondominoConvidado', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },
        condominoId: {
            type: DataTypes.INTEGER,
            field: 'condomino_id',
            allowNull: false,
            comment: 'Condomino vinculado ao visitante'
        },        
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Pessoa associada ao visitante'
        },
        favorito: {
            type: DataTypes.BOOLEAN,
            field: 'favorito',
            allowNull: true,
            comment: 'Favoritar convidado'
        }        
    }, {
        schema: 'public',
        tableName: 'condominoConvidado',
        timestamps: false,
        name:{
            singular:'condominoConvidado',
            plural  :'condominoConvidados'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 

    var dataContext = require('../dao');
    var CondominoConvidado = dataContext.CondominoConvidado;
    var Pessoa = dataContext.Pessoa;
    var Condomino = dataContext.Condomino;    

    CondominoConvidado.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });

    CondominoConvidado.belongsTo(Condomino, {
        foreignKey: 'condomino_id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    });
};

