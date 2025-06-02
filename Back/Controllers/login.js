const { connection } = require('../Config/confDB');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || "seguridad";

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validación de entrada: email y contraseña obligatorios
        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }

        //Llamada al procedimiento almacenado que devuelve la fila de usuario
        //    basado en el correo. El '?' evita inyección SQL.        
        const query = `CALL GET_USER_BY_EMAIL(?)`;

        connection.exec(query, [email], async (err, result) => {
            //Error de BD o del SP
            if (err) {
                console.error("Error en la consulta de usuario:", err.message);
                return res.status(500).json({ message: 'Error al buscar correo', error: err.message });
            }

            //Si no hay filas, el usuario no existe
            if (result.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
            }

            //Extraemos la primera fila con la info del usuario
            const user = result[0];

            // Verificamos la contraseña con bcrypt.compare (hash vs texto plano)
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

            // Si el usuario es proveedor (rol 4), buscar su ID de proveedor
            if (user.IDROL === 4) {
                console.log('Usuario es proveedor (rol 4), verificando IDPROV para:', user.EMAILUSR);
                
                // Verificar si el usuario tiene IDPROV directamente en la tabla de usuarios
                if (user.IDPROV) {
                    console.log('ID de proveedor encontrado directamente en usuario:', user.IDPROV);
                    userData.proveedorId = user.IDPROV;
                    console.log('Datos de usuario actualizados con ID de proveedor:', userData);
                } else {
                    console.warn('Usuario con rol de proveedor pero sin IDPROV asignado');
                }
                
                // Generar token con los datos actualizados
                generarTokenYResponder(userData);
            } else {
                console.log('Usuario no es proveedor, rol:', user.IDROL);
                // No es proveedor, generar token normal
                generarTokenYResponder(userData);
            }

            // Función para generar token y enviar respuesta
            function generarTokenYResponder(userData) {
                //Generamos un JWT con payload (id, nombre, email, rol, proveedorId si existe)
                console.log('Generando token con datos:', userData);
                const token = jwt.sign(userData, SECRET_KEY, { expiresIn: '1h' });
                
                // Respondemos con el token y datos públicos del usuario
                return res.status(200).json({
                    message: 'Login exitoso',
                    token,
                    user: userData
                });
            }
        });

    } catch (error) {
        //Cualquier otra excepción en el try/catch
        console.error("Error en el login:", error.message);
        return res.status(500).json({ message: "Error en el servidor", error: error.message });
    }
};
