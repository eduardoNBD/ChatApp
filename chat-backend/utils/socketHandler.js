const Message = require('../models/Message');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`► Un usuario se ha conectado:\n  › ${socket.id}`);

        let clientIp = socket.handshake.address;

        const allSockets = io.sockets.sockets;

        console.log('• Sockets conectados:');
        
        for (const [id, sock] of allSockets) {
            console.log(`  › ${id}`);
        }
        
        socket.on('sendMessage', async (data) => {  
            const { sender, content } = data;
            console.log(sender, content, clientIp);
            const newMessage = new Message({ sender, content, ip:clientIp });
            await newMessage.save();
 
            io.emit('receiveMessage', { sender, content });
        });
  
        socket.on('disconnect', () => {
            console.log(`► Un usuario se ha desconectado:\n  › ${socket.id}`);
        });
    });
};