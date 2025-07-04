const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const validator = require('validator');

router.post('/login', async (req, res) => { 
    try {
        const { username, password } = req.body;
        let errors = {};

        if (!username) errors.username = "El campo username es obligatorio";
        if (!password) errors.password = "El campo password es obligatorio";

        if (Object.keys(errors).length > 0) {
            return res.status(422).json({ 
                message: errors
            });
        }
 
        const user = await User.findOne({ email: username.toLowerCase() });
        
        if (!user) {
            return res.status(401).json({ 
                mensaje: "Usuario no encontrado"
            });
        }

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
 
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, confirm_password } = req.body;
    let errors = {
        username: '',
        email: '',
        password: '',
        confirm_password: '',
    };

    if (!username) errors.username = "El campo usuario es obligatorio";
    if (!email) errors.email = "El campo E-mail es obligatorio";
    if (!password) errors.password = "El campo contraseña es obligatorio";
    if (!confirm_password) errors.confirm_password = "El campo confirmar constraseña es obligatorio"; 
    if ((password && confirm_password) && (password !== confirm_password)) errors.confirm_password += "La contraseña y confirmar contraseña deben ser iguales";
    if (!validator.isEmail(email)) errors.email = "Debe ser un E-mail valido";

    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ 
            message: errors
        });
    }

    const userExist = await User.findOne({ 
      $or: [{ email: email.toLowerCase() }, { username: username }] 
    });
    
    if (userExist) {
      return res.status(400).json({ 
        message: "El usuario o email ya existe"
      });
    }
    
    const saltRounds = 10; 
    const hash = await bcrypt.hash(password, saltRounds);

    const user = new User({
      username,
      email: email.toLowerCase(),
      hash
    });

    await user.save();

    res.status(201).json({ 
      message: "Usuario registrado exitosamente", 
    });

  } catch (error) {
    console.error('✖ Error en registro:\n', error);
    res.status(500).json({ 
      message: "Error interno del servidor"
    });
  }
});

// Ruta de olvidaste contraseña
router.post('/forgot-password', (req, res) => {
  // Lógica de recuperación de contraseña aquí
  res.send('Recuperar contraseña');
});

module.exports = router;