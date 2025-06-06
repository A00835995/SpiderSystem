const VentaResponseDto = require('../../../dto/Ventas/VentaResponseDto');

describe('VentaResponseDto', () => {
    describe('toArticuloParaVenta', () => {
        it('should transform a database article to sale format', () => {
            // Datos de prueba
            const dbArticulo = {
                ARTIID: 1,
                ARTNOMBRE: 'Producto Test',
                ARTPRECIOVENTA: 100,
                ARTIVA: 16,
                ARTEXISTENCIA: 50
            };

            // Ejecutar transformación
            const result = VentaResponseDto.toArticuloParaVenta(dbArticulo);

            // Verificar resultado
            expect(result).toEqual({
                id: 1,
                nombre: 'Producto Test',
                precioVenta: 100,
                iva: 16,
                existencia: 50,
                precioConIva: Number((100 * (1 + (16/100))).toFixed(2))
            });
        });

        it('should handle zero IVA', () => {
            const dbArticulo = {
                ARTIID: 1,
                ARTNOMBRE: 'Producto Sin IVA',
                ARTPRECIOVENTA: 100,
                ARTIVA: 0,
                ARTEXISTENCIA: 50
            };

            const result = VentaResponseDto.toArticuloParaVenta(dbArticulo);

            expect(result).toEqual({
                id: 1,
                nombre: 'Producto Sin IVA',
                precioVenta: 100,
                iva: 0,
                existencia: 50,
                precioConIva: 100
            });
        });

        it('should handle missing or null values', () => {
            const dbArticulo = {
                ARTIID: 1,
                ARTNOMBRE: 'Producto Incompleto',
                // ARTPRECIOVENTA faltante
                ARTIVA: null,
                ARTEXISTENCIA: undefined
            };

            const result = VentaResponseDto.toArticuloParaVenta(dbArticulo);

            expect(result).toEqual({
                id: 1,
                nombre: 'Producto Incompleto',
                precioVenta: undefined,
                iva: null,
                existencia: undefined,
                precioConIva: NaN
            });
        });
    });

    describe('toArticulosParaVentaList', () => {
        it('should transform an array of database articles to sale format', () => {
            // Datos de prueba
            const dbArticulos = [
                {
                    ARTIID: 1,
                    ARTNOMBRE: 'Producto 1',
                    ARTPRECIOVENTA: 100,
                    ARTIVA: 16,
                    ARTEXISTENCIA: 50
                },
                {
                    ARTIID: 2,
                    ARTNOMBRE: 'Producto 2',
                    ARTPRECIOVENTA: 200,
                    ARTIVA: 16,
                    ARTEXISTENCIA: 30
                }
            ];

            // Ejecutar transformación
            const result = VentaResponseDto.toArticulosParaVentaList(dbArticulos);

            // Verificar resultado
            expect(result).toHaveLength(2);
            expect(result[0]).toEqual({
                id: 1,
                nombre: 'Producto 1',
                precioVenta: 100,
                iva: 16,
                existencia: 50,
                precioConIva: Number((100 * (1 + (16/100))).toFixed(2))
            });
            expect(result[1]).toEqual({
                id: 2,
                nombre: 'Producto 2',
                precioVenta: 200,
                iva: 16,
                existencia: 30,
                precioConIva: Number((200 * (1 + (16/100))).toFixed(2))
            });
        });

        it('should return empty array when input is not an array', () => {
            // Probar con diferentes tipos de entrada inválidos
            const invalidInputs = [
                null,
                undefined,
                {},
                'not an array',
                123
            ];

            invalidInputs.forEach(input => {
                const result = VentaResponseDto.toArticulosParaVentaList(input);
                expect(result).toEqual([]);
            });
        });

        it('should handle empty array', () => {
            const result = VentaResponseDto.toArticulosParaVentaList([]);
            expect(result).toEqual([]);
        });

        it('should handle array with invalid items', () => {
            const dbArticulos = [
                {
                    ARTIID: 1,
                    ARTNOMBRE: 'Producto Válido',
                    ARTPRECIOVENTA: 100,
                    ARTIVA: 16,
                    ARTEXISTENCIA: 50
                },
                null,
                undefined,
                {},
                'invalid item'
            ];

            const result = VentaResponseDto.toArticulosParaVentaList(dbArticulos);

            expect(result).toHaveLength(5);
            expect(result[0]).toEqual({
                id: 1,
                nombre: 'Producto Válido',
                precioVenta: 100,
                iva: 16,
                existencia: 50,
                precioConIva: Number((100 * (1 + (16/100))).toFixed(2))
            });
            // Los items inválidos deberían resultar en objetos con valores undefined/NaN
            expect(result[1]).toEqual({
                id: undefined,
                nombre: undefined,
                precioVenta: undefined,
                iva: undefined,
                existencia: undefined,
                precioConIva: NaN
            });
        });
    });
}); 