const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Usuario = sequelize.define('Usuario', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    rol: {
        type: DataTypes.ENUM(
            'Chef de Cocina',
            'Encargado de Almacen',
            'Jefe de Almacen',
            'Encargado de Compras',
            'Dueño'
        ),
        allowNull: false
    },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW }
}, {
    tableName: 'usuarios', // 👈 Todo minúscula
    timestamps: true
});

module.exports = Usuario;