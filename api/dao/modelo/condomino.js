'use strict';

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Condomino', {
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
            comment: 'Usuario associado ao condimino'
        },        
        pessoaId: {
            type: DataTypes.INTEGER,
            field: 'pessoa_id',
            allowNull: false,
            comment: 'Pessoa vinculada ao condomino'
        },
        endereco: {
            type: DataTypes.STRING(80),
            field: 'endereco',
            allowNull: false,
            comment: 'Endereço, ex. apt 101, quadra 15, etc.'
        },        
    }, 
    
    {
        schema: 'public',
        tableName: 'condomino',
        timestamps: false,
        name:{
            singular:'condomino',
            plural  :'condominos'
        }
    });
};

module.exports.initRelations = function() {
    delete module.exports.initRelations; 

    var dataContext = require('../dao');
    var Condomino = dataContext.Condomino;
    var Pessoa = dataContext.Pessoa;
    var Usuario = dataContext.Usuario;    

    Condomino.belongsTo(Pessoa, {
        foreignKey: 'pessoa_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    Condomino.belongsTo(Usuario, {
        foreignKey: 'usuario_id',
        onDelete: 'NO ACTION',
        onUpdate: 'NO ACTION'
    });

    /*PctUsuario.belongsToMany(EvoCliente, {
        through: EvoClienteUsuario,
        foreignKey: 'pct_usuario_id',
        otherKey: 'evo_cliente_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });*/

    /*PctUsuario.hasMany(PctUsuarioPermissao, {
        foreignKey: 'pct_usuario_id',
        onDelete: 'CASCADE',
        onUpdate: 'NO ACTION'
    });*/ 
};

