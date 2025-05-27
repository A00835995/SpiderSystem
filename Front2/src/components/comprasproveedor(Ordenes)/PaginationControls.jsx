import React from 'react';
import { Button, Select, Option, Text } from '@ui5/webcomponents-react';

const PaginationControls = ({ 
  currentPage, 
  totalPages, 
  itemsPerPage, 
  totalItems,
  indexOfFirstItem,
  indexOfLastItem,
  onPageChange, 
  onItemsPerPageChange 
}) => {
  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
      // Hacer scroll al inicio de la tabla
      document.querySelector('.analyticalTable')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (totalItems === 0) return null;

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      margin: '1.5rem 0',
      padding: '1rem 0',
      borderTop: '1px solid #e5e5e5'
    }}>
      {/* Selector de elementos por página */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <Text>Elementos por página:</Text>
        <Select
          onChange={(e) => {
            onItemsPerPageChange(parseInt(e.detail.selectedOption.dataset.value));
          }}
          style={{ width: '80px' }}
        >
          <Option data-value="5" selected={itemsPerPage === 5}>5</Option>
          <Option data-value="10" selected={itemsPerPage === 10}>10</Option>
          <Option data-value="15" selected={itemsPerPage === 15}>15</Option>
        </Select>
      </div>
      
      {/* Controles de navegación */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: '0.5rem'
      }}>
        <Button 
          icon="nav-back" 
          design="Transparent"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          ariaLabel="Página anterior"
          style={{ minWidth: '36px', height: '36px', padding: '0' }}
        />
        
        {/* Mostrar números de página */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(number => 
            number === 1 || 
            number === totalPages || 
            (number >= currentPage - 1 && number <= currentPage + 1)
          )
          .map((number, index, array) => (
            <React.Fragment key={number}>
              {/* Mostrar puntos suspensivos si hay saltos en la secuencia */}
              {index > 0 && array[index - 1] !== number - 1 && (
                <span style={{ margin: '0 4px' }}>...</span>
              )}
              <Button 
                design={number === currentPage ? "Emphasized" : "Default"}
                onClick={() => paginate(number)}
                style={{
                  minWidth: '36px',
                  height: '36px',
                  padding: '0',
                  borderRadius: '4px',
                  ...(number === currentPage 
                    ? { backgroundColor: '#0854a0', color: 'white' } 
                    : {})
                }}
              >
                {number}
              </Button>
            </React.Fragment>
          ))
        }
        
        <Button 
          icon="nav-forward" 
          design="Transparent"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          ariaLabel="Página siguiente"
          style={{ minWidth: '36px', height: '36px', padding: '0' }}
        />
      </div>
      
      {/* Información de paginación */}
      <div style={{ color: '#666', fontSize: '0.875rem' }}>
        {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, totalItems)} de {totalItems}
      </div>
    </div>
  );
};

export default PaginationControls; 