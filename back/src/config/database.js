const { Sequelize } = require('sequelize');
require('dotenv').config();

// Determinar si estamos en un entorno de producción (como Vercel)
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

// Configuración base de Sequelize
const config = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql'
};

// Si estamos en la nube, agregamos las opciones de conexión segura (SSL)
if (isProduction) {
    // Aiven requiere que la conexión sea cifrada (SSL: true)
    config.dialectOptions = {
        ssl: {
            // Requerir SSL
            require: true, 
            // Ignorar la verificación de la autoridad de certificación (requerido por algunos hosts como Aiven)
            rejectUnauthorized: false 
        }
    };
}

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    config // Usamos el objeto de configuración actualizado
);

module.exports = sequelize;