import * as React from 'react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ChatLayout from '@navigation/layouts/ChatLayout';

interface Chat {
  _id: string;
  name: string;
  participants: string[];
  lastMessage: string;
  lastMessageTime: Date;
  createdAt: Date;
  isGroup: boolean;
}

interface Message {
  _id: string;
  sender: string;
  content: string;
  chatId: string;
  timestamp: Date;
}

interface User {
  _id: string;
}

const Home: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
  const [socket, setSocket] = useState<any>(null);
  const [error, setError] = useState<string>('');
 
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
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
    if (socket && user) {
      socket.emit('registerUser', user.username);
      socket.emit('getChats', user.username);

      socket.on('chatsList', (chatsList: Chat[]) => {
        setChats(chatsList);
        if (chatsList.length > 0 && !selectedChat) {
          setSelectedChat(chatsList[0]);
        }
      });

      socket.on('getUsersSearch', (chatsList: Chat[]) => {
        setChats(chatsList);
        if (chatsList.length > 0 && !selectedChat) {
          setSelectedChat(chatsList[0]);
        }
      });


      socket.on('receiveMessage', (message: Message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      socket.on('chatUpdated', (chatUpdate: any) => {
        setChats((prevChats) => 
          prevChats.map(chat => 
            chat._id === chatUpdate.chatId 
              ? { ...chat, lastMessage: chatUpdate.lastMessage, lastMessageTime: chatUpdate.lastMessageTime }
              : chat
          )
        );
      });

      socket.on('error', (errorData: { message: string }) => {
        setError(errorData.message);
        setTimeout(() => setError(''), 5000);
      });

      return () => {
        socket.off('chatsList');
        socket.off('receiveMessage');
        socket.off('chatUpdated');
        socket.off('error');
      };
    }
  }, [socket, user, selectedChat]);

  useEffect(() => {
    if (socket && selectedChat) {
      
      socket.emit('joinChat', selectedChat._id);
       
      socket.emit('getMessages', selectedChat._id);

      socket.on('messagesList', (messagesList: Message[]) => {
        setMessages(messagesList);
      });

      return () => {
        socket.off('messagesList');
      };
    }
  }, [socket, selectedChat]);

  const username = user?.username || 'Usuario' + Math.floor(Math.random() * 100);

  const sendMessage = () => {
    if (newMessage.trim() && socket && selectedChat) {
      const messageData = {
        sender: username,
        content: newMessage,
        chatId: selectedChat._id
      };
 
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    } else if (newMessage.trim() && socket && !selectedChat) {
      // Crear nuevo chat con un participante específico
      const messageData = {
        sender: username,
        content: newMessage,
        participants: [username, 'Usuario2'], // Ejemplo: crear chat con otro usuario
        chatName: `Chat con Usuario2`
      };
 
      socket.emit('sendMessage', messageData);
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

  const searchUsersHandled = (e: React.KeyboardEvent<HTMLInputElement>) => {
    socket.emit('searchUsers', {searchText: (e.target as HTMLInputElement).value, socket_id: socket.id});console.log((e.target as HTMLInputElement).value)
  };

  return ( 
    <ChatLayout title="Chat Home" description='Chat'>  
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"> 
          <div className="container mx-auto shadow-lg rounded-lg bg-gray-50 dark:bg-gray-900 shadow dark:border border-b-2 dark:border-gray-700 h-[90%]">
          
            <div className="px-5 py-5 flex justify-between items-center dark:bg-gray-800 rounded-md">
              <div className="font-semibold text-2xl">ChatApp</div>
              <div className="w-1/2">
                <input onKeyUp={searchUsersHandled} type="text" name="message" id="message" placeholder="Busqueda" className="rounded-2xl bg-gray-100 py-3 px-5 w-full text-gray-600"/>
              </div>
              <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                {user?.name?.[0]}{user?.lastname?.[0]}
              </div>
            </div> 

            {error && (
              <div className="px-5 py-2 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <div className="flex flex-row justify-between bg-white h-[90%]">
              
              <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto bg-gray-800"> 
                <div className="border-y py-4 px-2">
                  <input type="text" placeholder="search chatting" className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"/>
                </div> 

                {chats.map((chat) => (
                  <div 
                    key={chat._id}
                    className={`flex flex-row py-4 px-2 items-center border-b-2 cursor-pointer ${
                      selectedChat?._id === chat._id ? 'bg-gray-700' : ''
                    }`}
                    onClick={() => setSelectedChat(chat)}
                  >
                    <div className="w-1/4">
                      <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                        {chat.name.substring(0, 2).toUpperCase()}
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="text-lg font-semibold text-gray-400">{chat.name}</div>
                      <span className="text-gray-500">{chat.lastMessage}</span>
                    </div>
                  </div>
                ))}
              </div>

            <div className="w-full px-5 flex flex-col justify-between">
              <div className="flex flex-col mt-5">
                {selectedChat ? (
                  <div className="text-center py-4 text-gray-500">
                    Chat: {selectedChat.name}
                  </div>
                ) : null}
                
                <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto">
                  {messages.map((message) => (
                    <div 
                      key={message._id}
                      className={`flex ${message.sender === username ? 'justify-end' : 'justify-start'} mb-4`}
                    >
                      {message.sender !== username && (
                        <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center mr-2">
                          {message.sender.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className={`py-3 px-4 rounded-3xl text-white ${
                        message.sender === username 
                          ? 'bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl' 
                          : 'bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl'
                      }`}>
                        <div>{message.content}</div>
                        <div className="text-xs opacity-75 mt-1">
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                      {message.sender === username && (
                        <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center ml-2">
                          {message.sender.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="py-5">
                <input
                  className="w-full bg-gray-100 py-5 px-3 rounded-xl border border-gray-200 text-gray-900"
                  type="text"
                  placeholder="type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button 
                  onClick={sendMessage}
                  className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Enviar
                </button>
              </div>
            </div> 
            <div className="w-2/5 border-l-2 border-gray-100 px-5">
              <div className="flex flex-col">
                {selectedChat ? (
                  <>
                    <div className="font-semibold text-xl py-4 text-gray-500">{selectedChat.name}</div>
                    <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                      {selectedChat.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="font-semibold py-4 text-gray-500">
                      Creado {new Date(selectedChat.createdAt).toLocaleDateString('es-ES')}
                    </div>
                    <div className="font-light text-gray-500">
                      Participantes: {selectedChat.participants.join(', ')}
                    </div>
                  </>
                ) : null}
              </div>
            </div>
            </div>
          </div> 
        </div> 
      </section> 
    </ChatLayout>
  );
};

export default Home;