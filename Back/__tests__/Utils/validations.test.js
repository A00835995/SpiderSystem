const { validateEmail, validatePassword } = require('../../Utils/validations');

describe('Validation Utils', () => {
    describe('validateEmail', () => {
        it('should return true for valid email addresses', () => {
            const validEmails = [
                'test@example.com',
                'user.name@domain.com',
                'user+tag@example.com',
                'user@subdomain.example.com',
                'user@domain.co.uk'
            ];

            validEmails.forEach(email => {
                expect(validateEmail(email)).toBe(true);
            });
        });

        it('should return false for invalid email addresses', () => {
            const invalidEmails = [
                'test@example',           // Sin dominio
                'test@.com',              // Sin dominio antes del punto
                'test@example..com',      // Doble punto
                'test@example.com.',      // Punto al final
                '@example.com',           // Sin usuario
                'test@',                  // Sin dominio
                'test.example.com',       // Sin @
                '',                       // String vacío
                '   ',                    // Solo espacios
                null,                     // null
                undefined                 // undefined
            ];

            invalidEmails.forEach(email => {
                expect(validateEmail(email)).toBe(false);
            });
        });
    });

    describe('validatePassword', () => {
        it('should return true for valid passwords', () => {
            const validPasswords = [
                'password123',            // 11 caracteres
                '12345678',              // 8 caracteres
                'P@ssw0rd',              // 8 caracteres con símbolos
                'LongPassword123!',      // Más de 8 caracteres
                '123456789'              // 9 caracteres
            ];

            validPasswords.forEach(password => {
                expect(validatePassword(password)).toBe(true);
            });
        });

        it('should return false for invalid passwords', () => {
            const invalidPasswords = [
                '1234567',               // 7 caracteres
                'pass',                  // 4 caracteres
                '',                      // String vacío
                '   ',                   // Solo espacios
                null,                    // null
                undefined                // undefined
            ];

            invalidPasswords.forEach(password => {
                expect(validatePassword(password)).toBe(false);
            });
        });
    });
}); 