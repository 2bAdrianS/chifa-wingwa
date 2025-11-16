const express = require('express');
const router = express.Router();
const ordenCompraController = require('../controllers/ordenCompraController');
const authMiddleware = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

// (NUEVA) Obtener órdenes validadas (listas para recibir)
router.get(
    '/validadas',
    authMiddleware,
    roleCheck(['Encargado de Almacen', 'Jefe de Almacen']),
    ordenCompraController.getOrdenesValidadas
);

// Obtener órdenes pendientes (para Compras)
router.get(
    '/pendientes',
    authMiddleware,
    roleCheck(['Encargado de Compras', 'Jefe de Almacen']),
    ordenCompraController.getOrdenesPendientes
);

// Generar una nueva Orden de Compra (Almacén)
router.post(
    '/',
    authMiddleware,
    roleCheck(['Encargado de Almacen', 'Jefe de Almacen']),
    ordenCompraController.crearOrdenCompra
);

// =======================================================
//          *** INICIO DE LA CORRECCIÓN ***
// ESTA RUTA VA PRIMERO PORQUE ES MÁS ESPECÍFICA
// =======================================================

// Registrar la entrada de una orden (Almacén)
router.post(
    '/:id/registrar-entrada',
    authMiddleware,
    roleCheck([
    'Encargado de Almacen', 
    'Jefe de Almacen',
    'Jefe de Almacén' 
]),
    ordenCompraController.registrarEntrada
);

// --- ESTA RUTA AHORA VA DESPUÉS ---
// Esta ruta es la correcta y usa la función 'actualizarEstadoOrden'
/**
 * @route   POST /api/ordenes-compra/:action/:id
 * @desc    Validar o Rechazar una Orden de Compra
 * @access  Privado (Encargado de Compras)
 */
router.post(
    '/:action/:id', // Ej: /api/ordenes-compra/validar/5
    authMiddleware,
    roleCheck(['Encargado de Compras']),
    ordenCompraController.actualizarEstadoOrden 
);
// --- FIN DE LA RUTA CLAVE ---

// =======================================================
//           *** FIN DE LA CORRECCIÓN ***
// =======================================================

module.exports = router;