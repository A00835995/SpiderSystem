import React from 'react';
import {
  Title,
  Text,
  Button,
  Icon,
  Card,
  FlexBox,
  FlexBoxJustifyContent
} from '@ui5/webcomponents-react';

const ProductsStep = ({
  products,
  selectedProducts,
  onProductQuantityChange,
  onNext,
  onBack
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
      
      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
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
                height: '400px',
                boxShadow: 'var(--sapContent_Shadow0)',
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
                backgroundColor: 'var(--sapContent_ImagePlaceholderBackground)',
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
                  fontSize: '1.25rem',
                  minHeight: '1.5em'
                }}>
                  {product.name}
                </Title>
                <Text style={{ 
                  color: 'var(--sapContent_LabelColor)',
                  minHeight: '3em'
                }}>
                  {product.description}
                </Text>
                <Text style={{ 
                  fontSize: '1.5rem',
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
                height: '40px'
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