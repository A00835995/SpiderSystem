import React from 'react';
import {
  Title,
  Text,
  Button,
  Icon,
  Card,
  FlexBox,
  FlexBoxJustifyContent,
  BusyIndicator,
  MessageStrip
} from '@ui5/webcomponents-react';

const ProductsStep = ({
  products,
  selectedProducts,
  onProductQuantityChange,
  onNext,
  onBack,
  loading
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1.5rem',
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      width: '100%'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem'
      }}>
        <Title level="H1" style={{
          fontSize: '1.5rem',
          color: 'var(--sapTextColor)',
          fontWeight: '600'
        }}>
          Productos
        </Title>
        <Text style={{
          fontSize: '1rem',
          color: 'var(--sapContent_LabelColor)'
        }}>
          Selecciona los productos
        </Text>
      </div>
      
      {loading ? (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          minHeight: '400px'
        }}>
          <BusyIndicator size="Medium" active />
          <Text style={{ marginLeft: '1rem' }}>Cargando productos del proveedor...</Text>
        </div>
      ) : products.length > 0 ? (
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1.5rem',
          padding: '1rem'
        }}>
          {products.map((product) => {
            const selectedProduct = selectedProducts.find(p => p.productId === product.id);
            const quantity = selectedProduct ? selectedProduct.quantity : 0;

            return (
              <Card
                key={product.id}
                style={{
                  padding: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  height: 'auto',
                  minHeight: '420px',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 'var(--sapContent_Shadow2)'
                  }
                }}
              >
                <div style={{
                  width: '100%',
                  height: '200px',
                  overflow: 'hidden',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      padding: '8px'
                    }}
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem',
                  flex: 1
                }}>
                  <Title level="H2" style={{ 
                    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                    minHeight: '2.5em',
                    wordBreak: 'break-word'
                  }}>
                    {product.name}
                  </Title>
                  <Text style={{ 
                    color: 'var(--sapContent_LabelColor)',
                    minHeight: '3em',
                    fontSize: 'clamp(0.875rem, 1.5vw, 1rem)',
                    wordBreak: 'break-word'
                  }}>
                    {product.description}
                  </Text>
                  <Text style={{ 
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                    fontWeight: '600',
                    color: 'var(--sapTextColor)',
                    marginTop: 'auto'
                  }}>
                    ${product.price}
                  </Text>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: quantity > 0 ? 'space-between' : 'center',
                  gap: '0.5rem',
                  marginTop: 'auto',
                  height: '40px',
                  width: '100%'
                }}>
                  {quantity > 0 ? (
                    <>
                      <Button
                        icon="less"
                        design="Transparent"
                        onClick={() => onProductQuantityChange(product.id, quantity - 1)}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          padding: '0',
                          color: 'var(--sapButton_TextColor)',
                          border: '1px solid var(--sapButton_BorderColor)',
                          backgroundColor: 'transparent'
                        }}
                      />
                      <Text style={{ 
                        width: '40px', 
                        textAlign: 'center',
                        fontSize: '1rem',
                        fontWeight: '500'
                      }}>
                        {quantity}
                      </Text>
                      <Button
                        icon="add"
                        design="Transparent"
                        onClick={() => onProductQuantityChange(product.id, quantity + 1)}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          padding: '0',
                          color: 'var(--sapButton_TextColor)',
                          border: '1px solid var(--sapButton_BorderColor)',
                          backgroundColor: 'transparent'
                        }}
                      />
                      <Button
                        icon="delete"
                        design="Negative"
                        onClick={() => onProductQuantityChange(product.id, 0)}
                        style={{
                          minWidth: '32px',
                          height: '32px',
                          padding: '0'
                        }}
                      />
                    </>
                  ) : (
                    //Este botón se en encarga de agregar el producto al carrito
                    <Button
                      design="Emphasized"
                      onClick={() => onProductQuantityChange(product.id, 1)}
                      style={{ 
                        width: '100%',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        width: '100%'
                      }}>
                        <Icon name="add" />
                        <span>Agregar</span>
                      </div>
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '400px',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <Icon name="product" style={{ fontSize: '3rem', color: 'var(--sapContent_LabelColor)' }} />
          <Text style={{ 
            fontSize: '1.2rem', 
            color: 'var(--sapContent_LabelColor)',
            textAlign: 'center'
          }}>
            No hay productos disponibles para este proveedor
          </Text>
        </div>
      )}

      <FlexBox
        justifyContent={FlexBoxJustifyContent.SpaceBetween}
        style={{
          marginTop: '2rem',
          paddingTop: '1rem',
          borderTop: '1px solid var(--sapContent_ForegroundBorderColor)'
        }}
      >
        <Button
          onClick={onBack}
          style={{
            minWidth: '120px'
          }}
        >
          Atrás
        </Button>
        <Button
          design="Emphasized"
          onClick={onNext}
          disabled={selectedProducts.length === 0}
          style={{
            minWidth: '120px'
          }}
        >
          Continuar
        </Button>
      </FlexBox>
    </div>
  );
};

export default ProductsStep;