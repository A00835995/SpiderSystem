import React from 'react';
import { 
  Card, 
  CardHeader, 
  Button, 
  Text, 
  Title, 
  Badge, 
  FlexBox, 
  FlexBoxDirection, 
  FlexBoxJustifyContent,
  FlexBoxAlignItems 
} from '@ui5/webcomponents-react';

const ProductCard = ({ producto, onAddToCart }) => {
  const getStockBadgeColor = (stock) => {
    if (stock > 20) return '8'; // Verde
    if (stock > 10) return '7'; // Naranja
    return '3'; // Rojo
  };

  const getStockText = (stock) => {
    if (stock > 20) return 'En Stock';
    if (stock > 10) return 'Stock Bajo';
    if (stock > 0) return 'Últimas Unidades';
    return 'Agotado';
  };

  return (
    <Card
      style={{
        width: '100%',
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '1px solid #e5e5e5',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
      header={
        <CardHeader
          titleText={producto.nombre}
          subtitleText={producto.categoria}
          style={{ padding: '1rem' }}
        />
      }
    >
      <div style={{ padding: '0 1rem 1rem 1rem' }}>
        {/* Imagen del producto */}
        <div style={{
          width: '100%',
          height: '200px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid #e9ecef'
        }}>
          <img 
            src={producto.imagen} 
            alt={producto.nombre}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div style={{
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            color: '#6c757d',
            fontSize: '3rem'
          }}>
            👟
          </div>
        </div>

        {/* Información del producto */}
        <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '0.75rem' }}>
          {/* Precio */}
          <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
            <Title level="H4" style={{ margin: 0, color: '#0854a0' }}>
              ${producto.precio.toLocaleString()}
            </Title>
            <Badge colorScheme={getStockBadgeColor(producto.stock)}>
              {getStockText(producto.stock)}
            </Badge>
          </FlexBox>

          {/* Descripción */}
          <Text style={{ 
            fontSize: '0.875rem', 
            color: '#666',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {producto.descripcion}
          </Text>



          {/* Botón agregar al carrito */}
          <Button
            design="Emphasized"
            icon="cart-3"
            onClick={() => onAddToCart(producto)}
            disabled={producto.stock === 0}
            style={{
              width: '100%',
              marginTop: '0.5rem',
              backgroundColor: producto.stock === 0 ? '#ccc' : '#0854a0',
              color: 'white'
            }}
          >
            {producto.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
          </Button>
        </FlexBox>
      </div>
    </Card>
  );
};

export default ProductCard; 