const { Sequelize } = require('sequelize');
require('dotenv').config();

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

module.exports = sequelize;
// Trigger Vercel redeploy