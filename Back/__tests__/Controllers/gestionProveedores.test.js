const { executeQuery } = require('../../Utils/dbUtils');
const GestionProveedoresResponseDto = require('../../dto/GestionProveedores/GestionResponseDto');
const {
    getProveedoresResumen,
    getDetalleProveedor,
    createProveedor,
    actualizarNombreProveedor,
    actualizarNombreContactoProveedor,
    actualizarEmailProveedor,
    actualizarTelefonoProveedor,
    actualizarDireccionProveedor,
    actualizarTipoProveedor,
    actualizarTipoPagoProveedor,
    eliminarProveedor,
    getResumenCategorias,
    getDistribucionProveedorInventario,
    getTiposProveedores,
    getTiposPagosProveedores
} = require('../../Controllers/gestionProveedores');

// Mock de dbUtils
jest.mock('../../Utils/dbUtils', () => ({
    executeQuery: jest.fn()
}));

// Mock de Date para tener timestamps consistentes
const mockDate = new Date('2024-03-20T00:00:00.000Z');
global.Date = class extends Date {
    constructor() {
        return mockDate;
    }
    static now() {
        return mockDate.getTime();
    }
};

describe('GestionProveedores Controller', () => {
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
            params: {},
            body: {},
            query: {}
        };
    });

    describe('getProveedoresResumen', () => {
        it('should return 200 and list of providers when providers exist', async () => {
            const mockProviders = [
                {
                    IDPROV: 1,
                    NOMBREPROVEEDOR: 'Provider 1',
                    ULTIMOPEDIDO: '2024-03-20',
                    NOMBRECONTACTO: 'Contact 1',
                    TELEFONO: '1234567890',
                    EMAIL: 'contact1@provider.com',
                    NUMEROPRODUCTOS: 5,
                    TIPOPROVEEDOR: 'Fabricante'
                }
            ];

            executeQuery.mockResolvedValueOnce(mockProviders);

            await getProveedoresResumen(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GETPROVEEDORESRESUMEN()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.proveedoresResumenResponse(mockProviders)
            );
        });

        it('should return 404 when no providers exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getProveedoresResumen(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.notFoundResponse(
                    "No se encontraron proveedores",
                    "Proveedores"
                )
            );
        });

        it('should return 500 when database error occurs', async () => {
            const error = new Error('Database error');
            executeQuery.mockRejectedValueOnce(error);

            await getProveedoresResumen(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(500);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.errorResponse(
                    "Error en el servidor al obtener proveedores",
                    error.message
                )
            );
        });
    });

    describe('getDetalleProveedor', () => {
        it('should return 200 and provider details when provider exists', async () => {
            const mockProvider = {
                NOMBREPROVEEDOR: 'Provider 1',
                NOMBRECONTACTO: 'Contact 1',
                EMAIL: 'contact1@provider.com',
                TELEFONO: '1234567890',
                DIRECCION: 'Address 1',
                TIPOPROVEEDOR: 'Fabricante',
                NUMEROPRODUCTOS: 5,
                TOTALEXISTENCIA: 100,
                TIPOPAGO: 'Crédito',
                ULTIMOPEDIDO: '2024-03-20'
            };

            mockReq.params.id = '1';
            executeQuery.mockResolvedValueOnce([mockProvider]);

            await getDetalleProveedor(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GETDETALLEPROVEEDORPORID(?)', ['1']);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.detalleProveedorResponse(mockProvider)
            );
        });

        it('should return 400 when id is missing', async () => {
            await getDetalleProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.validationErrorResponse(
                    'Se requiere el ID del proveedor',
                    ['id']
                )
            );
        });

        it('should return 404 when provider does not exist', async () => {
            mockReq.params.id = '1';
            executeQuery.mockResolvedValueOnce([]);

            await getDetalleProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.notFoundResponse(
                    'No se encontró el proveedor con ID 1',
                    "Proveedor"
                )
            );
        });
    });

    describe('createProveedor', () => {
        const validProvider = {
            nombre: 'Provider 1',
            contacto: 'Contact 1',
            email: 'contact1@provider.com',
            telefono: '1234567890',
            direccion: 'Address 1',
            tipo: 'Fabricante',
            tipoPago: 'Crédito'
        };

        it('should return 201 when provider is created successfully', async () => {
            mockReq.body = validProvider;
            executeQuery.mockResolvedValueOnce({ insertId: 1 });

            await createProveedor(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith(
                'CALL CREAR_PROVEEDOR(?, ?, ?, ?, ?, ?, ?)',
                [
                    validProvider.nombre,
                    validProvider.contacto,
                    validProvider.email,
                    validProvider.telefono,
                    validProvider.direccion,
                    validProvider.tipoPago,
                    validProvider.tipo
                ]
            );
            expect(mockStatus).toHaveBeenCalledWith(201);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.createProveedorResponse({ insertId: 1 })
            );
        });

        it('should return 400 when required fields are missing', async () => {
            mockReq.body = { nombre: 'Provider 1' };

            await createProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.validationErrorResponse(
                    "Todos los campos obligatorios deben ser proporcionados",
                    ["nombre", "contacto", "email", "telefono", "direccion"]
                )
            );
        });

        it('should return 400 when email format is invalid', async () => {
            mockReq.body = { ...validProvider, email: 'invalid-email' };

            await createProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.validationErrorResponse(
                    "Formato de email inválido"
                )
            );
        });

        it('should return 409 when email is duplicate', async () => {
            mockReq.body = validProvider;
            const error = new Error('Duplicate entry');
            error.message = 'Duplicate entry';
            executeQuery.mockRejectedValueOnce(error);

            await createProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(409);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.conflictResponse(
                    "Ya existe un proveedor con este email",
                    "email"
                )
            );
        });
    });

    describe('actualizarNombreProveedor', () => {
        it('should return 200 when name is updated successfully', async () => {
            mockReq.params.id = '1';
            mockReq.body.nombre = 'New Name';
            executeQuery.mockResolvedValueOnce({ affectedRows: 1 });

            await actualizarNombreProveedor(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith(
                'CALL ACTUALIZAR_NOMBRE_PROVEEDOR(?, ?)',
                ['1', 'New Name']
            );
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.updateProveedorResponse("Nombre", { affectedRows: 1 })
            );
        });

        it('should return 400 when id is missing', async () => {
            mockReq.body.nombre = 'New Name';

            await actualizarNombreProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.validationErrorResponse(
                    'Se requiere el ID del proveedor',
                    ['id']
                )
            );
        });

        it('should return 400 when nombre is missing', async () => {
            mockReq.params.id = '1';

            await actualizarNombreProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.validationErrorResponse(
                    'Se requiere el nuevo nombre del proveedor',
                    ['nombre']
                )
            );
        });
    });

    describe('eliminarProveedor', () => {
        it('should return 200 when provider is deleted successfully', async () => {
            mockReq.params.id = '1';
            executeQuery.mockResolvedValueOnce([{ IDPROV: 1 }]);
            executeQuery.mockResolvedValueOnce({ affectedRows: 1 });

            await eliminarProveedor(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GETDETALLEPROVEEDORPORID(?)', ['1']);
            expect(executeQuery).toHaveBeenCalledWith('CALL ELIMINAR_PROVEEDOR(?)', ['1']);
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.deleteProveedorResponse({ affectedRows: 1 })
            );
        });

        it('should return 400 when id is missing', async () => {
            await eliminarProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(400);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.validationErrorResponse(
                    'Se requiere el ID del proveedor',
                    ['id']
                )
            );
        });

        it('should return 404 when provider does not exist', async () => {
            mockReq.params.id = '1';
            executeQuery.mockResolvedValueOnce([]);

            await eliminarProveedor(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.notFoundResponse(
                    'No se encontró el proveedor con ID 1',
                    "Proveedor"
                )
            );
        });
    });

    describe('getTiposProveedores', () => {
        it('should return 200 and list of provider types when types exist', async () => {
            const mockTypes = [
                { TIPOPROVEEDOR: 'Fabricante' },
                { TIPOPROVEEDOR: 'Distribuidor' }
            ];

            executeQuery.mockResolvedValueOnce(mockTypes);

            await getTiposProveedores(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GET_TIPO_PROVEEDOR()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.tiposDeProveedoresResponse(mockTypes)
            );
        });

        it('should return 404 when no types exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getTiposProveedores(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.notFoundResponse(
                    "No se encontraron tipos de proveedores",
                    "Tipos de proveedores"
                )
            );
        });
    });

    describe('getTiposPagosProveedores', () => {
        it('should return 200 and list of payment types when types exist', async () => {
            const mockTypes = [
                { TIPOPAGO: 'Crédito' },
                { TIPOPAGO: 'Contado' }
            ];

            executeQuery.mockResolvedValueOnce(mockTypes);

            await getTiposPagosProveedores(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GET_TIPO_PAGO_PROVEEDOR()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.tiposDePagosResponse(mockTypes)
            );
        });

        it('should return 404 when no types exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getTiposPagosProveedores(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.notFoundResponse(
                    "No se encontraron tipos de pagos",
                    "Tipos de pagos"
                )
            );
        });
    });

    describe('getResumenCategorias', () => {
        it('should return 200 and list of categories when categories exist', async () => {
            const mockCategories = [
                { CATEGORIA: 'Categoría 1', TOTAL: 10 },
                { CATEGORIA: 'Categoría 2', TOTAL: 20 }
            ];

            executeQuery.mockResolvedValueOnce(mockCategories);

            await getResumenCategorias(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL GETRESUMENCATEGORIA()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.resumenCategoriasResponse(mockCategories)
            );
        });

        it('should return 404 when no categories exist', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getResumenCategorias(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.notFoundResponse(
                    "No se encontraron categorías",
                    "Categorías"
                )
            );
        });
    });

    describe('getDistribucionProveedorInventario', () => {
        it('should return 200 and distribution data when data exists', async () => {
            const mockDistribution = [
                { PROVEEDOR: 'Proveedor 1', TOTAL: 100 },
                { PROVEEDOR: 'Proveedor 2', TOTAL: 200 }
            ];

            executeQuery.mockResolvedValueOnce(mockDistribution);

            await getDistribucionProveedorInventario(mockReq, mockRes);

            expect(executeQuery).toHaveBeenCalledWith('CALL DISTRIBUCION_PROVEEDOR_INVENTARIO()');
            expect(mockStatus).toHaveBeenCalledWith(200);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.distribucionProveedorInventarioResponse(mockDistribution)
            );
        });

        it('should return 404 when no distribution data exists', async () => {
            executeQuery.mockResolvedValueOnce([]);

            await getDistribucionProveedorInventario(mockReq, mockRes);

            expect(mockStatus).toHaveBeenCalledWith(404);
            expect(mockJson).toHaveBeenCalledWith(
                GestionProveedoresResponseDto.notFoundResponse(
                    "No se encontraron datos de distribución",
                    "Distribución de inventario"
                )
            );
        });
    });
}); 