const { executeQuery } = require('../../Utils/dbUtils');
const bcrypt = require('bcryptjs');
const {
    getUsuarios,
    getUsuario,
    createUsuario,
    updateRolUsuario,
    updateNombreUsuario,
    updateEmailUsuario,
    deleteUsuario
} = require('../../Controllers/gestionUsuarios');

// Mock de dbUtils
jest.mock('../../Utils/dbUtils', () => ({
    executeQuery: jest.fn()
}));

// Mock de bcrypt
jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('salt'),
    hash: jest.fn().mockResolvedValue('hashedPassword')
}));

describe('Gestion Usuarios Controller', () => {
    let mockReq;
    let mockRes;
    let mockJson;
    let mockStatus;

    beforeEach(() => {
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();

        // Configurar mock de response
        mockJson = jest.fn();
        mockStatus = jest.fn().mockReturnValue({ json: mockJson });
        mockRes = {
            status: mockStatus,
            json: mockJson
        };

        // Configurar mock de request
        mockReq = {
            query: {},
            params: {},
            body: {}
        };
    });

    describe('getUsuarios', () => {
        it('should return 200 and list of users', async () => {
            const mockResult = [
                { IDUSR: 1, ROLNOM: 'ADMIN', NAMEUSR: 'Admin', EMAILUSR: 'admin@test.com' },
                { IDUSR: 2, ROLNOM: 'USER', NAMEUSR: 'User', EMAILUSR: 'user@test.com' }
            ];
            executeQuery.mockResolvedValueOnce(mockResult);

            await getUsuarios(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "LISTA_USUARIOS"()', []);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.any(Array));
        });

        it('should handle database errors', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getUsuarios(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al obtener los usuarios',
                error: error.message
            });
        });
    });

    describe('getUsuario', () => {
        it('should return 200 and user data when user exists', async () => {
            const mockResult = [{
                IDUSR: 1,
                ROLNOM: 'ADMIN',
                NAMEUSR: 'Admin',
                EMAILUSR: 'admin@test.com'
            }];
            mockReq.params.id = '1';
            executeQuery.mockResolvedValueOnce(mockResult);

            await getUsuario(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "OBTENER_USUARIO"(?)', ['1']);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.any(Object));
        });

        it('should return 400 when id is missing', async () => {
            await getUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere el ID del usuario'
            });
        });

        it('should handle database errors', async () => {
            mockReq.params.id = '1';
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al obtener el usuario',
                error: error.message
            });
        });
    });

    describe('createUsuario', () => {
        const validUserData = {
            rol: 'ADMIN',
            nombre: 'Test User',
            email: 'test@test.com',
            password: 'password123'
        };

        it('should return 200 when user is created successfully', async () => {
            const mockResult = [{ IDUSR: 1 }];
            mockReq.body = validUserData;
            executeQuery.mockResolvedValueOnce(mockResult);

            await createUsuario(mockReq, mockRes);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 'salt');
            expect(executeQuery).toHaveBeenCalledWith(
                'CALL "CREAR_USUARIO"(?, ?, ?, ?)',
                [1, 'Test User', 'test@test.com', 'hashedPassword']
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                id: 1
            }));
        });

        it('should return 400 when name is missing', async () => {
            mockReq.body = { ...validUserData, nombre: '' };

            await createUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'El nombre es requerido'
            });
        });

        it('should return 400 when email is invalid', async () => {
            mockReq.body = { ...validUserData, email: 'invalid-email' };

            await createUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Formato de correo electrónico inválido'
            });
        });

        it('should return 400 when password is invalid', async () => {
            mockReq.body = { ...validUserData, password: '123' };

            await createUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
        });

        it('should return 400 when role is invalid', async () => {
            mockReq.body = { ...validUserData, rol: 'INVALID_ROLE' };

            await createUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Rol no válido'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = validUserData;
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await createUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al crear el usuario',
                error: error.message
            });
        });
    });

    describe('updateRolUsuario', () => {
        it('should return 200 when role is updated successfully', async () => {
            const mockResult = [{ IDUSR: 1 }];
            mockReq.body = { id: 1, rol: 'ADMIN' };
            executeQuery.mockResolvedValueOnce(mockResult);

            await updateRolUsuario(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "ACTUALIZAR_ROL_USUARIO"(?, ?)', [1, 2]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                id: 1
            }));
        });

        it('should return 400 when role is invalid', async () => {
            mockReq.body = { id: 1, rol: 'INVALID_ROLE' };

            await updateRolUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Rol no válido'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = { id: 1, rol: 'ADMIN' };
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await updateRolUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al actualizar el rol del usuario',
                error: error.message
            });
        });
    });

    describe('updateNombreUsuario', () => {
        it('should return 200 when name is updated successfully', async () => {
            const mockResult = [{ IDUSR: 1 }];
            mockReq.body = { id: 1, nombre: 'New Name' };
            executeQuery.mockResolvedValueOnce(mockResult);

            await updateNombreUsuario(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "ACTUALIZAR_NOMBRE_USUARIO"(?, ?)', [1, 'New Name']);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                id: 1
            }));
        });

        it('should return 400 when name is missing', async () => {
            mockReq.body = { id: 1, nombre: '' };

            await updateNombreUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'El nombre es requerido'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = { id: 1, nombre: 'New Name' };
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await updateNombreUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al actualizar el nombre del usuario',
                error: error.message
            });
        });
    });

    describe('updateEmailUsuario', () => {
        it('should return 200 when email is updated successfully', async () => {
            const mockResult = [{ IDUSR: 1 }];
            mockReq.body = { id: 1, email: 'new@test.com' };
            executeQuery.mockResolvedValueOnce(mockResult);

            await updateEmailUsuario(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "ACTUALIZAR_EMAIL_USUARIO"(?, ?)', [1, 'new@test.com']);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                id: 1
            }));
        });

        it('should return 400 when id is missing', async () => {
            mockReq.body = { email: 'new@test.com' };

            await updateEmailUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Se requiere el ID del usuario'
            });
        });

        it('should return 400 when email is invalid', async () => {
            mockReq.body = { id: 1, email: 'invalid-email' };

            await updateEmailUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Formato de correo electrónico inválido'
            });
        });

        it('should handle database errors', async () => {
            mockReq.body = { id: 1, email: 'new@test.com' };
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await updateEmailUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al actualizar el email del usuario',
                error: error.message
            });
        });
    });

    describe('deleteUsuario', () => {
        it('should return 200 when user is deleted successfully', async () => {
            const mockResult = [{ IDUSR: 1 }];
            mockReq.body = { id: 1 };
            executeQuery.mockResolvedValueOnce(mockResult);

            await deleteUsuario(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL "ELIMINAR_USUARIO"(?)', [1]);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                id: 1
            }));
        });

        it('should handle database errors', async () => {
            mockReq.body = { id: 1 };
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await deleteUsuario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith({
                message: 'Error al eliminar el usuario',
                error: error.message
            });
        });
    });
}); 