// back/src/middleware/roleCheck.js
module.exports = (roles) => {
    // 1. Normalizar roles permitidos: minúsculas Y sin espacios
    const normalizedRoles = roles.map(role => role.toLowerCase().trim());

    return (req, res, next) => {
        // 2. Normalizar el rol del usuario: minúsculas Y sin espacios
        const userRole = req.user.rol ? req.user.rol.toLowerCase().trim() : '';

        // --- INICIO DE LA DEPURACIÓN (TEMPORAL) ---
        // Vamos a dejar esto aquí para ver la comparación
        console.log('------------------------------------');
        console.log('DEBUG: Rol del token recibido:', `'${userRole}'`);
        console.log('DEBUG: Roles permitidos (normalizados):', normalizedRoles);
        // --- FIN DE LA DEPURACIÓN ---

        // 3. Comparar roles normalizados
        if (!normalizedRoles.includes(userRole)) {
            console.log('DEBUG: ¡Acceso Denegado! El rol no coincide.');
            console.log('------------------------------------');
            return res.status(403).json({ message: 'Acceso denegado. Permisos insuficientes.' });
        }

        // 4. Si coincide, pasamos
        console.log('DEBUG: Acceso Permitido.');
        console.log('------------------------------------');
        next();
    };
};