// Importar dependencias
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const setupTerminalInput = require('./utils/terminalInput');

dotenv.config();
 
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: '*',  
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  
}));

const server = http.createServer(app);
 
const io = new Server(server, {
  cors: {
    origin: "*",  
    methods: ["GET", "POST"]
  }
});

require('./utils/socketHandler')(io);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send(`Servidor Funcionando en puerto: ${PORT}`);
});

const publicRoutes = require('./routes/public');
const tokenRoutes = require('./routes/tokens');

app.use('/api', publicRoutes);
app.use('/api', tokenRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('✔ MongoDB conectado'))
.catch(err => console.error('✖ Error al conectar MongoDB:', err));

server.listen(PORT, () => {
  console.log(`✔ Servidor iniciado en puerto: ${PORT}`);
});

process.on('SIGINT', () => {
  process.stdout.write('\x1b[1A');
  console.log('\n• Servidor cerrando');
  process.exit();
});

process.on('uncaughtException', (err) => {
  console.log('• Error no capturado:', err);
});

setupTerminalInput();