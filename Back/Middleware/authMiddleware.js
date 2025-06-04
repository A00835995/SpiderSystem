const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || "seguridad";

/**
 * Middleware para verificar el token JWT
 * Simplemente verifica que el token sea válido y añade los datos del usuario al request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const verifyToken = (req, res, next) => {
  try {
    // Obtener el header de autorización
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Se requiere token de autenticación'
      });
    }
    
    // Extraer el token del header
    const token = authHeader.split(' ')[1];
    
    // Verificar el token
    const decoded = jwt.verify(token, SECRET_KEY);
    
    // Añadir los datos del usuario al objeto request
    req.user = decoded;
    
    // Continuar con la siguiente función en la cadena
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expirado, por favor inicie sesión nuevamente'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token inválido'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Error al autenticar usuario',
      error: error.message
    });
  }
};

module.exports = { verifyToken }; 