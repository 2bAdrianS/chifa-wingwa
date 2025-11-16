// -----------------------------------------------------------------
// ▼▼▼ CÓDIGO CORRECTO PARA VERCEL ▼▼▼
// -----------------------------------------------------------------
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/database');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./src/routes/auth.routes');
const solicitudRoutes = require('./src/routes/solicitud.routes');
const despachoRoutes = require('./src/routes/despacho.routes');
const insumoRoutes = require('./src/routes/insumo.routes');
const ordenCompraRoutes = require('./src/routes/ordenCompra.routes');
const reporteRoutes = require('./src/routes/reporte.routes');
const historialRoutes = require('./src/routes/historial.routes.js');

const app = express();

// Middlewares
app.use(cors({
  origin: '*', // Esto permite que tu frontend (en otra URL) se conecte
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json()); 

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/despachos', despachoRoutes);
app.use('/api/insumos', insumoRoutes);
app.use('/api/ordenes-compra', ordenCompraRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/historial', historialRoutes);

// --- ESTE ES EL BLOQUE CORRECTO PARA VERCEL ---
// Sincronizar la base de datos (¡aún lo necesitamos!)
db.sync({ force: false }).then(() => {
    console.log('Base de datos conectada y sincronizada.');
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});

// Exportar la 'app' para que Vercel pueda usarla
module.exports = app;
// --- FIN DEL BLOQUE CORRECTO ---