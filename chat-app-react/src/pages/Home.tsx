import * as React from 'react';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ChatLayout from '@navigation/layouts/ChatLayout';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState<any>(null);
 
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);
 
  const username = user?.username || 'Usuario' + Math.floor(Math.random() * 100);

  const socket = io('http://localhost:5000');

  useEffect(() => {
    // Escuchar mensajes recibidos
    socket.on('receiveMessage', (message: { sender: string; content: string }) => {
      setMessages((prevMessages) => [...prevMessages, message]); // Agregar el mensaje a la lista
    });

    // Limpiar el socket al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        sender: username,
        content: newMessage,
      };
 
      socket.emit('sendMessage', message);
 
      setNewMessage('');
    }
  };

  return ( 
    <ChatLayout title="Chat Home" description='Chat'> 
      <section className="bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"> 
          <div className="container mx-auto shadow-lg rounded-lg bg-gray-50 dark:bg-gray-900 shadow dark:border border-b-2 dark:border-gray-700">
          
            <div className="px-5 py-5 flex justify-between items-center dark:bg-gray-800 rounded-md">
              <div className="font-semibold text-2xl">ChatApp</div>
              <div className="w-1/2">
                <input type="text" name="" id="" placeholder="Busqueda" className="rounded-2xl bg-gray-100 py-3 px-5 w-full text-gray-600"/>
              </div>
              <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                {user?.name[0]}{user?.lastname[0]}
              </div>
            </div> 

            <div className="flex flex-row justify-between bg-white">
              
              <div className="flex flex-col w-2/5 border-r-2 overflow-y-auto bg-slate-300"> 
                <div className="border-b-2 py-4 px-2">
                  <input type="text" placeholder="search chatting" className="py-2 px-2 border-2 border-gray-200 rounded-2xl w-full"/>
                </div> 

                <div className="flex flex-row py-4 px-2 justify-center items-center border-b-2">
                  <div className="w-1/4">
                    <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                      L
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold text-gray-400">Luis1994</div>
                    <span className="text-gray-500">Pick me at 9:00 Am</span>
                  </div>
                </div>

                <div className="flex flex-row py-4 px-2 items-center border-b-2">
                  <div className="w-1/4">
                    <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                      ET
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold text-gray-400">Everest Trip 2021</div>
                    <span className="text-gray-500">Hi Sam, Welcome</span>
                  </div>
                </div>

                <div className="flex flex-row py-4 px-2 items-center border-b-2">
                  <div className="w-1/4">
                    <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                      MS
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold text-gray-400">MERN Stack</div>
                    <span className="text-gray-500">Lusi : Thanks Everyone</span>
                  </div>
                </div>
                <div className="flex flex-row py-4 px-2 items-center border-b-2">
                  <div className="w-1/4">
                    <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                      JI
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="text-lg font-semibold text-gray-400">Javascript Indonesia</div>
                    <span className="text-gray-500">Evan : some one can fix this</span>
                  </div>
                </div>  
              </div>

            <div className="w-full px-5 flex flex-col justify-between">
              <div className="flex flex-col mt-5">
                <div className="flex justify-end mb-4">
                  <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                    Welcome to group everyone !
                  </div>
                  <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                    {user?.name[0]}{user?.lastname[0]}
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                    {user?.name[0]}{user?.lastname[0]}
                  </div>
                  <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quaerat
                    at praesentium, aut ullam delectus odio error sit rem. Architecto
                    nulla doloribus laborum illo rem enim dolor odio saepe,
                    consequatur quas?
                  </div>
                </div>
                <div className="flex justify-end mb-4">
                  <div>
                    <div className="mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                      Lorem ipsum dolor, sit amet consectetur adipisicing elit.
                      Magnam, repudiandae.
                    </div> 
                    <div className="mt-4 mr-2 py-3 px-4 bg-blue-400 rounded-bl-3xl rounded-tl-3xl rounded-tr-xl text-white">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Debitis, reiciendis!
                    </div>
                  </div>
                  <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                    {user?.name[0]}{user?.lastname[0]}
                  </div>
                </div>
                <div className="flex justify-start mb-4">
                  <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                    {user?.name[0]}{user?.lastname[0]}
                  </div>
                  <div className="ml-2 py-3 px-4 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                    happy holiday guys!
                  </div>
                </div>
              </div>
              <div className="py-5">
                <input
                  className="w-full bg-gray-300 py-5 px-3 rounded-xl"
                  type="text"
                  placeholder="type your message here..."/>
              </div>
            </div> 
            <div className="w-2/5 border-l-2 px-5">
              <div className="flex flex-col">
                <div className="font-semibold text-xl py-4 text-gray-500">Mern Stack Group</div>
                  <div className="h-12 w-12 p-2 bg-yellow-500 rounded-full text-white font-semibold flex items-center justify-center">
                    MS
                  </div>
                  <div className="font-semibold py-4 text-gray-500">Created 22 Sep 2021</div>
                  <div className="font-light text-gray-500">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Deserunt,
                    perspiciatis!
                  </div>
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