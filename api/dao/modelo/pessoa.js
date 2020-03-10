'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Pessoa', {
        id: {
            type: DataTypes.INTEGER,
            field: 'id',
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            comment: 'Chave primaria'
        },        
        nome: {
            type: DataTypes.STRING(60),
            field: 'nome',
            allowNull: false,
            comment: 'Nome da pessoa',
            validate: {
                len : {
                    args : [0,60],
                    msg : "Tamanho máximo de 60 caracteres excedido"
                }                
            }
        },
        cpf: {
            type: DataTypes.BIGINT,
            field: 'cpf',
            allowNull: false,
            comment: 'CPF da pessoa'
        },
        nascimento: {
            type: DataTypes.DATE,
            field: 'nascimento',
            allowNull: false,
            comment: 'Dta nascimento'
        },
        digital: {
            type: DataTypes.STRING(5),
            field: 'digital',
            allowNull: false,
            comment: 'Digital unica de cada pessoa'
        },
        enderecoLogradouro: {
            type: DataTypes.STRING(80),
            field: 'endereco_logradouro',
            allowNull: false,
            comment: 'Endereco(rua/av) da pessoa'
        },
        enderecoNumero: {
            type: DataTypes.STRING(10),
            field: 'endereco_numero',
            allowNull: false,
            comment: 'Endereco(numero) da pessoa'
        },
        enderecoBairro: {
            type: DataTypes.STRING(80),
            field: 'endereco_bairro',
            allowNull: false,
            comment: 'Endereco(bairro) da pessoa'
        },
        enderecoCidade: {
            type: DataTypes.STRING(80),
            field: 'endereco_cidade',
            allowNull: false,
            comment: 'CIdade da pessoa'
        },
        enderecoUf: {
            type: DataTypes.STRING(2),
            field: 'endereco_uf',
            allowNull: false,
            comment: 'Estado da pessoa'
        },
        criacao: {
            type: DataTypes.DATE,
            field: 'criacao',
            allowNull: false,
            comment: 'data da criacao da pessoa'
        }

    }, 
    {
        schema: 'public',
        tableName: 'pessoa',
        timestamps: false,
        name:{
            singular:'pessoa',
            plural  :'pessoas'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 
};

