import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Card,
  Title,
  Text,
  Button,
  Input,
  FlexBox,
  FlexBoxDirection,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  Icon,
  Avatar,
  MessageStrip,
  BusyIndicator,
  AnalyticalTable,
  Bar,
  Label,
  FileUploader
} from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import CustomAvatar from './CustomAvatar';
import StatusIndicator from './StatusIndicator';
import MessageContent from './MessageContent';
import { getInitial } from './utils';

const SOCKET_URL = 'http://localhost:4000';
const API_URL = 'http://localhost:4000/api/chat';
const USERS_URL = 'http://localhost:4000/api/gestion/usuarios';

const ChatPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileUploaderRef = useRef(null);
  // Obtener usuario autenticado desde localStorage
  const storedUser = localStorage.getItem('user');
  let currentUser = null;
  try {
    currentUser = storedUser ? JSON.parse(storedUser) : null;
  } catch (e) {
    currentUser = null;
  }

  // Si no hay usuario, redirigir a login
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);

  // Estilos solo para modo claro
  const styles = {
    pageContainer: {
      display: 'flex',
      height: 'calc(100vh - 56px)',
      backgroundColor: 'var(--sapBackgroundColor)',
      paddingTop: '56px',
      position: 'relative',
      marginTop: '20px'
    },
    sidebar: {
      width: '320px',
      borderRight: '1px solid var(--sapList_BorderColor)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    searchContainer: {
      padding: '1rem',
      borderBottom: '1px solid var(--sapList_BorderColor)',
      backgroundColor: 'var(--sapList_HeaderBackground)'
    },
    userList: {
      flex: 1,
      overflowY: 'auto'
    },
    userItem: (isSelected) => ({
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      cursor: 'pointer',
      backgroundColor: isSelected ? 'var(--sapList_SelectionBackgroundColor)' : 'transparent',
      borderBottom: '1px solid var(--sapList_BorderColor)',
      transition: 'background-color 0.2s ease'
    }),
    userAvatar: {
      marginRight: '12px',
      backgroundColor: 'var(--sapButton_Background)'
    },
    userInfo: {
      flex: 1
    },
    userName: {
      fontWeight: 600,
      fontSize: '0.875rem',
      color: 'var(--sapTextColor)'
    },
    lastMessage: {
      fontSize: '0.75rem',
      color: 'var(--sapContent_LabelColor)',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      maxWidth: '180px'
    },
    chatContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    },
    chatHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      borderBottom: '1px solid var(--sapList_BorderColor)',
      backgroundColor: 'var(--sapList_HeaderBackground)'
    },
    messagesContainer: {
      flex: 1,
      padding: '1rem',
      overflowY: 'auto',
      backgroundColor: 'var(--sapBackgroundColor)',
      display: 'flex',
      flexDirection: 'column'
    },
    inputContainer: {
      padding: '1rem',
      borderTop: '1px solid var(--sapList_BorderColor)',
      backgroundColor: 'var(--sapList_FooterBackground)'
    },
    messageBox: (isSent) => ({
      backgroundColor: isSent ? 'var(--sapButton_Emphasized_Background)' : 'var(--sapList_Background)',
      color: isSent ? 'white' : 'var(--sapTextColor)',
      padding: '0.75rem 1rem',
      borderRadius: '0.75rem',
      maxWidth: '70%',
      marginBottom: '1rem',
      alignSelf: isSent ? 'flex-end' : 'flex-start',
      position: 'relative',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)'
    }),
    messageTime: {
      fontSize: '0.7rem',
      color: 'var(--sapContent_LabelColor)',
      textAlign: 'right',
      marginTop: '0.25rem',
      opacity: 0.8
    },
    noChatContainer: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      backgroundColor: 'var(--sapBackgroundColor)'
    },
    chatHeaderTitle: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    messageWithAvatar: (isSent) => ({
      display: 'flex',
      flexDirection: isSent ? 'row-reverse' : 'row',
      alignItems: 'flex-end',
      marginBottom: '1rem',
      width: '100%'
    }),
    messageAvatar: {
      marginLeft: '8px',
      marginRight: '8px'
    },
    myAvatar: {
      backgroundColor: 'var(--sapButton_Accept_Background)'
    },
    photoButton: {
      marginRight: '0.5rem',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '36px',
      height: '36px',
    },
    uploadIcon: {
      color: 'var(--sapButton_TextColor)',
      fontSize: '1.2rem'
    },
    imageMessage: {
      maxWidth: '250px',
      maxHeight: '250px',
      borderRadius: '8px',
      marginBottom: '0.5rem'
    },
    fileUploader: {
      display: 'none'
    }
  };

  useEffect(() => {
    axios.get(USERS_URL)
      .then(res => setUsers(res.data.filter(u => u.id !== currentUser.id)))
      .catch(() => setUsers([]));
  }, [currentUser.id]);

  const filteredProveedores = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    if (!searchTermLower) return users;
    return users.filter(user => {
      const searchFields = [
        user.nombre.toLowerCase(),
        user.email.toLowerCase(),
        user.rol.toLowerCase()
      ];
      const searchWords = searchTermLower.split(/\s+/);
      return searchWords.every(word =>
        searchFields.some(field => field.includes(word))
      );
    });
  }, [searchTerm, users]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    
    // Unirse a la sala personal del usuario cuando se conecta
    newSocket.on('connect', () => {
      if (currentUser?.id) {
        newSocket.emit('joinRoom', currentUser.id);
      }
    });
    
    // Confirmar que se unió a la sala
    newSocket.on('joinedRoom', (data) => {
      // Socket connection confirmed
    });
    
    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    setIsLoading(true);
    axios.get(`${API_URL}/${currentUser.id}/${selectedUser.id}`)
      .then(res => {
        const msgs = res.data.map(m => ({
          id: m.id,
          text: m.messageText,
          timestamp: new Date(m.timestamp),
          isSent: m.senderId === currentUser.id
        }));
        setMessages(msgs);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedUser]);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewMessage = (msg) => {
      if (
        (msg.senderId === currentUser.id && msg.receiverId === selectedUser?.id) ||
        (msg.senderId === selectedUser?.id && msg.receiverId === currentUser.id)
      ) {
        setMessages(prev => [...prev, {
          id: msg.id,
          text: msg.messageText,
          timestamp: new Date(msg.timestamp),
          isSent: msg.senderId === currentUser.id
        }]);
      }
    };
    
    socket.on('newMessage', handleNewMessage);
    
    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedUser]);

  const handleSendMessage = async () => {
    if (!newMessage || !selectedUser) return;
    const msgPayload = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      messageText: newMessage
    };
    try {
      await axios.post(API_URL, msgPayload);
      // El backend ahora emite automáticamente el socket después de guardar en la BD
      setNewMessage("");
    } catch (e) {
      alert('Error al enviar el mensaje');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    setMessages([]);
  };

  return (
    <div style={styles.pageContainer}>
      {/* Sidebar - Lista de contactos */}
      <div style={styles.sidebar}>
        <div style={styles.searchContainer}>
          <Input
            icon="search"
            placeholder="Buscar proveedor..."
            value={searchTerm}
            onChange={handleSearch}
            onInput={handleSearch}
            showClearIcon
            style={{ width: '100%' }}
          />
        </div>
        <div style={styles.userList}>
          {filteredProveedores.length > 0 ? (
            filteredProveedores.map((proveedor) => (
              <div 
                key={proveedor.id} 
                style={styles.userItem(selectedUser?.id === proveedor.id)}
                onClick={() => handleSelectUser(proveedor)}
              >
                <CustomAvatar 
                  user={proveedor} 
                  style={styles.userAvatar}
                />
                <div style={styles.userInfo}>
                  <div style={styles.userName}>{proveedor.nombre}</div>
                  <div style={styles.lastMessage}>{proveedor.lastMessage}</div>
                </div>
                <StatusIndicator status={proveedor.status} />
              </div>
            ))
          ) : (
            <MessageStrip
              design="Information"
              style={{ margin: '1rem' }}
            >
              No se encontraron proveedores que coincidan con la búsqueda
            </MessageStrip>
          )}
        </div>
      </div>

      {/* Contenedor principal del chat */}
      {selectedUser ? (
        <div style={styles.chatContainer}>
          {/* Cabecera del chat */}
          <div style={styles.chatHeader}>
            <CustomAvatar 
              user={selectedUser} 
              style={styles.userAvatar}
            />
            <div style={styles.chatHeaderTitle}>
              <Title level="H5" style={{ margin: 0 }}>{selectedUser.nombre}</Title>
              <Text style={styles.lastMessage}>{selectedUser.email}</Text>
            </div>
            <StatusIndicator status={selectedUser.status} />
          </div>

          {/* Contenedor de mensajes */}
          <div style={styles.messagesContainer}>
            {messages.map((message) => (
              <div 
                key={message.id} 
                style={styles.messageWithAvatar(message.isSent)}
              >
                {/* Avatar solo se muestra en los mensajes recibidos */}
                {!message.isSent && (
                  <CustomAvatar 
                    user={selectedUser}
                    size="XS" 
                    style={styles.messageAvatar}
                  />
                )}
                
                <div style={styles.messageBox(message.isSent)}>
                  <MessageContent message={message} />
                  <div style={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                
                {/* Avatar solo se muestra en los mensajes enviados */}
                {message.isSent && (
                  <Avatar 
                    size="XS" 
                    style={{...styles.messageAvatar, ...styles.myAvatar}}
                  >
                    {getInitial(currentUser.nombre)}
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem' }}>
                <BusyIndicator size="Small" active />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Contenedor de entrada de mensaje - MODIFICADO */}
          <div style={styles.inputContainer}>
            <FlexBox alignItems={FlexBoxAlignItems.Center}>
              <Input
                style={{ flex: 1, marginRight: '0.5rem' }}
                placeholder="Escribe un mensaje..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              
              <Button 
                icon="send" 
                design="Emphasized"
                onClick={handleSendMessage}
                disabled={!newMessage}
              >
                Enviar
              </Button>
            </FlexBox>
          </div>
        </div>
      ) : (
        <div style={styles.noChatContainer}>
          <Icon 
            name="message-success" 
            style={{ 
              fontSize: '3rem', 
              color: 'var(--sapContent_IconColor)',
              marginBottom: '1rem'
            }}
          />
          <Title level="H2">Selecciona un proveedor para chatear</Title>
          <MessageStrip 
            design="Information"
            style={{ marginTop: '1rem' }}
          >
            Aquí podrás comunicarte directamente con tus proveedores
          </MessageStrip>
        </div>
      )}
    </div>
  );
};

export default ChatPage; 