const { connection } = require('../Config/confDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || "seguridad";

// Función auxiliar para generar token y respuesta
const generarTokenYResponder = (userData, res) => {
    console.log('Generando token con datos:', userData);
    const token = jwt.sign(userData, SECRET_KEY, { expiresIn: '1h' });
    
    return res.status(200).json({
        message: 'Login exitoso',
        token,
        user: userData
    });
};

// Función auxiliar para procesar usuario proveedor
const procesarUsuarioProveedor = (user, userData) => {
    console.log('Usuario es proveedor (rol 4), verificando IDPROV para:', user.EMAILUSR);
    
    if (user.IDPROV) {
        console.log('ID de proveedor encontrado directamente en usuario:', user.IDPROV);
        userData.proveedorId = user.IDPROV;
        console.log('Datos de usuario actualizados con ID de proveedor:', userData);
    } else {
        console.warn('Usuario con rol de proveedor pero sin IDPROV asignado');
    }
    
    return userData;
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación de entrada: email y contraseña obligatorios
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }

        const query = `CALL GET_USER_BY_EMAIL(?)`;

        connection.exec(query, [email], async (err, result) => {
            if (err) {
                console.error("Error en la consulta de usuario:", err.message);
                return res.status(500).json({ message: 'Error al buscar correo', error: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            const user = result[0];
            const match = await bcrypt.compare(password, user.PASSUSR);
            
            if (!match) {
                return res.status(401).json({ message: "Contraseña incorrecta" });
            }

            // Información base del usuario
            const userData = {
                id: user.IDUSR,
                name: user.NAMEUSR,
                email: user.EMAILUSR,
                role: user.IDROL
            };

            // Procesar usuario según su rol
            if (user.IDROL === 4) {
                const userDataWithProvider = procesarUsuarioProveedor(user, userData);
                return generarTokenYResponder(userDataWithProvider, res);
            } else {
                console.log('Usuario no es proveedor, rol:', user.IDROL);
                return generarTokenYResponder(userData, res);
            }
        });

    } catch (error) {
        console.error("Error en el login:", error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
