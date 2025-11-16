// src/models/Insumo.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Insumo = sequelize.define('Insumo', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    descripcion: { type: DataTypes.TEXT },
    stock_actual: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
    stock_minimo: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 5.00 },
    unidad_medida: { type: DataTypes.STRING(20), allowNull: false },
    categoria: { type: DataTypes.STRING(100) },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    tableName: 'Insumos',
    timestamps: true
});

module.exports = Insumo;