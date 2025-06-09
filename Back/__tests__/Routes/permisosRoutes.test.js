const express = require('express');
const request = require('supertest');
const permisosRoutes = require('../../Routes/permisosRoutes');
const permisosController = require('../../Controllers/permisos');
const { verifyToken } = require('../../Middleware/authMiddleware');

// Mock de los controladores
jest.mock('../../Controllers/permisos', () => ({
    obtenerRoles: jest.fn((req, res) => res.status(200).json({})),
    obtenerPaginas: jest.fn((req, res) => res.status(200).json({})),
    obtenerRolPagina: jest.fn((req, res) => res.status(200).json({})),
    obtenerPaginasPermitidas: jest.fn((req, res) => res.status(200).json({})),
    verificarPermiso: jest.fn((req, res) => {
        if (!req.params.idRol || !req.params.ruta) {
            return res.status(404).json({});
        }
        return res.status(200).json({});
    })
}));

// Mock del middleware de autenticación
jest.mock('../../Middleware/authMiddleware', () => ({
    verifyToken: jest.fn((req, res, next) => next())
}));

describe('Permisos Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use('/api/permisos', permisosRoutes);
        
        // Limpiar todos los mocks antes de cada prueba
        jest.clearAllMocks();
    });

    describe('GET /api/permisos/roles', () => {
        it('should call obtenerRoles controller', async () => {
            const response = await request(app).get('/api/permisos/roles');
            expect(response.status).toBe(200);
            expect(permisosController.obtenerRoles).toHaveBeenCalled();
        }, 1000);
    });

    describe('GET /api/permisos/paginas', () => {
        it('should call obtenerPaginas controller', async () => {
            const response = await request(app).get('/api/permisos/paginas');
            expect(response.status).toBe(200);
            expect(permisosController.obtenerPaginas).toHaveBeenCalled();
        }, 1000);
    });

    describe('GET /api/permisos/rol-pagina', () => {
        it('should call obtenerRolPagina controller', async () => {
            const response = await request(app).get('/api/permisos/rol-pagina');
            expect(response.status).toBe(200);
            expect(permisosController.obtenerRolPagina).toHaveBeenCalled();
        }, 1000);
    });

    describe('GET /api/permisos/paginas-permitidas/:idRol', () => {
        it('should call obtenerPaginasPermitidas controller with correct idRol', async () => {
            const idRol = 1;
            const response = await request(app).get(`/api/permisos/paginas-permitidas/${idRol}`);
            expect(response.status).toBe(200);
            expect(permisosController.obtenerPaginasPermitidas).toHaveBeenCalled();
        }, 1000);

        it('should handle invalid idRol parameter', async () => {
            const invalidIdRol = 'invalid';
            const response = await request(app).get(`/api/permisos/paginas-permitidas/${invalidIdRol}`);
            expect(response.status).toBe(200);
            expect(permisosController.obtenerPaginasPermitidas).toHaveBeenCalled();
        }, 1000);
    });

    describe('GET /api/permisos/verificar-permiso/:idRol/:ruta', () => {
        it('should call verificarPermiso controller with correct parameters', async () => {
            const idRol = 1;
            const ruta = 'dashboard';
            const response = await request(app).get(`/api/permisos/verificar-permiso/${idRol}/${ruta}`);
            expect(response.status).toBe(200);
            expect(permisosController.verificarPermiso).toHaveBeenCalled();
        }, 1000);

        it('should handle invalid parameters', async () => {
            const invalidIdRol = '';
            const invalidRuta = '';
            const response = await request(app).get(`/api/permisos/verificar-permiso/${invalidIdRol}/${invalidRuta}`);
            expect(response.status).toBe(404);
            expect(permisosController.verificarPermiso).toHaveBeenCalled();
        }, 1000);
    });

    describe('Error handling', () => {
        it('should handle 404 for non-existent routes', async () => {
            const response = await request(app).get('/api/permisos/non-existent-route');
            expect(response.status).toBe(404);
        }, 1000);

        it('should handle middleware errors', async () => {
            // Simular un error en el middleware
            verifyToken.mockImplementationOnce((req, res, next) => {
                const error = new Error('Middleware error');
                error.status = 500;
                next(error);
            });

            const response = await request(app).get('/api/permisos/roles');
            expect(response.status).toBe(500);
        }, 1000);
    });
}); 