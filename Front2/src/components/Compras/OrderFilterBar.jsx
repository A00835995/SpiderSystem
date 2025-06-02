import React from 'react';
import {
  FlexBox,
  SegmentedButton,
  SegmentedButtonItem,
  Bar,
  Label,
  Icon
} from '@ui5/webcomponents-react';

const OrderFilterBar = ({ selectedFilter, onFilterChange }) => {
  // Función para manejar el cambio de selección
  const handleSelectionChange = (event) => {
    // Extraer el valor del item seleccionado y pasarlo a la función onFilterChange
    const selectedValue = event.detail.selectedItem.getAttribute('data-value');
    onFilterChange({ 
      detail: { 
        selectedOption: { 
          dataset: { 
            value: selectedValue 
          } 
        } 
      } 
    });
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <FlexBox alignItems="Center" style={{ gap: '1rem' }}>
        <Label style={{ fontWeight: 'bold', color: '#333', fontSize: '16px' }}>
          Filtrar por estado:
        </Label>
        <SegmentedButton
          onSelectionChange={handleSelectionChange}
          style={{ 
            borderColor: 'red',
            '--_ui5_segmented_btn_selected_bg': '#fa3207',
            '--_ui5_segmented_btn_selected_text_color': 'white',
          }}
        >
          <SegmentedButtonItem
            data-value="todos"
            selected={selectedFilter === "todos"}
            style={{ fontWeight: 'normal' }}
          >
            Todos
          </SegmentedButtonItem>
          <SegmentedButtonItem
            data-value="en_proceso"
            selected={selectedFilter === "en_proceso"}
            style={{ fontWeight: 'normal' }}
            icon="process"
          >
            En proceso
          </SegmentedButtonItem>
          <SegmentedButtonItem
            data-value="completada"
            selected={selectedFilter === "completada"}
            style={{ fontWeight: 'normal' }}
            icon="complete"
          >
            Completada
          </SegmentedButtonItem>
        </SegmentedButton>
      </FlexBox>

      {/* Estilos CSS para el componente */}
      <style jsx="true">{`
        .ui5-segmented-button-item[selected] {
          background-color: #0854a0;
          color: white;
        }
        .ui5-segmented-button-item:hover:not([selected]) {
          background-color: #f5f5f5;
        }
      `}</style>
    </div>
  );
};

export default OrderFilterBar; 