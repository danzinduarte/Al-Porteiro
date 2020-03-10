'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Visita', {
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
        },        
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
        },
        dataHoraReserva: {
            type: DataTypes.DATE,
            field: 'data_hora_reserva',
            allowNull: false,
            comment: 'Data e hora do agendamento da visita'
        },                
        nomeConvidado: {
            type: DataTypes.STRING(60),
            field: 'nome_convidado',
            allowNull: false,
            comment: 'Nome da pessoa convidado',
            validate: {
                len : {
                    args : [0,80],
                    msg : "Tamanho máximo de 80 caracteres excedido"
                }                
            }
        },
        condominoObservacao: {
            type: DataTypes.STRING(120),
            field: 'condomino_observacao',
            allowNull: true,
            validate: {
                len : {
                    args : [0,120],
                    msg : "Tamanho máximo de 120 caracteres excedido"
                }                
            }
        },
        dataHoraExpiracao: {
            type: DataTypes.DATE,
            field: 'data_hora_expiracao',
            allowNull: true,
        },                
        situacao: {
            type: DataTypes.INTEGER,
            field: 'situacao',
            allowNull: true,
            comment: ''
        },
        portariaDataHoraChegada: {
            type: DataTypes.DATE,
            field: 'portaria_data_hora_chegada',
            allowNull: true,
        },
        porteiroId: {
            type: DataTypes.INTEGER,
            field: 'porteiro_id',
            allowNull: true,
        },              
        portariaObservacao: {
            type: DataTypes.STRING(120),
            field: 'portaria_observacao',
            allowNull: true,
            validate: {
                len : {
                    args : [0,120],
                    msg : "Tamanho máximo de 120 caracteres excedido"
                }                
            }
        }
    }, 
    {
        schema: 'public',
        tableName: 'visita',
        timestamps: false,
        name:{
            singular:'visita',
            plural  :'visitas'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 

    var dataContext = require('../dao');
    var Visita = dataContext.Visita;
    var Condomino = dataContext.Condomino;
    var Pessoa = dataContext.Pessoa;
    var Porteiro = dataContext.Porteiro;    

    Visita.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Visita.belongsTo(Porteiro, {
        foreignKey: 'porteiro_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Visita.belongsTo(Condomino, {
        foreignKey: 'condomino_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });
};

