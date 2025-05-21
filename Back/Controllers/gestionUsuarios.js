const { executeQuery } = require('../Utils/dbUtils');

exports.getUsuarios = async (req, res) => {
    try{
        const result = await executeQuery('CALL "LISTA_USUARIOS"()');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
    }
};

exports.getUsuario = async (req, res) => {
    try{
        const result = await executeQuery('CALL "OBTENER_USUARIO"()');
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
    }
};

exports.createUsuario = async (req, res) => {
    try{
        const { nombre, email, password, rol } = req.body;
        const result = await executeQuery('CALL "CREAR_USUARIO"()', [nombre, email, password, rol]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el usuario', error: error.message });
    }
};

exports.updateRolUsuario = async (req, res) => {
    try{
        const { id, rol } = req.body;
        const result = await executeQuery('CALL "ACTUALIZAR_ROL_USUARIO"()', [id, rol]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol del usuario', error: error.message });
    }
};

exports.updateNombreUsuario = async (req, res) => {
    try{
        const { id, nombre } = req.body;
        const result = await executeQuery('CALL "ACTUALIZAR_NOMBRE_USUARIO"()', [id, nombre]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el nombre del usuario', error: error.message });
    }
};

exports.updateEmailUsuario = async (req, res) => {
    try{
        const { id, email } = req.body;
        const result = await executeQuery('CALL "ACTUALIZAR_EMAIL_USUARIO"()', [id, email]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el email del usuario', error: error.message });
    }
};

exports.deleteUsuario = async (req, res) => {
    try{
        const { id } = req.body;
        const result = await executeQuery('CALL "ELIMINAR_USUARIO"()', [id]);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
    }
};
