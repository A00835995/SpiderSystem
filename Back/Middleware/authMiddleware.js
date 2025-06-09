const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY = process.env.JWT_SECRET || "seguridad";

/**
 * Obtiene el mensaje de error apropiado basado en el tipo de error
 * @param {Error} error - El error capturado
 * @returns {string} El mensaje de error apropiado
 */
const getErrorMessage = (error) => {
  if (error.name === 'TokenExpiredError') {
    return 'Token expirado, por favor inicie sesión nuevamente';
  }
  if (error.name === 'JsonWebTokenError') {
    return 'Token inválido';
  }
  return 'Error al autenticar usuario';
};

/**
 * Middleware para verificar el token JWT
 * Simplemente verifica que el token sea válido y añade los datos del usuario al request
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Se requiere token de autenticación'
      });
    }
    
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    const errorResponse = {
      success: false,
      message: getErrorMessage(error),
      error: error.message
    };

    const statusCode = error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' ? 401 : 500;
    return res.status(statusCode).json(errorResponse);
  }
};

module.exports = { verifyToken }; 