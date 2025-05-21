const { executeQuery } = require('../Utils/dbUtils');
const { validateEmail, validatePassword } = require('../Utils/validations');
const bcrypt = require('bcryptjs');
const GestionResponseDto = require('../dto/GestionUsuarios/GestionResponseDto');

// Mapeo de roles a IDs según la tabla mostrada
const ROL_MAPPING = {
    'SUPERADMIN': 1,
    'ADMIN': 2,
    'DUEÑO': 3,
    'PROVEEDOR': 4,
    'ANALISTA': 5
};

exports.getUsuarios = async (req, res) => {
    try{
        const result = await executeQuery('CALL "LISTA_USUARIOS"()', []);
        const usuarios = GestionResponseDto.toUsuariosList(result);
        res.status(200).json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

exports.getUsuario = async (req, res) => {
    try{
        // Obtener el id desde los parámetros de la ruta
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: 'Se requiere el ID del usuario' });
        }

        // Enviar el parámetro como un objeto con el nombre del parámetro esperado por el SP
        const result = await executeQuery('CALL "OBTENER_USUARIO"(?)', [id]);
        const usuario = GestionResponseDto.toUsuarioResponse(result);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        const { rol, nombre, email, password } = req.body;

        // Validar campos requeridos
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ 
                message: 'El nombre es requerido' 
            });
        }

        // Validar que el email no sea vacío
        if (!email || email.trim() === '') {
            return res.status(400).json({ 
                message: 'El correo electrónico no puede estar vacío' 
            });
        }

        // Validar el correo electrónico
        if (!validateEmail(email)) {
            if (!email.includes('@')) {
                return res.status(400).json({ 
                    message: 'El correo electrónico debe contener el símbolo @' 
                });
            }
            return res.status(400).json({ 
                message: 'Formato de correo electrónico inválido' 
            });
        }

        // Validar la contraseña
        if (!validatePassword(password)) {
            if (!password || password.trim() === '') {
                return res.status(400).json({ 
                    message: 'La contraseña es requerida' 
                });
            }
            return res.status(400).json({ 
                message: 'La contraseña debe tener al menos 8 caracteres' 
            });
        }

        // Convertir el nombre del rol a su ID correspondiente
        const rolId = ROL_MAPPING[rol.toUpperCase()];
        if (!rolId) {
            return res.status(400).json({
                message: 'Rol no válido'
            });
        }

        // Generar el hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Llamar al procedimiento almacenado con la contraseña hasheada
        // Orden correcto de parámetros: rolId, nombre, email, hashedPassword
        const result = await executeQuery('CALL "CREAR_USUARIO"(?, ?, ?, ?)', [rolId, nombre, email, hashedPassword]);
        const usuario = GestionResponseDto.toUsuarioCreateResponse(result);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

exports.updateRolUsuario = async (req, res) => {
    try{
        const { id, rol } = req.body;
        const rolId = ROL_MAPPING[rol.toUpperCase()];
        if (!rolId) {
            return res.status(400).json({
                message: 'Rol no válido'
            });
        }
        const result = await executeQuery('CALL "ACTUALIZAR_ROL_USUARIO"(?, ?)', [id, rolId]);
        const usuario = GestionResponseDto.toUsuarioUpdateRolResponse(result);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol del usuario', error: error.message });
    }
};

exports.updateNombreUsuario = async (req, res) => {
    try{
        const { id, nombre } = req.body;
        if (!nombre || nombre.trim() === '') {
            return res.status(400).json({ 
                message: 'El nombre es requerido' 
            });
        }
        const result = await executeQuery('CALL "ACTUALIZAR_NOMBRE_USUARIO"(?, ?)', [id, nombre]);
        const usuario = GestionResponseDto.toUsuarioUpdateNombreResponse(result);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el nombre del usuario', error: error.message });
    }
};

exports.updateEmailUsuario = async (req, res) => {
    try{
        const { id, email } = req.body;
        
        // Validar que el id exista
        if (!id) {
            return res.status(400).json({ 
                message: 'Se requiere el ID del usuario' 
            });
        }
        
        // Validar que el email no sea vacío
        if (!email || email.trim() === '') {
            return res.status(400).json({ 
                message: 'El correo electrónico no puede estar vacío' 
            });
        }
        
        // Validar formato de email con la función de validación
        if (!validateEmail(email)) {
            if (!email.includes('@')) {
                return res.status(400).json({ 
                    message: 'El correo electrónico debe contener el símbolo @' 
                });
            }
            return res.status(400).json({ 
                message: 'Formato de correo electrónico inválido' 
            });
        }
        
        const result = await executeQuery('CALL "ACTUALIZAR_EMAIL_USUARIO"(?, ?)', [id, email]);
        const usuario = GestionResponseDto.toUsuarioUpdateEmailResponse(result);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el email del usuario', error: error.message });
    }
};

exports.deleteUsuario = async (req, res) => {
    try{
        const { id } = req.body;
        const result = await executeQuery('CALL "ELIMINAR_USUARIO"(?)', [id]);
        const usuario = GestionResponseDto.toUsuarioDeleteResponse(result);
        res.status(200).json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};
