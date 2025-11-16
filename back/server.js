// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/config/database');
const path = require('path'); // <-- 1. AÑADIR ESTA LÍNEA (Módulo de Node)

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
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'] 
}));
app.use(express.json()); // Para parsear application/json

// --- 2. AÑADIR ESTA LÍNEA PARA SERVIR EL FRONTEND ---
// Esto le dice a Express que la carpeta '../front' contiene los archivos HTML
// (basado en tu estructura de carpetas)
app.use(express.static(path.join(__dirname, '../front')));
// --- FIN DE LÍNEAS NUEVAS ---

// Rutas API (Estas van después de 'static')
app.use('/api/auth', authRoutes);
app.use('/api/solicitudes', solicitudRoutes);
app.use('/api/despachos', despachoRoutes);
app.use('/api/insumos', insumoRoutes);
app.use('/api/ordenes-compra', ordenCompraRoutes);
app.use('/api/reportes', reporteRoutes);
app.use('/api/historial', historialRoutes);

// Sincronizar base de datos y levantar servidor
db.sync({ force: false }).then(() => {
    console.log('Base de datos conectada y sincronizada.');
    // Tu log dice 3000, así que esto está bien
    const PORT = process.env.PORT || 3001; 
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}).catch(error => {
    console.error('No se pudo conectar a la base de datos:', error);
});