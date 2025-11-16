const { Sequelize } = require('sequelize');
require('dotenv').config();

// --- INICIO DE LA SOLUCIÓN ---
// Forzar a Vercel a incluir 'mysql2' en el paquete final.
// Sequelize lo carga dinámicamente, pero el empaquetador de Vercel no lo detecta.
require('mysql2'); 
// --- FIN DE LA SOLUCIÓN ---

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        // Convertimos el puerto a número para evitar problemas de conexión
        port: parseInt(process.env.DB_PORT), 
        dialect: 'mysql',
        logging: false, 
        
        // --- FINAL FIX: Configuración directa para Aiven ---
        dialectOptions: {
            ssl: {
                // Indicamos que requerimos SSL pero permitimos la conexión sin certificado CA local
                rejectUnauthorized: false
            },
            // Aseguramos el encoding correcto
            charset: 'utf8mb4' 
        }
        // --- FIN FINAL FIX ---
    }
);

// Trigger Vercel redeploy (Este comentario ya lo habías puesto, está bien)

module.exports = sequelize;