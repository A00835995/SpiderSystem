import React from 'react';
import {
  Title,
  Text,
  Button,
  FlexBox,
  FlexBoxJustifyContent
} from '@ui5/webcomponents-react';

const SummaryStep = ({
  providers,
  selectedProvider,
  selectedProducts,
  products,
  deliveryPoints,
  deliveryPoint,
  paymentMethods,
  paymentMethod,
  subtotal,
  tax,
  total,
  onConfirm,
  onBack
}) => {
  const selectedDeliveryPoint = deliveryPoints.find(dp => dp.id === deliveryPoint);
  const selectedPaymentMethod = paymentMethods.find(pm => pm.id === paymentMethod);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '2rem',
      padding: '2rem'
    }}>
      <Title level="H1">Resumen del Pedido</Title>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem' 
      }}>
        <div>
          <Title level="H2">Información del Pedido</Title>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Text>Proveedor: {providers.find(p => p.id === selectedProvider)?.name}</Text>
            <Text>Número de Orden: OC-2025-015</Text>
            <Text>Fecha de Pedido: {new Date().toLocaleDateString()}</Text>
            <Text>Fecha Estimada de Entrega: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</Text>
            <Text>Método de Envío: Envío estándar (3-5 días hábiles)</Text>
            <Text>Punto de Entrega: {selectedDeliveryPoint?.name}</Text>
            <Text>Método de Pago: {selectedPaymentMethod?.name}</Text>
          </div>
        </div>

        <div>
          <Title level="H2">Productos Solicitados</Title>
          <div style={{ 
            border: '1px solid var(--sapContent_ForegroundBorderColor)',
            borderRadius: '8px',
            padding: '1rem',
            backgroundColor: 'white'
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {selectedProducts.map(selectedProduct => {
                const product = products.find(p => p.id === selectedProduct.productId);
                return product && selectedProduct.quantity > 0 && (
                  <div key={product.id} style={{
                    padding: '0.5rem 0',
                    borderBottom: '1px solid var(--sapContent_ForegroundBorderColor)'
                  }}>
                    <Text style={{ 
                      display: 'block',
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '0.25rem'
                    }}>
                      {product.name}
                    </Text>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text style={{ 
                        color: 'var(--sapContent_LabelColor)',
                        fontSize: '0.875rem'
                      }}>
                        Cantidad: {selectedProduct.quantity} {selectedProduct.quantity > 1 ? 'unidades' : 'unidad'}
                      </Text>
                      <Text style={{ 
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        ${(product.price * selectedProduct.quantity).toFixed(2)}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ 
              borderTop: '2px solid var(--sapContent_ForegroundBorderColor)',
              marginTop: '1rem',
              paddingTop: '1rem'
            }}>
              <Text style={{ 
                display: 'block', 
                textAlign: 'right',
                marginBottom: '0.25rem'
              }}>
                Subtotal: ${subtotal.toFixed(2)}
              </Text>
              <Text style={{ 
                display: 'block', 
                textAlign: 'right',
                marginBottom: '0.25rem'
              }}>
                IVA (16%): ${tax.toFixed(2)}
              </Text>
              <Text style={{ 
                display: 'block', 
                textAlign: 'right',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                marginTop: '0.5rem'
              }}>
                Total a Pagar: ${total.toFixed(2)}
              </Text>
            </div>
          </div>
        </div>
      </div>

      <FlexBox
        justifyContent={FlexBoxJustifyContent.SpaceBetween}
        style={{
          marginTop: 'auto',
          paddingTop: '2rem',
          borderTop: '1px solid var(--sapContent_ForegroundBorderColor)'
        }}
      >
        <Button
          design="Default"
          onClick={onBack}
          style={{
            minWidth: '120px'
          }}
        >
          Atrás
        </Button>
        <Button
          design="Emphasized"
          onClick={onConfirm}
          style={{
            minWidth: '120px'
          }}
        >
          Confirmar Pedido
        </Button>
      </FlexBox>
    </div>
  );
};

export default SummaryStep;