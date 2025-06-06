import React from 'react';
import {
  Button,
  FlexBox,
  FlexBoxJustifyContent
} from '@ui5/webcomponents-react';

const ProveedoresPagination = ({ 
  currentPage, 
  setCurrentPage, 
  proveedores, 
  itemsPerPage
}) => {
  // Calcular páginas totales
  const totalPages = Math.ceil(proveedores.length / itemsPerPage);
  
  // No mostrar paginación si hay menos de 1 página
  if (totalPages <= 1) return null;

  return (
    <FlexBox 
      justifyContent={FlexBoxJustifyContent.Center} 
      style={{ 
        marginTop: '1rem', 
        padding: '0.5rem',
        backgroundColor: 'var(--sapList_HeaderBackground)',
        borderTop: '1px solid var(--sapContent_ForegroundBorderColor)',
      }}
    >
      <Button
        design="Transparent"
        icon="navigation-left-arrow"
        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        style={{ minWidth: '2rem', height: '2rem', padding: '0' }}
      />
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <Button
          key={page}
          design={currentPage === page ? "Emphasized" : "Transparent"}
          onClick={() => setCurrentPage(page)}
          style={{ 
            minWidth: '2.25rem',
            height: '2.25rem',
            borderRadius: '0.25rem',
            margin: '0 0.125rem',
            padding: '0'
          }}
        >
          {page}
        </Button>
      ))}
      
      <Button
        design="Transparent"
        icon="navigation-right-arrow"
        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={{ minWidth: '2rem', height: '2rem', padding: '0' }}
      />
    </FlexBox>
  );
};

export default ProveedoresPagination; 