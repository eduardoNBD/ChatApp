const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/login', async (req, res) => { 
    try {
        const { email, password } = req.body;
         
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                mensaje: "Email y contraseña son requeridos"
            });
        }

        // Buscar usuario en MongoDB
        const usuario = await User.findOne({ email: email.toLowerCase() });
        
        if (!usuario) {
            return res.status(401).json({
                success: false,
                mensaje: "Usuario no encontrado"
            });
        }

        // Verificar contraseña (aquí deberías usar bcrypt para comparar)
        if (usuario.password !== password) {
            return res.status(401).json({
                success: false,
                mensaje: "Contraseña incorrecta"
            });
        }

        // Actualizar último login
        usuario.lastLogin = new Date();
        await usuario.save();

        res.json({
            success: true,
            mensaje: "Login exitoso",
            usuario: {
                id: usuario._id,
                username: usuario.username,
                email: usuario.email,
                createdAt: usuario.createdAt,
                lastLogin: usuario.lastLogin
            }
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({
            success: false,
            mensaje: "Error interno del servidor"
        });
    }
});

// Ruta de registro
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Validar campos requeridos
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        mensaje: "Todos los campos son requeridos"
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username }] 
    });
    
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        mensaje: "El usuario o email ya existe"
      });
    }

    // Crear nuevo usuario
    const nuevoUsuario = new User({
      username,
      email: email.toLowerCase(),
      password // Nota: deberías hashear la contraseña con bcrypt
    });

    await nuevoUsuario.save();

    res.status(201).json({
      success: true,
      mensaje: "Usuario registrado exitosamente",
      usuario: {
        id: nuevoUsuario._id,
        username: nuevoUsuario.username,
        email: nuevoUsuario.email,
        createdAt: nuevoUsuario.createdAt
      }
    });

  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      mensaje: "Error interno del servidor"
    });
  }
});

// Ruta de olvidaste contraseña
router.post('/forgot-password', (req, res) => {
  // Lógica de recuperación de contraseña aquí
  res.send('Recuperar contraseña');
});

module.exports = router;