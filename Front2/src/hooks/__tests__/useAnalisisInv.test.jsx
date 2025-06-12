import { renderHook, act } from '@testing-library/react';
import { useAnalisisInv } from '../useAnalisisInv';
import AnalisisInvService from '../../services/AnalisisInvService';

// Mock del servicio
jest.mock('../../services/AnalisisInvService', () => ({
  getCurrentYear: jest.fn(() => 2024),
  getAvailableYears: jest.fn(() => [2023, 2024, 2025]),
  getAvailablePeriodsAroundCurrent: jest.fn(() => ['202403', '202404', '202405']),
  isValidYear: jest.fn((year) => year >= 2023 && year <= 2025),
  getAnalisisInventario: jest.fn(),
  clasificarProductosPorEstado: jest.fn(),
  getProductosAccionUrgente: jest.fn(),
  getProductosParaPromocion: jest.fn()
}));

describe('useAnalisisInv', () => {
  const mockData = {
    data: {
      productos: [
        {
          id: 1,
          nombre: 'Producto 1',
          estadoStock: 'OPTIMO',
          tipoSituacion: 'NORMAL',
          diferencia: 10
        },
        {
          id: 2,
          nombre: 'Producto 2',
          estadoStock: 'CRITICO',
          tipoSituacion: 'URGENTE',
          diferencia: -20
        }
      ],
      resumen: {
        totalProductos: 2,
        productosOptimos: 1,
        productosCriticos: 1
      }
    }
  };

  beforeEach(() => {
    // Resetear todos los mocks antes de cada prueba
    jest.clearAllMocks();
    
    // Configurar mocks por defecto
    AnalisisInvService.getAnalisisInventario.mockResolvedValue(mockData);
    AnalisisInvService.clasificarProductosPorEstado.mockReturnValue({
      OPTIMO: [mockData.data.productos[0]],
      CRITICO: [mockData.data.productos[1]]
    });
    AnalisisInvService.getProductosAccionUrgente.mockReturnValue([mockData.data.productos[1]]);
    AnalisisInvService.getProductosParaPromocion.mockReturnValue([]);
  });

  it('debería inicializar con el año actual', () => {
    const { result } = renderHook(() => useAnalisisInv());
    expect(result.current.selectedYear).toBe(2024);
  });

  it('debería cargar datos de análisis de inventario', async () => {
    const { result } = renderHook(() => useAnalisisInv());

    await act(async () => {
      await result.current.loadAnalisisInventario(2024);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.analisisData).toEqual(mockData);
    expect(AnalisisInvService.getAnalisisInventario).toHaveBeenCalledWith(2024);
  });

  it('debería manejar errores al cargar datos', async () => {
    const errorMessage = 'Error al cargar datos';
    AnalisisInvService.getAnalisisInventario.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useAnalisisInv());

    await act(async () => {
      await result.current.loadAnalisisInventario(2024);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.analisisData).toBe(null);
  });

  it('debería cambiar el año y recargar datos', async () => {
    const { result } = renderHook(() => useAnalisisInv());

    await act(async () => {
      await result.current.changeYear(2025);
    });

    expect(result.current.selectedYear).toBe(2025);
    expect(AnalisisInvService.getAnalisisInventario).toHaveBeenCalledWith(2025);
  });

  it('debería obtener productos por estado', async () => {
    const { result } = renderHook(() => useAnalisisInv());

    await act(async () => {
      await result.current.loadAnalisisInventario(2024);
    });

    const productosOptimos = result.current.getProductosByEstado('OPTIMO');
    expect(productosOptimos).toHaveLength(1);
    expect(productosOptimos[0].nombre).toBe('Producto 1');
  });

  it('debería obtener el producto con mayor exceso', async () => {
    const { result } = renderHook(() => useAnalisisInv());

    await act(async () => {
      await result.current.loadAnalisisInventario(2024);
    });

    const productoMayorExceso = result.current.getProductoMayorExceso();
    expect(productoMayorExceso.nombre).toBe('Producto 1');
    expect(productoMayorExceso.diferencia).toBe(10);
  });

  it('debería obtener el producto con mayor déficit', async () => {
    const { result } = renderHook(() => useAnalisisInv());

    await act(async () => {
      await result.current.loadAnalisisInventario(2024);
    });

    const productoMayorDeficit = result.current.getProductoMayorDeficit();
    expect(productoMayorDeficit.nombre).toBe('Producto 2');
    expect(productoMayorDeficit.diferencia).toBe(-20);
  });

  it('debería limpiar los datos correctamente', async () => {
    const { result } = renderHook(() => useAnalisisInv());

    await act(async () => {
      await result.current.loadAnalisisInventario(2024);
      result.current.clearData();
    });

    expect(result.current.analisisData).toBe(null);
    expect(result.current.error).toBe(null);
    expect(result.current.productosClasificados).toEqual({});
    expect(result.current.productosAccionUrgente).toEqual([]);
    expect(result.current.productosParaPromocion).toEqual([]);
  });
}); 