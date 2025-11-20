// src/models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Importar modelos (limpios)
const Usuario = require('./Usuario');
const Insumo = require('./Insumo');
const Solicitud = require('./Solicitud');
const Despacho = require('./Despacho');
const OrdenCompra = require('./OrdenCompra');
const Movimiento = require('./Movimiento');

// --- DEFINICIÓN DE TABLAS INTERMEDIAS ---

const Solicitud_Detalle = sequelize.define('Solicitud_Detalle', {
    id_solicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_insumo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    cantidad_solicitada: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // Agregamos explícitamente timestamps por seguridad
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW
    }
}, { 
    tableName: 'solicitud_detalle', 
    timestamps: true 
});

const Despacho_Detalle = sequelize.define('Despacho_Detalle', {
    id_despacho: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_insumo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    cantidad_despachada: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // 👇 SOLUCIÓN DEFINITIVA: Definir explícitamente las fechas
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
    tableName: 'despacho_detalle', 
    timestamps: true 
});

const Orden_Compra_Detalle = sequelize.define('Orden_Compra_Detalle', {
    id_orden_compra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    id_insumo: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
    },
    cantidad_a_comprar: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    // 👇 PREVENCIÓN PARA ORDENES DE COMPRA
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
    tableName: 'orden_compra_detalle', 
    timestamps: true 
});


// --- 1. ASOCIACIONES DE USUARIO ---
Usuario.hasMany(Solicitud, { foreignKey: 'id_solicitante', as: 'solicitudesRealizadas' });
Solicitud.belongsTo(Usuario, { foreignKey: 'id_solicitante', as: 'solicitante' });

Usuario.hasMany(Despacho, { foreignKey: 'id_encargado_almacen', as: 'despachosRealizados' });
Despacho.belongsTo(Usuario, { foreignKey: 'id_encargado_almacen', as: 'encargado' });

Usuario.hasMany(OrdenCompra, { foreignKey: 'id_encargado_almacen', as: 'ordenesGeneradas' });
OrdenCompra.belongsTo(Usuario, { foreignKey: 'id_encargado_almacen', as: 'solicitante' });

Usuario.hasMany(OrdenCompra, { foreignKey: 'id_encargado_compras', as: 'ordenesValidadas' });
OrdenCompra.belongsTo(Usuario, { foreignKey: 'id_encargado_compras', as: 'encargadoCompras' });

Usuario.hasMany(Movimiento, { foreignKey: 'id_usuario_registro', as: 'movimientos' });
Movimiento.belongsTo(Usuario, { foreignKey: 'id_usuario_registro', as: 'responsable' });


// --- 2. ASOCIACIONES MUCHOS-A-MUCHOS (Insumos) ---

// Solicitud <-> Insumo
Solicitud.belongsToMany(Insumo, {
    through: Solicitud_Detalle,
    as: 'insumos',
    foreignKey: 'id_solicitud' 
});
Insumo.belongsToMany(Solicitud, {
    through: Solicitud_Detalle,
    as: 'solicitudes',
    foreignKey: 'id_insumo' 
});

// Despacho <-> Insumo
Despacho.belongsToMany(Insumo, {
    through: Despacho_Detalle,
    as: 'insumos',
    foreignKey: 'id_despacho' 
});
Insumo.belongsToMany(Despacho, {
    through: Despacho_Detalle,
    as: 'despachos',
    foreignKey: 'id_insumo' 
});

// OrdenCompra <-> Insumo
OrdenCompra.belongsToMany(Insumo, {
    through: Orden_Compra_Detalle,
    as: 'insumos',
    foreignKey: 'id_orden_compra' 
});
Insumo.belongsToMany(OrdenCompra, {
    through: Orden_Compra_Detalle,
    as: 'ordenesDeCompra',
    foreignKey: 'id_insumo' 
});


// --- 3. OTRAS ASOCIACIONES ---
Insumo.hasMany(Movimiento, { foreignKey: 'id_insumo', as: 'movimientos' });
Movimiento.belongsTo(Insumo, { foreignKey: 'id_insumo', as: 'insumo' });

Solicitud.hasOne(Despacho, { foreignKey: 'id_solicitud', as: 'despacho' });
Despacho.belongsTo(Solicitud, { foreignKey: 'id_solicitud', as: 'solicitud' });


// Exportar todo
const db = {
    sequelize,
    Sequelize,
    Usuario,
    Insumo,
    Solicitud,
    Despacho,
    OrdenCompra,
    Movimiento,
    Solicitud_Detalle,
    Despacho_Detalle,
    Orden_Compra_Detalle
};

module.exports = db;