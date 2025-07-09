const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

module.exports = (io) => {
    io.on('connection', (socket) => {
        let ip = socket.handshake.address;

        console.log(`\n► Un usuario se ha conectado:\n  › ${socket.id} ${ip}`);

        socket.ip = ip;
        
        socket.on('joinChat', (chatId) => {
            socket.join(chatId);  
        });

        socket.on('registerUser', async (username) => {
            const user = await User.findOne({ username });
            if (user) {
              socket.user = user;  
            }
        });

        socket.on('searchUsers', (data) => {
            const {searchText, socket_id } = data; 

            console.log(`Socket: ${socket_id} y busca a ${searchText}`)
        });

        socket.on('sendMessage', async (data) => {  
            try {
                const { sender, content, chatId, chatName, participants } = data;
                
                let chat = null;
                
                if (chatId) {
                    chat = await Chat.findById(chatId);
                    if (!chat) {
                        socket.emit('error', { message: 'Chat no encontrado' });
                        return;
                    }
                } else {
                    if (participants && participants.length > 0) {
                        chat = await Chat.findOne({
                            participants: { $all: participants },
                            isGroup: false
                        });
                        
                        if (!chat) {
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

                if (!chat.participants.includes(sender)) {
                    socket.emit('error', { message: 'No eres participante de este chat' });
                    return;
                }

                const newMessage = new Message({ 
                    chatId: chat._id, 
                    sender, 
                    content, 
                    ip 
                });
                await newMessage.save();

             
                chat.lastMessage = content;
                chat.lastMessageTime = new Date();
                await chat.save();
 
                io.to(chat._id.toString()).emit('receiveMessage', { 
                    sender, 
                    content, 
                    chatId: chat._id,
                    timestamp: newMessage.timestamp
                });
 
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
                const chats = await Chat.find({ participants: userId }).sort({ lastMessageTime: -1 });
                socket.emit('chatsList', chats);
            } catch (error) {
                console.error('Error al obtener chats:', error);
                socket.emit('error', { message: 'Error al obtener chats' });
            }
        });

        socket.on('getMessages', async (chatId) => {
            try {
                const messages = await Message.find({ chatId }).sort({ timestamp: 1 });

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