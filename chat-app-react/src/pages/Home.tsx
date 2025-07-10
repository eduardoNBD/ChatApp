import * as React from 'react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ChatLayout from '@navigation/layouts/ChatLayout';

interface Chat {
  _id: string;
  name: string;
  participants: User[]; // Cambiado de string[] a User[]
  lastMessage: string;
  lastMessageTime: Date;
  createdAt: Date;
  isGroup: boolean;
}

interface Message {
  _id: string;
  sender: User;
  content: string;
  chatId: string;
  timestamp: Date;
}

interface User {
  _id: string;
  name: string;
  lastname: string;
  username: string;
}

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [usersSearch,setUsersSearch] = useState<User[]>([]);
  const [usersSearchText,setUsersSearchText] = useState('');
  const [messagesPage, setMessagesPage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
 
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket && currentUser) {
      socket.emit('registerUser', currentUser);
      socket.emit('getChats', currentUser._id);

      socket.on('searchUsersResult', (users: User[]) => {
        setUsersSearch(users); 
      });

      socket.on('chatCreated', (newChat: Chat) => { 
        setSelectedChat(newChat); 
        setChats(prevChats => [newChat, ...prevChats]);
        // Limpiar mensajes temporales cuando se crea el chat
        setMessages(prev => prev.filter(msg => !msg._id.startsWith('temp-')));
      });

      socket.on('chatsList', (chatsList: Chat[]) => { 
        setChats(chatsList);
      });

      socket.on('newMessage', (message:Message) => { 
        socket.emit('getMessages', { chatId: message.chatId, page: 1, limit: 20 });
      });
       
    }
  }, [socket, currentUser]);

  useEffect(() => {
    if (socket && selectedChat) {
      
      socket.emit('joinChat', selectedChat._id);
       
      socket.on('messagesList', (data: { messages: Message[], page: number, hasMore: boolean, total: number }) => {
        console.log('Recibidos mensajes:', data.messages.length, 'para página:', data.page);
        if (data.page === 1) {
          setMessages(data.messages);
        } else {
          setMessages(prev => [...prev, ...data.messages]);
        }
        setHasMoreMessages(data.hasMore);
        setIsLoadingMessages(false);
      });

      socket.on('newMessage', (message: Message) => {
        setMessages(prev => {
          // Si es un mensaje del usuario actual, reemplazar el mensaje temporal
          if (message.sender._id === currentUser._id) {
            return prev.map(msg => 
              msg._id.startsWith('temp-') ? message : msg
            );
          }
          // Si es un mensaje de otro usuario, agregarlo normalmente
          return [...prev, message];
        });
      });

      return () => {
        socket.off('messagesList');
        socket.off('newMessage');
      };
    }
  }, [socket, selectedChat]);

  // Efecto para cargar mensajes cuando se selecciona un chat existente
  useEffect(() => {
    if (selectedChat && selectedChat._id !== 'temp' && socket && socket.connected && messages.length === 0) {
      console.log('Cargando mensajes para chat existente:', selectedChat._id);
      socket.emit('getMessages', { chatId: selectedChat._id, page: 1, limit: 20 });
    }
  }, [selectedChat, socket, messages.length]);
 
  useEffect(() => {
    if (shouldScrollToBottom && messages.length > 0) {
      const messagesContainer = document.querySelector('.messages-container');
      if (messagesContainer) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }, [messages, shouldScrollToBottom]);

  const username = currentUser?.username;

  const sendMessage = () => {
    if (newMessage.trim() && socket && selectedChat) {
      // Crear el mensaje temporal para mostrar inmediatamente
      const tempMessage: Message = {
        _id: `temp-${Date.now()}`,
        sender: currentUser,
        content: newMessage,
        chatId: selectedChat._id,
        timestamp: new Date()
      };

      // Agregar el mensaje temporal a la lista
      setMessages(prev => [...prev, tempMessage]);
      
      // Forzar scroll al final cuando el usuario envía un mensaje
      setShouldScrollToBottom(true);

      if (selectedChat._id === 'temp') { 
        const participantIds = selectedChat.participants.map(p => p._id);
        const messageData = {
          sender: currentUser._id,
          content: newMessage,
          participants: participantIds,
          chatName: selectedChat.name
        };
        socket.emit('createChatAndSendMessage', messageData);
      } else {
        // Chat existente
        const messageData = {
          sender: currentUser._id,
          content: newMessage,
          chatId: selectedChat._id
        };
        socket.emit('sendMessage', messageData);
      }
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getOtherParticipantName = (participants: User[], currentUserId: string): string => {
    const otherParticipant = participants.find(user => user._id !== currentUserId);
    return otherParticipant ? `${otherParticipant.name} ${otherParticipant.lastname}` : 'Usuario desconocido';
  };

  const searchUsersHandled = (e: React.ChangeEvent<HTMLInputElement>) => { 
    socket.emit('searchUsers', {searchText: e.target.value, socket_id: socket.id}); 
  };

  const handleSelectUser = (user:User) => {
    // Buscar si ya existe un chat con este usuario
    const existingChat = chats.find(chat => {
      // Verificar si es un chat individual (no grupo) y contiene al usuario seleccionado
      return !chat.isGroup && chat.participants.some(p => p._id === user._id) && chat.participants.some(p => p._id === currentUser._id);
    });

    if (existingChat) {
      // Si existe el chat, abrirlo
      handledSelectedChat(existingChat);
    } else {
      // Si no existe, crear un chat temporal
      const tempChat = {
        _id: 'temp',
        name: user.name+" "+user.lastname,
        participants: [
          currentUser,
          user
        ],
        lastMessage: '', 
        lastMessageTime: new Date(),  
        createdAt: new Date(),  
        isGroup: false,
      };
      setSelectedUser(user);
      setSelectedChat(tempChat);
      setMessages([]);
      setMessagesPage(1);
      setHasMoreMessages(true);
      setIsLoadingMessages(false);
      setShouldScrollToBottom(true);
    }
    
    // Limpiar la búsqueda
    setUsersSearch([]);
    setUsersSearchText('');
  }

  const handledSelectedChat = (chat:Chat) => {
    console.log('Seleccionando chat:', chat._id);
    setSelectedChat(chat);
    setMessages([]);
    setMessagesPage(1);
    setHasMoreMessages(true);
    setIsLoadingMessages(false);
    setShouldScrollToBottom(true);
    
    // Obtener el usuario seleccionado para mostrar su avatar
    const otherParticipant = chat.participants.find(p => p._id !== currentUser._id);
    setSelectedUser(otherParticipant || null);

    // Asegurarse de que el socket esté conectado antes de enviar
    if (socket && socket.connected) {
      console.log('Solicitando mensajes para chat:', chat._id);
      socket.emit('getMessages', { chatId: chat._id, page: 1, limit: 20 });
    } else {
      console.log('Socket no está conectado');
    }
  }

  const loadMoreMessages = () => {
    if (selectedChat && hasMoreMessages && !isLoadingMessages) {
      setIsLoadingMessages(true);
      const nextPage = messagesPage + 1;
      setMessagesPage(nextPage);
      socket.emit('getMessages', { 
        chatId: selectedChat._id, 
        page: nextPage, 
        limit: 20 
      });
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    
    // Detectar si el usuario está cerca del final del scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
    setShouldScrollToBottom(isNearBottom);
    
    // Cargar más mensajes si está en la parte superior
    if (scrollTop === 0 && hasMoreMessages && !isLoadingMessages) {
      loadMoreMessages();
    }
  };

  const handledCloseChat = ()  => {
    setMessages([])
    setSelectedChat(null)
    setSelectedUser(null)
    setMessagesPage(1);
  }

  return ( 
    <ChatLayout title="Chat Home" description='Chat'>  
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"> 
          <div className="container mx-auto shadow-lg rounded-lg bg-gray-50 dark:bg-gray-900 shadow dark:border border-b-2 dark:border-gray-700 h-[90%] flex flex-col">
          
            {/* Header con barra de búsqueda */}
            <div className="px-5 py-4 bg-gray-800 border-b border-gray-700">
              <div className="flex justify-between items-center">
                <div className="font-semibold text-2xl text-white">ChatApp</div>
                <div className="w-1/2 relative">
                  <input 
                    onChange={(e) => {
                      setUsersSearchText(e.target.value);
                      searchUsersHandled(e); 
                    }}
                    type="text" 
                    name="message" 
                    id="message" 
                    value={usersSearchText} 
                    autoComplete='off' 
                    placeholder="Buscar usuarios..." 
                    className="rounded-2xl bg-gray-100 py-3 px-5 w-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {usersSearch.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 max-h-48 overflow-y-auto">
                      {usersSearch.map(user => (
                        <li
                          key={user._id}
                          className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-500"
                          onClick={() => handleSelectUser(user)}>
                          {user.username} - {user.name} {user.lastname}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                  {currentUser?.name?.[0]}{currentUser?.lastname?.[0]}
                </div>
              </div>
            </div> 

                        {/* Contenedor principal con 3 columnas */}
            <div className="flex flex-row flex-1 bg-white min-h-0">
              
              {error && (
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}
              
              {/* Primera columna: Lista de chats */}
              <div className="flex flex-col w-1/4 border-r border-gray-300 bg-gray-50 min-h-0"> 
                <div className="p-4 border-b border-gray-200 bg-white">
                  <input 
                    type="text" 
                    placeholder="Buscar chats..." 
                    className="py-2 px-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div> 

                <div className="flex-1 overflow-y-auto">
                  {chats.map((chat) => (
                    <div 
                      key={chat._id}
                      className={`flex flex-row py-3 px-4 items-center border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors ${
                        selectedChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                      onClick={() => handledSelectedChat(chat)}
                    >
                      <div className="flex-shrink-0 mr-3">
                        <div className="h-10 w-10 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center text-sm">
                          {chat.name.substring(0, 2).toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-semibold text-gray-900 truncate">
                          {chat.isGroup 
                            ? chat.name 
                            : getOtherParticipantName(chat.participants, currentUser._id)
                          }
                        </div>
                        <div className="text-xs text-gray-500 truncate">{chat.lastMessage}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div> 
              {/* Segunda columna: Área de chat */}
              <div className="flex flex-col flex-1 min-h-0">
                {selectedChat ? (
                  <>
                    {/* Header del chat */}
                    <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-3">
                      <div className="h-10 w-10 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center text-sm">
                        {selectedUser?.name?.[0]} {selectedUser?.lastname?.[0]} 
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {selectedChat.isGroup 
                            ? selectedChat.name 
                            : getOtherParticipantName(selectedChat.participants, currentUser._id)
                          }
                        </div>
                        <div className="text-xs text-gray-500">En línea</div>
                      </div>
                      <button className='text-gray-500 cursor-pointer' onClick={handledCloseChat}>
                        <svg  xmlns="http://www.w3.org/2000/svg"  width="16"  height="16"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
                      </button>
                    </div> 
                    
                    {/* Área de mensajes */}
                    <div className="flex-1 flex flex-col min-h-0">
                      <div className="flex-1 overflow-y-auto p-4 messages-container bg-gray-50 min-h-0" onScroll={handleScroll}>
                        {isLoadingMessages && (
                          <div className="text-center py-2 text-gray-500 text-sm">
                            Cargando mensajes anteriores...
                          </div>
                        )}
                        {messages.map((message) => (
                          <div 
                            key={message._id}
                            className={`flex ${message.sender._id === currentUser._id ? 'justify-end' : 'justify-start'} mb-4`}>
                            {message.sender._id !== currentUser._id && (
                              <div className="h-8 w-8 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center mr-2 text-xs">
                                {message.sender.name[0]} {message.sender.lastname[0]}
                              </div>
                            )}
                            <div className={`py-2 px-3 rounded-lg max-w-xs lg:max-w-md ${
                              message.sender._id === currentUser._id 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                              <div className="text-sm">{message.content}</div>
                              <div className={`text-xs mt-1 ${
                                message.sender._id === currentUser._id ? 'text-blue-100' : 'text-gray-500'
                              }`}>
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                            {message.sender._id === currentUser._id && (
                              <div className="h-8 w-8 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center ml-2 text-xs">
                                {message.sender.name[0]} {message.sender.lastname[0]}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Input de mensaje */}
                      <div className="p-4 bg-white border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <input
                            className="flex-1 py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                            type="text"
                            placeholder="Escribe un mensaje..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                          />
                          <button 
                            onClick={sendMessage} 
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Enviar
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="text-center text-gray-500">
                      <div className="text-6xl mb-4">💬</div>
                      <div className="text-xl font-semibold mb-2">Selecciona un chat</div>
                      <div className="text-sm">Elige una conversación para comenzar a chatear</div>
                    </div>
                  </div>
                )}
              </div> 
                            {/* Tercera columna: Panel de información */}
              <div className={`${selectedChat ? 'w-1/4' : 'w-0'} border-l border-gray-200 bg-white transition-all duration-300 overflow-hidden`}>
                {selectedChat && (
                  <div className="p-4 h-full">
                    <div className="text-center mb-6">
                      <div className="h-16 w-16 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center mx-auto mb-3 text-lg">
                        {selectedUser?.name?.[0]} {selectedUser?.lastname?.[0]} 
                      </div>
                      <div className="font-semibold text-lg text-gray-900 mb-1">{selectedUser?.name?.[0]} {selectedUser?.lastname?.[0]} </div>
                      <div className="text-sm text-green-600">● En línea</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Información del chat</div>
                        <div className="text-xs text-gray-500">
                          <div className="flex justify-between mb-1">
                            <span>Creado:</span>
                            <span>{new Date(selectedChat.createdAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tipo:</span>
                            <span>{selectedChat.isGroup ? 'Grupo' : 'Individual'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Participantes ({selectedChat.participants.length})</div>
                        <div className="space-y-2">
                          {selectedChat.participants.map((participant) => (
                            <div key={participant._id} className="flex items-center gap-2">
                              <div className="h-6 w-6 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center text-[10px]">
                                {participant.name[0]} {participant.lastname[0]}
                              </div>
                              <div className="text-sm text-gray-700">
                                {participant.username}
                                {participant._id === currentUser._id && <span className="text-blue-500 ml-1">(Tú)</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div> 
        </div> 
      </section> 
    </ChatLayout>
  );
};

export default Home;