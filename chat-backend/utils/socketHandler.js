const Message = require('../models/Message');
const Chat = require('../models/Chat');

module.exports = (io) => {
    io.on('connection', (socket) => {
        let ip = socket.handshake.address;

        console.log(`\n\n► Un usuario se ha conectado:\n  › ${socket.id} ${ip}`);

        socket.on('joinChat', (chatId) => {
            socket.join(chatId);  
        });

        socket.on('sendMessage', async (data) => {  
            try {
                const { sender, content, chatId, chatName, participants } = data;
                
                // Verificar si existe el chat
                let chat = null;
                
                if (chatId) {
                    // Si se proporciona un chatId, buscar el chat existente
                    chat = await Chat.findById(chatId);
                    if (!chat) {
                        socket.emit('error', { message: 'Chat no encontrado' });
                        return;
                    }
                } else {
                    // Si no hay chatId, crear un nuevo chat o buscar uno existente
                    if (participants && participants.length > 0) {
                        // Buscar chat existente entre los participantes
                        chat = await Chat.findOne({
                            participants: { $all: participants },
                            isGroup: false
                        });
                        
                        if (!chat) {
                            // Crear nuevo chat
                            chat = new Chat({
                                name: chatName || `Chat entre ${participants.join(', ')}`,
                                participants: participants,
                                isGroup: participants.length > 2
                            });
                            await chat.save();
                        }
                    } else {
                        socket.emit('error', { message: 'Se requieren participantes para crear un chat' });
                        return;
                    }
                }

                // Verificar que el remitente sea participante del chat
                if (!chat.participants.includes(sender)) {
                    socket.emit('error', { message: 'No eres participante de este chat' });
                    return;
                }

                // Crear y guardar el mensaje
                const newMessage = new Message({ 
                    chatId: chat._id, 
                    sender, 
                    content, 
                    ip 
                });
                await newMessage.save();

                // Actualizar último mensaje del chat
                chat.lastMessage = content;
                chat.lastMessageTime = new Date();
                await chat.save();

                // Emitir mensaje solo a los participantes del chat
                io.to(chat._id.toString()).emit('receiveMessage', { 
                    sender, 
                    content, 
                    chatId: chat._id,
                    timestamp: newMessage.timestamp
                });

                // Emitir actualización del chat
                io.to(chat._id.toString()).emit('chatUpdated', {
                    chatId: chat._id,
                    lastMessage: content,
                    lastMessageTime: chat.lastMessageTime
                });

            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                socket.emit('error', { message: 'Error al enviar mensaje' });
            }
        });

        socket.on('getChats', async (userId) => {
            try {
                const chats = await Chat.find({ participants: userId })
                    .sort({ lastMessageTime: -1 });
                socket.emit('chatsList', chats);
            } catch (error) {
                console.error('Error al obtener chats:', error);
                socket.emit('error', { message: 'Error al obtener chats' });
            }
        });

        socket.on('getMessages', async (chatId) => {
            try {
                const messages = await Message.find({ chatId })
                    .sort({ timestamp: 1 });
                socket.emit('messagesList', messages);
            } catch (error) {
                console.error('Error al obtener mensajes:', error);
                socket.emit('error', { message: 'Error al obtener mensajes' });
            }
        });
  
        socket.on('disconnect', () => {
            console.log(`\n\n► Un usuario se ha desconectado:\n  › ${socket.id} ${ip}`);
        });
    });
};