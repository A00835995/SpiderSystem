import React from 'react';
import { 
  Button, 
  FlexBox, 
  Form, 
  FormItem, 
  Title, 
  Text, 
  Badge, 
  Loader,
  Table,
  TableColumn,
  TableRow,
  TableCell,
  Label,
  MessageStrip
} from '@ui5/webcomponents-react';
import CustomDialog from './CustomDialog';

const DetailsDialog = ({ 
  isOpen, 
  onClose, 
  selectedCompra, 
  onConfirm,
  detalleOrdenCompra,
  loadingDetalle
}) => {
  if (!selectedCompra) return null;

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  // Formatear número
  const formatNumber = (number) => {
    if (number === null || number === undefined) return '-';
    return number.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  // Log para depuración
  console.log("Datos de la orden seleccionada:", selectedCompra);
  console.log("Datos de la API:", detalleOrdenCompra);

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
          {selectedCompra.estado === 'pendiente' && detalleOrdenCompra?.estadoOrden?.toLowerCase() !== 'en proceso' && (
            <>
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
        {loadingDetalle && (
          <div style={{ textAlign: 'center', padding: '1rem', marginBottom: '1rem' }}>
            <Loader />
            <Text style={{ marginTop: '0.5rem' }}>Cargando detalles de la orden...</Text>
          </div>
        )}

        {!loadingDetalle && (
          <>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
              <div style={{ flex: '1 1 300px' }}>
                <Form columnsL={1} columnsXL={1}>
                  <FormItem label="Número de Orden:">
                    <Title level="H5">{selectedCompra.id}</Title>
                  </FormItem>
                  
                  <FormItem label="Proveedor:">
                    <Text>{detalleOrdenCompra?.proveedorNombre || selectedCompra.proveedor}</Text>
                  </FormItem>
                  
                  <FormItem label="Fecha:">
                    <Text>{detalleOrdenCompra?.fechaMovimiento 
                      ? formatDate(detalleOrdenCompra.fechaMovimiento) 
                      : formatDate(selectedCompra.fecha)}
                    </Text>
                  </FormItem>
                </Form>
              </div>
              
              <div style={{ flex: '1 1 300px' }}>
                <Form columnsL={1} columnsXL={1}>
                  <FormItem label="Fecha Límite:">
                    <Text>{detalleOrdenCompra?.fechaEntrega 
                      ? formatDate(detalleOrdenCompra.fechaEntrega) 
                      : formatDate(selectedCompra.fechaLimite)}
                    </Text>
                  </FormItem>
                  
                  <FormItem label="Método de Pago:">
                    <Text>{detalleOrdenCompra?.metodoPago || selectedCompra.detalles.metodoPago}</Text>
                  </FormItem>
                </Form>
              </div>
            </div>

            {/* Tabla de artículos */}
            <div style={{ marginTop: '2rem' }}>
              <Title level="H5" style={{ marginBottom: '1rem' }}>Artículos de la Orden</Title>
              
              {detalleOrdenCompra?.articulos && detalleOrdenCompra.articulos.length > 0 ? (
                <>
                  <Table
                    columns={
                      <>
                        <TableColumn style={{ width: '40%' }}>Producto</TableColumn>
                        <TableColumn style={{ width: '15%' }}>Cantidad</TableColumn>
                        <TableColumn style={{ width: '20%' }}>Precio Unitario</TableColumn>
                        <TableColumn style={{ width: '25%' }}>Subtotal</TableColumn>
                      </>
                    }
                  >
                    {detalleOrdenCompra.articulos.map((articulo, index) => (
                      <TableRow key={`${articulo.articuloId}-${index}`}>
                        <TableCell>{articulo.nombreArticulo}</TableCell>
                        <TableCell>
                          <Badge colorScheme="8">{articulo.cantidad}</Badge>
                        </TableCell>
                        <TableCell>${formatNumber(articulo.precioUnitario)}</TableCell>
                        <TableCell>${formatNumber(articulo.subtotal)}</TableCell>
                      </TableRow>
                    ))}
                  </Table>
                  
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    marginTop: '1rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px'
                  }}>
                    <Label style={{ marginRight: '1rem', fontWeight: 'bold', fontSize: '1.1rem' }}>
                      Total:
                    </Label>
                    <Text style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      ${formatNumber(detalleOrdenCompra.totalGeneral)}
                    </Text>
                  </div>
                </>
              ) : (
                <MessageStrip 
                  design="Information"
                  style={{ marginTop: '1rem' }}
                >
                  No hay información detallada de artículos disponible para esta orden.
                </MessageStrip>
              )}
            </div>

            <div style={{ marginTop: '2rem' }}>
              <Title level="H5" style={{ marginBottom: '1rem' }}>Información de Entrega</Title>
              <Form columnsL={1} columnsXL={1}>
                <FormItem label="Dirección de Entrega">
                  <Text>{selectedCompra.direccionEntrega}</Text>
                </FormItem>
              </Form>
            </div>
          </>
        )}
      </div>
    </CustomDialog>
  );
};

// Función auxiliar para mapear el estado
const mapearEstado = (estadoBackend) => {
  if (!estadoBackend) return 'pendiente';
  
  switch(estadoBackend.toLowerCase()) {
    case 'pendiente': return 'pendiente';
    case 'en proceso': return 'en_proceso';
    case 'en tránsito': return 'en_transito';
    case 'completada': return 'completada';
    case 'rechazada': return 'rechazada';
    case 'cancelada': return 'cancelada';
    default: return 'pendiente';
  }
};

export default DetailsDialog; 