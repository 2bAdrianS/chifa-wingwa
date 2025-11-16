// src/controllers/ordenCompraController.js
const sequelize = require('../config/database');
const { OrdenCompra, Orden_Compra_Detalle, Insumo, Movimiento, Usuario } = require('../models');

/**
 * @desc    (NUEVO) Obtener órdenes validadas (listas para recibir)
 * @route   GET /api/ordenes-compra/validadas
 */
exports.getOrdenesValidadas = async (req, res) => {
    try {
        const ordenes = await OrdenCompra.findAll({
            where: { estado: 'Validada' }, 
            order: [['updatedAt', 'ASC']], 
            include: [
                {
                    model: Usuario,
                    as: 'encargadoCompras', // Quién la validó
                    attributes: ['nombre'],
                    required: false // (LEFT JOIN de Usuario)
                },
                {
                    model: Insumo,
                    as: 'insumos', // Los insumos de la orden
                    attributes: ['nombre', 'unidad_medida'],
                    required: false, // (LEFT JOIN de Insumo)
                    through: {
                        // ¡CORRECCIÓN! No se especifica el 'model' aquí
                        attributes: [['cantidad_a_comprar', 'cantidad_comprar']]
                    }
                }
            ]
        });
        res.json(ordenes);
    } catch (error) {
        console.error("Error en getOrdenesValidadas:", error); 
        res.status(500).json({ message: "Error al obtener órdenes validadas", error: error.message });
    }
};

/**
 * @desc    Obtener órdenes pendientes de validación
 * @route   GET /api/ordenes-compra/pendientes
 */
exports.getOrdenesPendientes = async (req, res) => {
    try {
        const ordenes = await OrdenCompra.findAll({
            where: { estado: 'Pendiente' },
            order: [['createdAt', 'ASC']],
            include: [
                { 
                    model: Usuario, 
                    as: 'solicitante', 
                    attributes: ['nombre'] 
                },
                {
                    model: Insumo, 
                    as: 'insumos', 
                    attributes: ['nombre', 'unidad_medida'],
                    through: { 
                        // ¡CORRECCIÓN! No se especifica el 'model' aquí
                        attributes: [['cantidad_a_comprar', 'cantidad_comprar']]
                    }
                }
            ]
        });
        res.json(ordenes); 
    } catch (error) {
        console.error("Error en getOrdenesPendientes:", error);
        res.status(500).json({ message: "Error al obtener órdenes pendientes", error: error.message });
    }
};

/**
 * @desc    Crear una nueva Orden de Compra
 * @route   POST /api/ordenes-compra
 */
exports.crearOrdenCompra = async (req, res) => {
    const { comentarios, insumos } = req.body;
    const id_encargado_almacen = req.user.id;
    const t = await sequelize.transaction();
    try {
        const nuevaOrden = await OrdenCompra.create({
            id_encargado_almacen: id_encargado_almacen,
            estado: 'Pendiente',
        }, { transaction: t });
        
        const detalles = insumos.map(item => ({
            id_orden_compra: nuevaOrden.id,
            id_insumo: item.id_insumo,
            cantidad_a_comprar: item.cantidad 
        }));
        
        await Orden_Compra_Detalle.bulkCreate(detalles, { transaction: t });
        await t.commit();
        res.status(201).json({ message: "Orden de Compra generada exitosamente. Pendiente de validación.", orden: nuevaOrden });
    } catch (error) {
        await t.rollback();
        console.error(error);
        res.status(500).json({ message: "Error al generar la Orden de Compra", error: error.message });
    }
};


/**
 * @desc    Validar o Rechazar una Orden de Compra
 * @route   POST /api/ordenes-compra/:action/:id
 */
exports.actualizarEstadoOrden = async (req, res) => {
    const { action, id } = req.params;
    const id_encargado_compras = req.user.id;

    let nuevoEstado;
    if (action === 'validar') {
        nuevoEstado = 'Validada';
    } else if (action === 'rechazar') {
        nuevoEstado = 'Rechazada';
    } else {
        return res.status(400).json({ message: "Acción no válida. Debe ser 'validar' o 'rechazar'." });
    }

    try {
        const orden = await OrdenCompra.findByPk(id);
        if (!orden) {
            return res.status(404).json({ message: "Orden de Compra no encontrada." });
        }
        if (orden.estado !== 'Pendiente') {
            return res.status(400).json({ message: `No se puede ${action} una orden que ya está en estado '${orden.estado}'.` });
        }
        
        orden.estado = nuevoEstado;
        orden.id_encargado_compras = id_encargado_compras; 
        await orden.save();
        
        res.json({ message: `Orden #${id} ${nuevoEstado.toLowerCase()} exitosamente.`, orden });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la Orden de Compra", error: error.message });
    }
};


/**
 * @desc    Registrar la entrada de insumos de una Orden de Compra
 * @route   POST /api/ordenes-compra/:id/registrar-entrada
 */
exports.registrarEntrada = async (req, res) => {
    const { id } = req.params;
    const id_usuario_registro = req.user.id;
    const t = await sequelize.transaction();
    try {
        const orden = await OrdenCompra.findByPk(id, {
            include: [{
                model: Insumo,
                as: 'insumos',
                // ¡CORRECCIÓN! No se especifica el 'model' aquí
                // También necesitamos acceder a 'cantidad_a_comprar' en el bucle 'for' de abajo
                through: { attributes: ['cantidad_a_comprar'] } 
            }],
            transaction: t
        });
        if (!orden) {
            await t.rollback();
            return res.status(404).json({ message: "Orden de Compra no encontrada." });
        }
        if (orden.estado !== 'Validada') {
            await t.rollback();
            return res.status(400).json({ message: `Solo se puede registrar la entrada de una orden en estado 'Validada'. Estado actual: '${orden.estado}'.` });
        }
        
        for (const insumoPedido of orden.insumos) {
            // Esta línea ahora funciona porque la pedimos en el 'through' de arriba
            const cantidadComprada = parseFloat(insumoPedido.Orden_Compra_Detalle.cantidad_a_comprar); 
            const insumo = await Insumo.findByPk(insumoPedido.id, { transaction: t, lock: t.LOCK.UPDATE });
            insumo.stock_actual = parseFloat(insumo.stock_actual) + cantidadComprada;
            await insumo.save({ transaction: t });
            await Movimiento.create({
                id_insumo: insumo.id,
                tipo: 'entrada',
                cantidad: cantidadComprada,
                id_usuario_registro: id_usuario_registro,
                motivo: `Entrada por Orden de Compra #${orden.id}`,
                id_referencia: orden.id
            }, { transaction: t });
        }
        
        orden.estado = 'Completada';
        await orden.save({ transaction: t });
        await t.commit();
        res.json({ message: "Entrada de insumos registrada y stock actualizado. Orden completada.", orden });
    } catch (error) {
        await t.rollback();
        console.error("Error en registrarEntrada:", error);
        res.status(500).json({ message: "Error al registrar la entrada", error: error.message });
    }
};