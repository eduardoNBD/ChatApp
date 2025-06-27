// Importar dependencias
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
 
const app = express();
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