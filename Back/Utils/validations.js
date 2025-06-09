/**
 * Valida un correo electrónico
 * @param {string} email - El correo electrónico a validar
 * @returns {boolean} - true si el correo es válido, false en caso contrario
 */
const validateEmail = (email) => {
    // Verificar que no sea null, undefined o string vacío
    if (!email || typeof email !== 'string' || email.trim() === '') {
        return false;
    }
    
    // Validación más estricta del formato de email
    // ^[a-zA-Z0-9._%+-]+ - Parte local (antes del @)
    // @ - Símbolo @ requerido
    // [a-zA-Z0-9.-]+ - Dominio
    // \.[a-zA-Z]{2,}$ - Extensión de dominio (2 o más caracteres)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    // Verificar que no haya puntos consecutivos
    if (email.includes('..')) {
        return false;
    }
    
    // Verificar que no termine en punto
    if (email.endsWith('.')) {
        return false;
    }
    
    // Verificar que tenga un solo @
    if ((email.match(/@/g) || []).length !== 1) {
        return false;
    }
    
    return emailRegex.test(email.trim());
};

/**
 * Valida una contraseña
 * @param {string} password - La contraseña a validar
 * @returns {boolean} - true si la contraseña es válida, false en caso contrario
 */
const validatePassword = (password) => {
    // Verificar que no sea null, undefined o string vacío
    if (!password || typeof password !== 'string' || password.trim() === '') {
        return false;
    }
    
    return password.length >= 8;
};

module.exports = {
    validateEmail,
    validatePassword
}; 