import React from 'react';
import { 
  Card, 
  Title, 
  Button, 
  Text, 
  FlexBox, 
  FlexBoxDirection, 
  FlexBoxJustifyContent, 
  FlexBoxAlignItems,
  Badge,
  Icon
} from '@ui5/webcomponents-react';

const ShoppingCart = ({ 
  carrito, 
  isOpen, 
  onToggle, 
  onUpdateQuantity, 
  onRemoveItem, 
  onClearCart,
  onCheckout 
}) => {
  const getTotalItems = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0);
  };

  const getTotalPrice = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  return (
    <>
      {/* Botón flotante del carrito */}
      <div style={{
        position: 'fixed',
        top: '50%',
        right: isOpen ? '320px' : '20px',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        transition: 'right 0.3s ease'
      }}>
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <Button
            design="Emphasized"
            icon="cart"
            onClick={onToggle}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#0854a0',
              color: 'white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          />
          {getTotalItems() > 0 && (
            <Badge 
              colorScheme="3"
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                minWidth: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 'bold',
                zIndex: 1
              }}
            >
              {getTotalItems()}
            </Badge>
          )}
        </div>
      </div>

      {/* Panel lateral del carrito */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-400px',
        width: '400px',
        height: '100vh',
        backgroundColor: 'white',
        boxShadow: isOpen ? '-4px 0 12px rgba(0, 0, 0, 0.15)' : 'none',
        zIndex: 999,
        transition: 'right 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header del carrito */}
        <div style={{
          padding: '1.5rem',
          borderBottom: '1px solid #e5e5e5',
          backgroundColor: '#f8f9fa'
        }}>
          <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
            <Title level="H4" style={{ margin: 0 }}>
              Carrito de Compras
            </Title>
            <Button
              icon="decline"
              design="Transparent"
              onClick={onToggle}
            />
          </FlexBox>
          {getTotalItems() > 0 && (
            <Text style={{ marginTop: '0.5rem', color: '#666' }}>
              {getTotalItems()} {getTotalItems() === 1 ? 'artículo' : 'artículos'}
            </Text>
          )}
        </div>

        {/* Contenido del carrito */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: carrito.length === 0 ? '2rem' : '1rem'
        }}>
          {carrito.length === 0 ? (
            <div style={{
              textAlign: 'center',
              color: '#666'
            }}>
              <Icon name="cart" style={{ fontSize: '3rem', marginBottom: '1rem', color: '#ccc' }} />
              <Text>Tu carrito está vacío</Text>
              <Text style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                Agrega algunos productos para comenzar
              </Text>
            </div>
          ) : (
            <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '1rem' }}>
              {carrito.map((item) => (
                <Card key={item.id} style={{ padding: '1rem' }}>
                  <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.75rem' }}>
                    {/* Información del producto */}
                    <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween}>
                      <div style={{ flex: 1 }}>
                        <Title level="H6" style={{ margin: 0, marginBottom: '0.25rem' }}>
                          {item.nombre}
                        </Title>
                        <Text style={{ fontSize: '0.875rem', color: '#666' }}>
                          {item.categoria}
                        </Text>
                      </div>
                      <Button
                        icon="delete"
                        design="Transparent"
                        onClick={() => onRemoveItem(item.id)}
                        style={{ color: '#bb0000' }}
                      />
                    </FlexBox>

                    {/* Precio y controles de cantidad */}
                    <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
                      <Text style={{ fontWeight: 'bold', color: '#0854a0' }}>
                        ${item.precio.toLocaleString()}
                      </Text>
                      
                      <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: '0.5rem' }}>
                        <Button
                          icon="less"
                          design="Transparent"
                          onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          style={{ minWidth: '32px', height: '32px' }}
                        />
                        <Text style={{ minWidth: '24px', textAlign: 'center', fontWeight: 'bold' }}>
                          {item.cantidad}
                        </Text>
                        <Button
                          icon="add"
                          design="Transparent"
                          onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.stock}
                          style={{ minWidth: '32px', height: '32px' }}
                        />
                      </FlexBox>
                    </FlexBox>

                    {/* Subtotal */}
                    <FlexBox justifyContent={FlexBoxJustifyContent.End}>
                      <Text style={{ fontWeight: 'bold' }}>
                        Subtotal: ${(item.precio * item.cantidad).toLocaleString()}
                      </Text>
                    </FlexBox>
                  </FlexBox>
                </Card>
              ))}
            </FlexBox>
          )}
        </div>

        {/* Footer del carrito */}
        {carrito.length > 0 && (
          <div style={{
            padding: '1.5rem',
            borderTop: '1px solid #e5e5e5',
            backgroundColor: '#f8f9fa'
          }}>
            <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '1rem' }}>
              {/* Total */}
              <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
                <Title level="H5" style={{ margin: 0 }}>Total:</Title>
                <Title level="H4" style={{ margin: 0, color: '#0854a0' }}>
                  ${getTotalPrice().toLocaleString()}
                </Title>
              </FlexBox>

              {/* Botones de acción */}
              <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.5rem' }}>
                <Button
                  design="Emphasized"
                  icon="cart-approval"
                  onClick={onCheckout}
                  style={{
                    width: '100%',
                    backgroundColor: '#0854a0',
                    color: 'white'
                  }}
                >
                  Proceder al Pago
                </Button>
                <Button
                  design="Default"
                  icon="delete"
                  onClick={onClearCart}
                  style={{ width: '100%' }}
                >
                  Vaciar Carrito
                </Button>
              </FlexBox>
            </FlexBox>
          </div>
        )}
      </div>

      {/* Overlay para cerrar el carrito */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.3)',
            zIndex: 998
          }}
          onClick={onToggle}
        />
      )}
    </>
  );
};

export default ShoppingCart; 