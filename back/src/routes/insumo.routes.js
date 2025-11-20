// src/routes/insumo.routes.js
const express = require('express');
const router = express.Router();
const insumoController = require('../controllers/insumoController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// --- (NUEVA) RUTA PARA GESTIÓN ---

// Eliminar un insumo del catálogo
router.delete(
    '/:id',
    authMiddleware,
    roleCheck(['Jefe de Almacen']), // Solo el Jefe puede borrar
    insumoController.deleteInsumo
);

// --- RUTAS CORREGIDAS ---

// Registrar merma
// (CORRECCIÓN: Quitamos el /:id para coincidir con el Frontend)
router.post(
    '/merma',
    authMiddleware,
    roleCheck(['Encargado de Almacen', 'Jefe de Almacen']),
    insumoController.registrarMerma
);

// Obtener insumos con stock bajo
router.get(
    '/stock-bajo',
    authMiddleware,
    roleCheck(['Jefe de Almacen', 'Encargado de Almacen']),
    insumoController.getInsumosBajoStock
);

// Obtener todos los insumos
router.get(
    '/', 
    authMiddleware, 
    insumoController.getAllInsumos
);

// Crear un nuevo insumo
router.post(
    '/', 
    authMiddleware, 
    roleCheck(['Jefe de Almacen', 'Encargado de Almacen']),
    insumoController.crearInsumo
);

// Actualizar stock (ajuste manual)
router.put(
    '/:id/stock',
    authMiddleware,
    roleCheck(['Encargado de Almacen', 'Jefe de Almacen']),
    insumoController.updateStock
);

module.exports = router;