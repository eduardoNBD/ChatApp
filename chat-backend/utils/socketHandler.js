const Message = require('../models/Message');

module.exports = (io) => {
    io.on('connection', (socket) => {
        let clientIp = socket.handshake.address;

        const allSockets = io.sockets.sockets;

        console.log('Sockets conectados:');
        
        for (const [id, sock] of allSockets) {
            console.log(`ID del socket: ${id}`);
        }
        
        socket.on('sendMessage', async (data) => {  
            const { sender, content } = data;
            console.log(sender, content, clientIp);
            const newMessage = new Message({ sender, content, ip:clientIp });
            await newMessage.save();
 
            io.emit('receiveMessage', { sender, content });
        });
  
        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado:', socket.id);
        });
    });
};