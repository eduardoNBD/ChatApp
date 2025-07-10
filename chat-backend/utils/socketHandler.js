const mongoose = require('mongoose');
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

module.exports = (io) => {
    const userSocketMap = {};

    io.on('connection', (socket) => {
        
        let ip = socket.handshake.address;

        console.log(`\n► Un usuario se ha conectado:\n  › ${socket.id} ${ip}`);

        socket.ip = ip; 

        socket.on('registerUser', async (id) => {
            const user = await User.findOne({ _id:id });
            if (user) {
              socket.user = user;  
              userSocketMap[user._id] = socket.id;
            }
        });

        socket.on('searchUsers', async (data) => {
            const { searchText, userId } = data;
            let users = [];
            try { 
                if (searchText) {
                    users = await User.find({
                        username: { $regex: searchText, $options: 'i' },
                        _id: { $ne: userId } // Excluir a sí mismo
                    })
                    .limit(5)
                    .select('username name lastname'); 
                }

                socket.emit('searchUsersResult', users);
            } catch (error) {
                console.error('✖ Error en búsqueda de usuarios:', error);
                socket.emit('error', { message: 'Error en búsqueda de usuarios' });
            }
        });

        socket.on('sendMessage', async (data) => {   
            try {
                const { sender, content, chatId } = data;
                 
                if (!sender || !mongoose.Types.ObjectId.isValid(sender)) {
                    throw new Error('ID de usuario inválido');
                } 
                
                const user = await User.findById(sender);

                if (!user) {
                    throw new Error('Usuario no encontrado');
                }
                 
                const message = new Message({
                    chatId,
                    sender: sender,  
                    content,
                    ip: socket.ip
                });
                
                await message.save();
                
                await message.populate('sender', 'username name lastname _id');
                 
                const updatedChat = await Chat.findByIdAndUpdate(chatId, {
                    lastMessage: content,
                    lastMessageTime: new Date()
                }).select('participants'); 

                updatedChat.participants.forEach(participant => {
                    if(participant._id != sender){
                        socket.to(userSocketMap[participant._id]).emit('newMessage', message);
                    }
                }); 
                
            } catch (error) {
                console.error('✖ Error al enviar mensaje:', error);
                socket.emit('error', { message: 'Error al enviar mensaje' });
            }
        });

        socket.on('createChatAndSendMessage', async (data) => {
            try {
                const { sender, content, participants, chatName } = data;
                
                // Verificar que el sender sea un ObjectId válido
                if (!sender || !mongoose.Types.ObjectId.isValid(sender)) {
                    throw new Error('ID de usuario inválido');
                }
                
                // Verificar que el usuario existe
                const user = await User.findById(sender);
                if (!user) {
                    throw new Error('Usuario no encontrado');
                }
                
                // Crear el chat
                const chat = new Chat({
                    name: chatName,
                    participants: participants,
                    isGroup: participants.length > 2
                });
                
                await chat.save();
                
                // Crear el mensaje
                const message = new Message({
                    chatId: chat._id,
                    sender: sender, // Ahora es el ObjectId del usuario
                    content,
                    ip: socket.ip
                });
                
                await message.save();
                
                // Poblar el sender para obtener la información del usuario
                await message.populate('sender', 'username name lastname _id');
                
                // Actualizar último mensaje del chat
                await Chat.findByIdAndUpdate(chat._id, {
                    lastMessage: content,
                    lastMessageTime: new Date()
                });
                
                // Obtener el chat con participantes poblados
                const populatedChat = await Chat.findById(chat._id)
                    .populate('participants', 'username name lastname _id');
                
                // Emitir el chat creado al usuario
                socket.emit('chatCreated', populatedChat);
                
                participants.forEach(participant => {
                    if(participant != sender && userSocketMap[participant]){
                        socket.to(userSocketMap[participant]).emit('chatCreatedOther', populatedChat);
                        socket.to(userSocketMap[participant]).emit('newMessage', message);
                    }
                });  
                
            } catch (error) {
                console.error('✖ Error al crear chat y enviar mensaje:', error);
                socket.emit('error', { message: 'Error al crear chat' });
            }
        });

        socket.on('getChats', async (userId) => { 
            try {
                const chats = await Chat.find({ participants: userId })
                    .populate('participants', 'username name lastname _id') 
                    .sort({ lastMessageTime: -1 }); 
                socket.emit('chatsList', chats);
            } catch (error) {
                console.error('✖ Error al obtener chats:', error);
                socket.emit('error', { message: 'Error al obtener chats' });
            }
        });

        socket.on('getMessages', async (data) => {console.log(`► getMessages del socket: ${ socket.id}`);
            try {
                const { chatId, page = 1, limit = 20 } = data;
                
                const skip = (page - 1) * limit;
                
                const messages = await Message.find({ chatId })
                    .populate('sender', 'username name lastname _id') // Poblar la información del sender
                    .sort({ timestamp: 1 }) // Ascendente (más antiguos primero)
                    .skip(skip)
                    .limit(limit);
                
                socket.emit('messagesList', {
                    messages,
                    page,
                    hasMore: messages.length === limit,
                    total: await Message.countDocuments({ chatId })
                });
                
            } catch (error) {
                console.error('✖ Error al obtener mensajes:', error);
                socket.emit('error', { message: 'Error al obtener mensajes' });
            }
        });
 
        socket.on('disconnect', () => {
            for (const [userId, sId] of Object.entries(userSocketMap)) {
                if (sId === socket.id) {
                    delete userSocketMap[userId];
                    break;
                }
            }
            console.log(`\n\n► Un usuario se ha desconectado:\n  › ${socket.id} ${ip}`);
        });
    });
};