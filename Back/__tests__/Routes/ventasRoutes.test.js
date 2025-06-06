const request = require('supertest');
const express = require('express');
const ventasRoutes = require('../../Routes/ventasRoutes');
const { verifyToken } = require('../../Middleware/authMiddleware');

// Mock del middleware de autenticación
jest.mock('../../Middleware/authMiddleware', () => ({
    verifyToken: jest.fn((req, res, next) => next())
}));

// Mock del controlador de ventas
jest.mock('../../Controllers/ventas', () => ({
    getArticulosParaVenta: jest.fn((req, res) => res.status(200).json({ message: 'Artículos obtenidos' })),
    registrarVenta: jest.fn((req, res) => res.status(201).json({ message: 'Venta registrada' }))
}));

describe('Ventas Routes', () => {
    let app;

    beforeEach(() => {
        app = express();
        app.use(express.json());
        app.use('/api/ventas', ventasRoutes);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/ventas/articulos-disponibles', () => {
        it('should call verifyToken middleware', async () => {
            await request(app)
                .get('/api/ventas/articulos-disponibles')
                .expect(200);

            expect(verifyToken).toHaveBeenCalled();
        });

        it('should call getArticulosParaVenta controller', async () => {
            const { getArticulosParaVenta } = require('../../Controllers/ventas');

            await request(app)
                .get('/api/ventas/articulos-disponibles')
                .expect(200);

            expect(getArticulosParaVenta).toHaveBeenCalled();
        });
    });

    describe('POST /api/ventas/registrar', () => {
        it('should call verifyToken middleware', async () => {
            await request(app)
                .post('/api/ventas/registrar')
                .send({ venta: {}, detalles: [] })
                .expect(201);

            expect(verifyToken).toHaveBeenCalled();
        });

        it('should call registrarVenta controller', async () => {
            const { registrarVenta } = require('../../Controllers/ventas');
            const ventaData = {
                venta: {
                    idCliente: 1,
                    total: 100
                },
                detalles: [
                    {
                        idArticulo: 1,
                        cantidad: 2,
                        precio: 50
                    }
                ]
            };

            await request(app)
                .post('/api/ventas/registrar')
                .send(ventaData)
                .expect(201);

            expect(registrarVenta).toHaveBeenCalled();
        });

        it('should handle invalid request body', async () => {
            const { registrarVenta } = require('../../Controllers/ventas');
            registrarVenta.mockImplementationOnce((req, res) => 
                res.status(400).json({ message: 'Invalid request body' })
            );

            await request(app)
                .post('/api/ventas/registrar')
                .send({})
                .expect(400);

            expect(registrarVenta).toHaveBeenCalled();
        });
    });

    describe('Error handling', () => {
        it('should handle 404 for non-existent routes', async () => {
            await request(app)
                .get('/api/ventas/non-existent-route')
                .expect(404);
        });

        it('should handle middleware errors', async () => {
            verifyToken.mockImplementationOnce((req, res, next) => {
                throw new Error('Middleware error');
            });

            await request(app)
                .get('/api/ventas/articulos-disponibles')
                .expect(500);
        });
    });
}); 