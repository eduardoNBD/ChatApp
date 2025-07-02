import * as React from 'react';
import { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonList, IonItem, IonFooter } from '@ionic/react';
import { io } from 'socket.io-client';
import ChatLayout from '@navigation/layouts/ChatLayout';

const Home: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; content: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const username = 'Usuario' + Math.floor(Math.random() * 100); // Nombre de usuario aleatorio

  // Conectar al servidor Socket.IO
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

      // Enviar el mensaje al servidor
      socket.emit('sendMessage', message);

      // Limpiar el campo de entrada
      setNewMessage('');
    }
  };

  return ( 
    <ChatLayout title="Login" description='Login'>
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Chat en Vivo</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent>
          {/* Lista de mensajes */}
          <IonList>
            {messages.map((msg, index) => (
              <IonItem key={index}>
                <strong>{msg.sender}:</strong> {msg.content}
              </IonItem>
            ))}
          </IonList>
        </IonContent>

        <IonFooter>
          <IonToolbar>
            {/* Campo de entrada para escribir mensajes */}
            <IonInput
              value={newMessage}
              placeholder="Escribe un mensaje"
              onIonChange={(e) => setNewMessage(e.detail.value || '')}
            />
            {/* Botón para enviar mensajes */}
            <IonButton onClick={sendMessage}>Enviar</IonButton>
          </IonToolbar>
        </IonFooter>
      </IonPage>
    </ChatLayout>
  );
};

export default Home;