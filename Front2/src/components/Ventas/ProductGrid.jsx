import React from 'react';
import { IllustratedMessage, IllustrationMessageType } from '@ui5/webcomponents-react';
import '@ui5/webcomponents-fiori/dist/illustrations/SearchEarth.js';
import ProductCard from './ProductCard';

const ProductGrid = ({ productos, onAddToCart }) => {
  if (productos.length === 0) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '400px'
      }}>
        <IllustratedMessage
          name={IllustrationMessageType.SearchEarth}
          titleText="No se encontraron productos"
          subtitleText="Intenta cambiar tus criterios de búsqueda o filtros"
        />
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0'
    }}>
      {productos.map((producto) => (
        <ProductCard
          key={producto.id}
          producto={producto}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
};

export default ProductGrid; 