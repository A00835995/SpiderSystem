import { useCallback } from 'react';

export const useExportData = () => {
  const handleExportData = useCallback((data) => {
    const getStatusText = (estado) => {
      switch(estado) {
        case 'pendiente': return 'Pendiente';
        case 'en_proceso': return 'En proceso';
        case 'en_transito': return 'En tránsito';
        case 'confirmada': return 'Confirmada';
        case 'completada': return 'Completada';
        case 'rechazada': return 'Rechazada';
        case 'cancelada': return 'Cancelada';
        default: return 'Pendiente';
      }
    };

    const getPriorityText = (prioridad) => {
      switch(prioridad) {
        case 'alta': return 'Alta';
        case 'media': return 'Media';
        case 'baja': return 'Baja';
        default: return prioridad;
      }
    };

    const header = [
      'Número de Orden',
      'Fecha de Pedido',
      'Producto',
      'Cantidad',
      'Estado',
      'Prioridad',
      'Fecha Límite',
      'Notas',
      'Método de Envío',
      'Dirección de Entrega',
      'Proveedor',
      'Total'
    ].join(',');
    
    const rows = data.map(compra => [
      compra.id,
      compra.fecha,
      `"${compra.producto}"`,
      compra.cantidad,
      getStatusText(compra.estado),
      getPriorityText(compra.prioridad),
      compra.fechaLimite,
      `"${compra.notas}"`,
      `"${compra.metodoEnvio}"`,
      `"${compra.direccionEntrega}"`,
      `"${compra.proveedor}"`,
      compra.total
    ].join(','));
    
    const csv = [header, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'ordenes_de_compra.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return { handleExportData };
}; 