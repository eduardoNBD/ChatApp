const express = require('express');
const router = express.Router();
 
router.post('/login', (req, res) => { 
     

    res.send({
        mensaje: "Login exitoso", 
    });
});

// Ruta de registro
router.post('/register', (req, res) => {
  // Lógica de registro aquí
  res.send('Registro');
});

// Ruta de olvidaste contraseña
router.post('/forgot-password', (req, res) => {
  // Lógica de recuperación de contraseña aquí
  res.send('Recuperar contraseña');
});

module.exports = router;