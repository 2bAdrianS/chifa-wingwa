const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
             return res.status(400).json({ message: 'Email y contraseña son requeridos' });
        }

        // 1. Limpiamos el email
        const usuario = await Usuario.findOne({ where: { email: email.trim() } });
        if (!usuario) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. ¡LIMPIAMOS LA CONTRASEÑA ANTES DE COMPARAR!
        const esValida = await bcrypt.compare(password.trim(), usuario.password);
        if (!esValida) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar el token
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol.toLowerCase(), nombre: usuario.nombre },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // Devolvemos el rol en minúsculas
        res.json({ 
            token, 
            usuario: { 
                id: usuario.id, 
                nombre: usuario.nombre, 
                rol: usuario.rol.toLowerCase() 
            } 
        });

    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        // Hashear la contraseña (limpiándola)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password.trim(), salt);

        const nuevoUsuario = await Usuario.create({
            nombre,
            // Limpiamos email y rol al crear
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            rol: rol.toLowerCase() 
        });

        res.status(201).json({ message: 'Usuario creado exitosamente', usuario: { id: nuevoUsuario.id, nombre: nuevoUsuario.nombre, rol: nuevoUsuario.rol } });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};