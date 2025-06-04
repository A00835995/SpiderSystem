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

// Importar iconos de manera general en lugar de individualmente
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import { API_CONFIG } from '../config/api';

// Función para obtener la inicial del nombre
const getInitial = (name) => {
  if (!name) return "";
  return name.charAt(0).toUpperCase();
};

// Datos de proveedores para el chat
const mockProveedores = [
  { 
    id: 1, 
    nombre: "Distribuidora del Norte", 
    email: "contacto@distribuidoradelnorte.com", 
    status: "online", 
    lastMessage: "El pedido #1234 ha sido enviado",
    keywords: ["norte", "distribuidora", "pedidos", "envíos"],
    avatar: "supplier" 
  },
  { 
    id: 2, 
    nombre: "Calzado Martínez", 
    email: "ventas@calzadomartinez.com", 
    status: "away", 
    lastMessage: "Nuevos modelos disponibles en catálogo",
    keywords: ["calzado", "zapatos", "modelos", "catálogo"],
    avatar: "supplier" 
  },
  { 
    id: 3, 
    nombre: "Importadora González", 
    email: "pedidos@importadoragonzalez.com", 
    status: "online", 
    lastMessage: "Confirmación de recepción de mercancía",
    keywords: ["importadora", "importación", "mercancía", "pedidos"],
    avatar: "shipping-status" 
  },
  { 
    id: 4, 
    nombre: "Suelas y Más", 
    email: "ventas@suelasymas.com", 
    status: "offline", 
    lastMessage: "Actualización de precios para el próximo mes",
    keywords: ["suelas", "materiales", "precios"],
    avatar: "product" 
  },
  { 
    id: 5, 
    nombre: "Distribuidora de Pieles SA", 
    email: "info@distpieles.com", 
    status: "online", 
    lastMessage: "Stock disponible de pieles premium",
    keywords: ["pieles", "cuero", "stock", "premium"],
    avatar: "factory" 
  }
];

// Componente del indicador de estado
const StatusIndicator = ({ status }) => {
  const statusColors = {
    online: "#22c55e", // verde
    away: "#f59e0b",   // ámbar
    offline: "#94a3b8"  // gris
  };
  
  return (
    <div style={{ 
      width: "10px", 
      height: "10px", 
      borderRadius: "50%", 
      backgroundColor: statusColors[status] || statusColors.offline,
      marginLeft: "8px",
      boxShadow: `0 0 0 2px white, 0 0 0 3px ${statusColors[status] || statusColors.offline}`
    }} />
  );
};

// Componente Avatar personalizado con iniciales
const CustomAvatar = ({ user, size = "S", style = {} }) => {
  const initial = getInitial(user.nombre);
  
  // Siempre mostrar la inicial, incluso cuando hay un icono definido
  return (
    <Avatar 
      style={style}
      size={size}
      backgroundColor={user.status === "online" ? "Accent6" : user.status === "away" ? "Accent4" : "Accent8"}
    >
      {initial}
    </Avatar>
  );
};

// Usar configuración centralizada
const SOCKET_URL = API_CONFIG.baseUrl.replace('/api', ''); // Remover /api para socket
const API_URL = `${API_CONFIG.baseUrl}/chat`;
const USERS_URL = `${API_CONFIG.baseUrl}/gestion/usuarios`;

