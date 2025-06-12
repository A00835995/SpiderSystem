import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Alertas from '../Alertas';
import { fetchAlertas } from '../../services/AlertasService';

// Mock del servicio de alertas
jest.mock('../../services/AlertasService', () => ({
  fetchAlertas: jest.fn()
}));

// Mock de los componentes hijos
jest.mock('../../components/Alertas/AlertHeader', () => () => <div data-testid="alert-header">Header</div>);
jest.mock('../../components/Alertas/AlertFilters', () => ({ selectedFilter, onFilterChange, onRefresh }) => (
  <div data-testid="alert-filters">
    <button onClick={() => onFilterChange('error')}>Error Filter</button>
    <button onClick={() => onFilterChange('warning')}>Warning Filter</button>
    <button onClick={() => onFilterChange('success')}>Success Filter</button>
    <button onClick={() => onFilterChange('all')}>All Filter</button>
    <button onClick={onRefresh}>Refresh</button>
  </div>
));
jest.mock('../../components/Alertas/AlertList', () => ({ alerts, onAlertClick }) => (
  <div data-testid="alert-list">
    {alerts.map(alert => (
      <div key={alert.id} onClick={() => onAlertClick(alert)}>
        {alert.title}
      </div>
    ))}
  </div>
));
jest.mock('../../components/Alertas/AlertDetailDialog', () => ({ isOpen, onClose }) => (
  isOpen ? <div data-testid="alert-detail-dialog">Detail Dialog</div> : null
));

describe('Alertas Component', () => {
  const mockAlerts = [
    {
      id: 1,
      estado: 'Bajo Stock',
      nombre: 'Producto 1',
      mensaje: 'Stock bajo',
      fecha_creacion: '2024-03-20T10:00:00',
      existencia: 5,
      fecha_resolucion: false
    },
    {
      id: 2,
      estado: 'Agotado',
      nombre: 'Producto 2',
      mensaje: 'Sin stock',
      fecha_creacion: '2024-03-20T11:00:00',
      existencia: 0,
      fecha_resolucion: true
    }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    fetchAlertas.mockResolvedValue({ data: mockAlerts });
  });

  it('debería renderizar el componente correctamente', async () => {
    render(<Alertas />);
    
    expect(screen.getByTestId('alert-header')).toBeInTheDocument();
    expect(screen.getByTestId('alert-filters')).toBeInTheDocument();
    expect(screen.getByTestId('alert-list')).toBeInTheDocument();
  });

  it('debería cargar las alertas al montar el componente', async () => {
    render(<Alertas />);
    
    await waitFor(() => {
      expect(fetchAlertas).toHaveBeenCalled();
    });
  });

  it('debería filtrar las alertas correctamente', async () => {
    render(<Alertas />);
    
    await waitFor(() => {
      expect(screen.getByTestId('alert-list')).toBeInTheDocument();
    });

    // Filtrar por error
    fireEvent.click(screen.getByText('Error Filter'));
    expect(screen.getByTestId('alert-list')).toBeInTheDocument();

    // Filtrar por warning
    fireEvent.click(screen.getByText('Warning Filter'));
    expect(screen.getByTestId('alert-list')).toBeInTheDocument();

    // Mostrar todas
    fireEvent.click(screen.getByText('All Filter'));
    expect(screen.getByTestId('alert-list')).toBeInTheDocument();
  });

  it('debería manejar errores al cargar alertas', async () => {
    fetchAlertas.mockRejectedValue(new Error('Error al cargar alertas'));
    
    render(<Alertas />);
    
    await waitFor(() => {
      expect(screen.getByTestId('alert-list')).toBeInTheDocument();
    });
  });

  it('debería actualizar las alertas al refrescar', async () => {
    render(<Alertas />);
    
    await waitFor(() => {
      expect(fetchAlertas).toHaveBeenCalledTimes(1);
    });

    fireEvent.click(screen.getByText('Refresh'));

    await waitFor(() => {
      expect(fetchAlertas).toHaveBeenCalledTimes(2);
    });
  });

  it('debería mostrar el diálogo de detalles al hacer clic en una alerta', async () => {
    render(<Alertas />);
    
    await waitFor(() => {
      expect(screen.getByTestId('alert-list')).toBeInTheDocument();
    });

    const alertElement = screen.getByText('Producto 1 - Bajo Stock');
    fireEvent.click(alertElement);

    expect(screen.getByTestId('alert-detail-dialog')).toBeInTheDocument();
  });

  it('debería ordenar las alertas correctamente', async () => {
    render(<Alertas />);
    
    await waitFor(() => {
      expect(screen.getByTestId('alert-list')).toBeInTheDocument();
    });

    // Las alertas no resueltas deberían aparecer primero
    const alertElements = screen.getAllByText(/Producto/);
    expect(alertElements[0]).toHaveTextContent('Producto 1');
  });
}); 