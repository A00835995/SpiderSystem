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
          <button
            onClick={onToggle}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: isOpen ? '#074888' : '#0854a0',
              color: 'white',
              boxShadow: isOpen ? '0 6px 16px rgba(0, 0, 0, 0.25)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: isOpen ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.3s ease',
              border: isOpen ? '2px solid #ffffff' : 'none',
              outline: 'none',
              cursor: 'pointer',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}
          >
            {isOpen ? '✕' : '🛒'}
          </button>
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
          padding: carrito.length === 0 ? '2rem' : '0.75rem'
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem' }}>
              {carrito.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: '1.5rem',
                    border: '1px solid #e5e5e5',
                    borderRadius: '12px',
                    backgroundColor: '#ffffff',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                    margin: '0'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {/* Información del producto */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, paddingRight: '1.5rem' }}>
                        <h6 style={{ 
                          margin: 0, 
                          marginBottom: '0.75rem', 
                          fontSize: '1.1rem', 
                          fontWeight: '600',
                          color: '#32363a'
                        }}>
                          {item.nombre}
                        </h6>
                        <p style={{ 
                          fontSize: '0.9rem', 
                          color: '#666', 
                          textTransform: 'capitalize',
                          margin: 0
                        }}>
                          {item.categoria}
                        </p>
                      </div>
                      <Button
                        icon="delete"
                        design="Transparent"
                        onClick={() => onRemoveItem(item.id)}
                        style={{ 
                          color: '#bb0000',
                          minWidth: '36px',
                          height: '36px',
                          borderRadius: '6px'
                        }}
                      />
                    </div>

                    {/* Precio y controles de cantidad */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ 
                          fontSize: '0.8rem', 
                          color: '#666', 
                          marginBottom: '0.25rem',
                          margin: '0 0 0.25rem 0'
                        }}>
                          Precio unitario
                        </p>
                        <p style={{ 
                          fontWeight: 'bold', 
                          color: '#0854a0', 
                          fontSize: '1.2rem',
                          margin: 0
                        }}>
                          ${item.precio.toLocaleString()}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Button
                          icon="less"
                          design="Transparent"
                          onClick={() => onUpdateQuantity(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                          style={{ 
                            minWidth: '40px', 
                            height: '40px',
                            border: '1px solid #d0d0d0',
                            borderRadius: '6px',
                            backgroundColor: '#f8f9fa'
                          }}
                        />
                        <span style={{ 
                          minWidth: '40px', 
                          textAlign: 'center', 
                          fontWeight: 'bold',
                          fontSize: '1.1rem',
                          padding: '0.5rem',
                          backgroundColor: '#f0f7fd',
                          borderRadius: '6px',
                          border: '1px solid #e0f0ff',
                          display: 'inline-block'
                        }}>
                          {item.cantidad}
                        </span>
                        <Button
                          icon="add"
                          design="Transparent"
                          onClick={() => onUpdateQuantity(item.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.stock}
                          style={{ 
                            minWidth: '40px', 
                            height: '40px',
                            border: '1px solid #d0d0d0',
                            borderRadius: '6px',
                            backgroundColor: '#f8f9fa'
                          }}
                        />
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div style={{
                      borderTop: '1px solid #e5e5e5',
                      paddingTop: '1rem',
                      marginTop: '0.5rem',
                      textAlign: 'right'
                    }}>
                      <p style={{ 
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        color: '#0854a0',
                        margin: 0
                      }}>
                        Subtotal: ${(item.precio * item.cantidad).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                              ))}
            </div>
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