const ChatPage = () => {
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const fileUploaderRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const currentUser = { id: 1, nombre: "Usuario Actual", avatar: "employee" }; // TODO: Reemplaza esto por el usuario real del login

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

  // Obtener usuarios reales para la agenda
  useEffect(() => {
    axios.get(USERS_URL)
      .then(res => setUsers(res.data.filter(u => u.id !== currentUser.id)))
      .catch(() => setUsers([]));
  }, [currentUser.id]);

  // Búsqueda optimizada con useMemo
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

  // Conectar socket.io al montar
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // Obtener mensajes al seleccionar usuario
  useEffect(() => {
    if (!selectedUser) return;
    setIsLoading(true);
    axios.get(`${API_URL}/${currentUser.id}/${selectedUser.id}`)
      .then(res => {
        // Adaptar los mensajes al formato del frontend
        const msgs = res.data.map(m => ({
          id: m.id,
          text: m.messageText,
          imageUrl: m.imageUrl,
          isImage: !!m.imageUrl,
          timestamp: new Date(m.timestamp),
          isSent: m.senderId === currentUser.id
        }));
        setMessages(msgs);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [selectedUser]);

  // Escuchar nuevos mensajes por socket.io
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = (msg) => {
      // Solo agregar si el mensaje es para el usuario actual o lo envió el usuario actual
      if (
        (msg.senderId === currentUser.id && msg.receiverId === selectedUser?.id) ||
        (msg.senderId === selectedUser?.id && msg.receiverId === currentUser.id)
      ) {
        setMessages(prev => [...prev, {
          id: msg.id,
          text: msg.messageText,
          imageUrl: msg.imageUrl,
          isImage: !!msg.imageUrl,
          timestamp: new Date(msg.timestamp),
          isSent: msg.senderId === currentUser.id
        }]);
      }
    };
    socket.on('newMessage', handleNewMessage);
    return () => socket.off('newMessage', handleNewMessage);
  }, [socket, selectedUser]);

  // Enviar mensaje
  const handleSendMessage = async () => {
    if (!newMessage || !selectedUser) return;
    const msgPayload = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      imageUrl: null,
      messageText: newMessage
    };
    try {
      await axios.post(API_URL, msgPayload);
      // Emitir por socket.io para tiempo real
      if (socket) socket.emit('sendMessage', {
        ...msgPayload,
        id: Date.now(),
        timestamp: new Date().toISOString()
      });
      setNewMessage("");
    } catch (e) {
      alert('Error al enviar el mensaje');
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    // No necesita hacer nada más, ya que el filtrado se realiza automáticamente con useMemo
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user);
    // Limpiar mensajes previos al cambiar de usuario
    setMessages([]);
  };

  const handleUploadClick = () => {
    // Activar el input de archivo oculto
    fileUploaderRef.current?.click();
  };

  // Enviar imagen (opcional, si quieres soportar imágenes)
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file || !selectedUser) return;
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen');
      return;
    }
    // Subir la imagen a un servidor o usar base64 (no implementado aquí)
    // Aquí solo se simula el envío de la URL local
    const imageUrl = URL.createObjectURL(file);
    const msgPayload = {
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      imageUrl,
      messageText: ''
    };
    try {
      await axios.post(API_URL, msgPayload);
      if (socket) socket.emit('sendMessage', {
        ...msgPayload,
        id: Date.now(),
        timestamp: new Date().toISOString()
      });
    } catch (e) {
      alert('Error al enviar la imagen');
    }
    event.target.value = '';
  };

  // Componente para renderizar un mensaje (puede ser texto o imagen)
  const MessageContent = ({ message }) => {
    if (message.isImage) {
      return (
        <>
          <img 
            src={message.imageUrl} 
            alt={message.fileName} 
            style={styles.imageMessage} 
          />
          <Text style={{ color: message.isSent ? 'white' : 'inherit' }}>
            {message.fileName}
          </Text>
        </>
      );
    }
    
    return (
      <Text style={{ color: message.isSent ? 'white' : 'inherit' }}>
        {message.text}
      </Text>
    );
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
            onInput={handleSearch} // Añadir onInput para que responda en tiempo real
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
              {/* Botón de imagen completamente rediseñado */}
              <div 
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '36px',
                  height: '36px',
                  marginRight: '8px',
                  backgroundColor: 'var(--sapButton_Background)',
                  border: '1px solid var(--sapButton_BorderColor)',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                onClick={handleUploadClick}
              >
                <span style={{ fontSize: '18px' }}>📷</span>
              </div>
              
              {/* Archivo oculto */}
              <input 
                type="file" 
                ref={fileUploaderRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
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

export { default } from '../components/chat/ChatPage'; 