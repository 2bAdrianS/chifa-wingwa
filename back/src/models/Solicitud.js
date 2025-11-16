// src/models/Solicitud.js
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Solicitud = sequelize.define('Solicitud', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_solicitante: { type: DataTypes.INTEGER, allowNull: false },
    estado: {
        type: DataTypes.ENUM(
            'Pendiente',
            'Aprobada',
            'Rechazada',
            'Despachada',
            'Verificada' // <-- CORRECCIÓN: Añadido este estado
        ),
        defaultValue: 'Pendiente'
    },
    comentarios: { type: DataTypes.TEXT },
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
    tableName: 'Solicitudes',
    timestamps: true
});

module.exports = Solicitud;