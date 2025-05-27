import React from 'react';
import { 
  Button, 
  FlexBox, 
  Form, 
  FormItem, 
  Title, 
  Text, 
  ObjectStatus, 
  Badge, 
  ValueState 
} from '@ui5/webcomponents-react';
import CustomDialog from './CustomDialog';

const DetailsDialog = ({ 
  isOpen, 
  onClose, 
  selectedCompra, 
  onConfirm, 
  onReject 
}) => {
  if (!selectedCompra) return null;

  // Obtener color del estado
  const getStatusValueState = (estado) => {
    switch(estado) {
      case 'pendiente': return ValueState.Warning;
      case 'en_proceso': return ValueState.Information;
      case 'en_transito': return ValueState.Information;
      case 'confirmada': return ValueState.Success;
      case 'completada': return ValueState.Success;
      case 'rechazada': return ValueState.Error;
      case 'cancelada': return ValueState.Error;
      default: return ValueState.Warning;
    }
  };

  // Obtener texto del estado
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

  // Obtener color de badge de prioridad
  const getPriorityBadgeColor = (prioridad) => {
    switch(prioridad) {
      case 'alta': return '3';
      case 'media': return '7';
      case 'baja': return '8';
      default: return '10';
    }
  };

  // Obtener texto de prioridad
  const getPriorityText = (prioridad) => {
    switch(prioridad) {
      case 'alta': return 'Alta';
      case 'media': return 'Media';
      case 'baja': return 'Baja';
      default: return prioridad;
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  return (
    <CustomDialog
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Compra"
      footer={
        <FlexBox style={{ gap: '0.5rem', justifyContent: 'flex-end' }}>
          <Button 
            design="Default"
            onClick={onClose}
          >
            Cerrar
          </Button>
          {selectedCompra.estado === 'pendiente' && (
            <>
              <Button 
                design="Negative"
                icon="decline"
                onClick={onReject}
                style={{ backgroundColor: '#bb0000', color: 'white' }}
              >
                Rechazar Orden
              </Button>
              <Button 
                design="Emphasized"
                icon="accept"
                onClick={onConfirm}
                style={{ backgroundColor: '#0854a0', color: 'white' }}
              >
                Aceptar
              </Button>
            </>
          )}
        </FlexBox>
      }
    >
      <div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
          <div style={{ flex: '1 1 300px' }}>
            <Form columnsL={1} columnsXL={1}>
              <FormItem label="Número de Orden:">
                <Title level="H5">{selectedCompra.id}</Title>
              </FormItem>
              
              <FormItem label="Proveedor:">
                <Text>{selectedCompra.proveedor}</Text>
              </FormItem>
              
              <FormItem label="Fecha:">
                <Text>{formatDate(selectedCompra.fecha)}</Text>
              </FormItem>
              
              <FormItem label="Estado:">
                <ObjectStatus
                  state={getStatusValueState(selectedCompra.estado)}
                  text={getStatusText(selectedCompra.estado)}
                />
              </FormItem>
              
              <FormItem label="Prioridad:">
                <Badge colorScheme={getPriorityBadgeColor(selectedCompra.prioridad)}>
                  {getPriorityText(selectedCompra.prioridad)}
                </Badge>
              </FormItem>
            </Form>
          </div>
          
          <div style={{ flex: '1 1 300px' }}>
            <Form columnsL={1} columnsXL={1}>
              <FormItem label="Producto:">
                <Text>{selectedCompra.producto}</Text>
              </FormItem>
              
              <FormItem label="Cantidad:">
                <Badge colorScheme="8">{selectedCompra.cantidad}</Badge>
              </FormItem>
              
              <FormItem label="Precio Unitario:">
                <Text>${selectedCompra.precioUnitario.toLocaleString()}</Text>
              </FormItem>
              
              <FormItem label="Total:">
                <Text style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
                  ${selectedCompra.total.toLocaleString()}
                </Text>
              </FormItem>
              
              <FormItem label="Fecha Límite:">
                <Text>{formatDate(selectedCompra.fechaLimite)}</Text>
              </FormItem>
            </Form>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Title level="H5" style={{ marginBottom: '1rem' }}>Información de Entrega</Title>
          <Form columnsL={1} columnsXL={1}>
            <FormItem label="Método de Envío">
              <Text>{selectedCompra.metodoEnvio}</Text>
            </FormItem>
            <FormItem label="Dirección de Entrega">
              <Text>{selectedCompra.direccionEntrega}</Text>
            </FormItem>
            <FormItem label="Notas">
              <Text>{selectedCompra.notas !== "-" ? selectedCompra.notas : "No hay notas adicionales"}</Text>
            </FormItem>
          </Form>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <Title level="H5" style={{ marginBottom: '1rem' }}>Información de Pago</Title>
          <Form columnsL={1} columnsXL={1}>
            <FormItem label="Método de Pago">
              <Text>{selectedCompra.detalles.metodoPago}</Text>
            </FormItem>
            <FormItem label="Términos de Pago">
              <Text>{selectedCompra.detalles.terminosPago}</Text>
            </FormItem>
          </Form>
        </div>
      </div>
    </CustomDialog>
  );
};

export default DetailsDialog; 