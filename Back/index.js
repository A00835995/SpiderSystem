require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const loginRoutes = require('./Routes/loginRutas');
const articuloRoutes = require('./Routes/articuloRutes');
const inicioRoutes = require('./Routes/inicioRoutes');
const gestionRoutes = require('./Routes/gestionRutes');
const alertasRoutes = require('./Routes/alertaRoutes');
const gestionProvRoutes = require('./Routes/gestionProvRoutes');
const comprasRoutes = require('./Routes/comprasRoutes');
const permisosRoutes = require('./Routes/permisosRoutes');
const metricasRoutes = require('./Routes/metricasRoutes');
const chatRoutes = require('./Routes/chatRoutes');
const { connectToHANA } = require('./Config/confDB');

// Middleware
app.use(cors());
app.use(express.json());

// Hacer io disponible en los controladores
app.set('io', io);

// Rutas de la API
app.use('/api/login', loginRoutes);
app.use('/api', articuloRoutes);
app.use('/api/inicio', inicioRoutes);
app.use('/api/gestion', gestionRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/gestion-proveedores', gestionProvRoutes);
app.use('/api/compras', comprasRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/metricas', metricasRoutes);
app.use('/api/chat', chatRoutes);



//El servidor link
const PORT = process.env.PORT || 4000;
server.listen(PORT, async () => {
    await connectToHANA();
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});

// Socket.io para chat en tiempo real
io.on('connection', (socket) => {
    console.log('🔌 Usuario conectado al chat:', socket.id);
    console.log('📊 Total conexiones activas:', io.sockets.sockets.size);

    // Unirse a una sala específica cuando se autentica el usuario
    socket.on('joinRoom', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`✅ Usuario ${userId} se unió a su sala personal (Socket: ${socket.id})`);
        
        // Mostrar todas las salas activas
        const allRooms = [...io.sockets.adapter.rooms.keys()];
        console.log('🏠 Todas las salas activas:', allRooms);
        
        // Confirmar que se unió a la sala
        socket.emit('joinedRoom', { userId, socketId: socket.id });
    });

    // Evento para debugging - ver qué salas están activas
    socket.on('getRooms', () => {
        const socketRooms = [...socket.rooms];
        const allRooms = [...io.sockets.adapter.rooms.keys()];
        console.log(`🏠 Salas del socket ${socket.id}:`, socketRooms);
        console.log('🌍 Todas las salas del servidor:', allRooms);
        
        socket.emit('currentRooms', {
            myRooms: socketRooms,
            allRooms: allRooms,
            totalConnections: io.sockets.sockets.size
        });
    });

    socket.on('disconnect', () => {
        console.log('❌ Usuario desconectado del chat:', socket.id);
        console.log('📊 Total conexiones restantes:', io.sockets.sockets.size);
    });
});