// Importar dependencias
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();
 
const app = express();
app.use(cors({
  origin: '*', // O especifica el dominio de tu frontend, por ejemplo: 'http://localhost:3000'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true // Si necesitas enviar cookies o headers de autenticación
}));

const server = http.createServer(app);
 
const io = new Server(server, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"]
  }
});

app.get('/', (req, res) => {
  res.send('Servidor del Chat en Vivo funcionando');
});

const publicRoutes = require('./routes/public');
app.use('/api', publicRoutes);

require('./utils/socketHandler')(io);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error al conectar MongoDB:', err));

server.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});