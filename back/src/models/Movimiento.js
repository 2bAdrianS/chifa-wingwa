const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/database');

const Movimiento = sequelize.define('Movimiento', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_insumo: { type: DataTypes.INTEGER, allowNull: false },
    tipo: {
        type: DataTypes.ENUM('entrada', 'salida', 'merma'),
        allowNull: false
    },
    cantidad: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    id_usuario_registro: { type: DataTypes.INTEGER, allowNull: false },
    motivo: { type: DataTypes.STRING(255) },
    id_referencia: { type: DataTypes.INTEGER },
    createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW }
}, {
    tableName: 'movimientos', // 👈 ESTO DEBE COINCIDIR CON TU FOTO (minúscula)
    timestamps: true
});

module.exports = Movimiento;