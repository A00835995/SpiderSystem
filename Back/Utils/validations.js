/**
 * Valida un correo electrónico
 * @param {string} email - El correo electrónico a validar
 * @returns {boolean} - true si el correo es válido, false en caso contrario
 */
const validateEmail = (email) => {
    // Verificar que no sea null, undefined o string vacío
    if (!email || email.trim() === '') {
        return false;
    }
    
    // Verificar que contenga @
    if (!email.includes('@')) {
        return false;
    }
    
    // Validación básica del formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Valida una contraseña
 * @param {string} password - La contraseña a validar
 * @returns {boolean} - true si la contraseña es válida, false en caso contrario
 */
const validatePassword = (password) => {
    // Verificar que no sea null, undefined o string vacío
    if (!password || password.trim() === '') {
        return false;
    }
    
    return password.length >= 8;
};

module.exports = {
    validateEmail,
    validatePassword
}; 