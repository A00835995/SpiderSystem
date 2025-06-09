require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

// Configuración segura de CORS
const allowedOrigins = [
    'http://localhost:3000',    // React dev server
    'http://localhost:5173',    // Vite dev server
    'http://localhost:4173',    // Vite preview
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:4173'
];

// En producción, agregar el dominio real
if (process.env.NODE_ENV === 'production') {
    allowedOrigins.push(process.env.FRONTEND_URL);
}

const corsOptions = {
    origin: function (origin, callback) {
        // Permitir requests sin origin (ej. aplicaciones móviles)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('No permitido por política CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new Server(server, {
    cors: corsOptions
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
const ordenesProveedorRoutes = require('./Routes/ordenesProveedor');
const ventasRoutes = require('./Routes/ventasRoutes');
const predictivoRoutes = require('./Routes/predictivoRoutes');
const analisisInvRoutes = require('./Routes/analisisInvRoutes');
const { connectToHANA } = require('./Config/confDB');

// Middleware
app.use(cors(corsOptions));
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
app.use('/api/ordenes-proveedor', ordenesProveedorRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/predictivo', predictivoRoutes);
app.use('/api/analisis-inventario', analisisInvRoutes);

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