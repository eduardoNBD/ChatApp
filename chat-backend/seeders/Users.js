const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();

const users = [
  {
    name: 'Juan',
    lastname: 'Pérez',
    username: 'juanp',
    email: 'juanp@example.com',
    password: 'password123',
  },
  {
    name: 'Ana',
    lastname: 'García',
    username: 'anag',
    email: 'anag@example.com',
    password: 'password123',
  },
  {
    name: 'Luis',
    lastname: 'Martínez',
    username: 'luism',
    email: 'luism@example.com',
    password: 'password123',
  },
  {
    name: 'María',
    lastname: 'López',
    username: 'marial',
    email: 'marial@example.com',
    password: 'password123',
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    try {
      await User.deleteMany({});  
      
      // Encriptar contraseñas antes de insertar
      const saltRounds = 10;
      const usersWithHashedPasswords = await Promise.all(
        users.map(async (user) => {
          const hash = await bcrypt.hash(user.password, saltRounds);
          return {
            ...user,
            password: hash
          };
        })
      );
      
      await User.insertMany(usersWithHashedPasswords);
      console.log('Usuarios de prueba insertados correctamente con contraseñas encriptadas');
      mongoose.disconnect();
    } catch (error) {
      console.error('Error al procesar usuarios:', error);
      mongoose.disconnect();
    }
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
    mongoose.disconnect();
  });