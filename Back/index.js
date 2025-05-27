require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { connectToHANA } = require('./Config/confDB');

const loginRoutes = require('./Routes/loginRutas');
const articuloRoutes = require('./Routes/articuloRutes');
const inicioRoutes = require('./Routes/inicioRoutes');
const gestionRoutes = require('./Routes/gestionRutes');
const alertasRoutes = require('./Routes/alertaRoutes');
const gestionProvRoutes = require('./Routes/gestionProvRoutes');

// Middleware
app.use(cors());
app.use(express.json());


// Rutas de la API
app.use('/api/login', loginRoutes);
app.use('/api', articuloRoutes);
app.use('/api/inicio', inicioRoutes);
app.use('/api/gestion', gestionRoutes);
app.use('/api/alertas', alertasRoutes);
app.use('/api/gestion-proveedores', gestionProvRoutes);


//El servidor link
const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
    await connectToHANA();
    console.log(`Backend corriendo en http://localhost:${PORT}`);
});