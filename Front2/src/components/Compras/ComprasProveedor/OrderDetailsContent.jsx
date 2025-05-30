import React from 'react';
import { 
  Title, 
  Text, 
  Form, 
  FormItem, 
  Badge, 
  ObjectStatus 
} from '@ui5/webcomponents-react';

const OrderDetailsContent = ({ 
  selectedCompra, 
  formatDate, 
  getStatusValueState, 
  getStatusText,
  getPriorityBadgeColor,
  getPriorityText 
}) => {
  return (
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
  );
};

export default OrderDetailsContent; 