import React from 'react';
import {
  Card,
  Text,
  Button,
  FlexBox,
  FlexBoxDirection,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  Icon,
  ObjectStatus,
  ValueState,
  AnalyticalTable,
  AnalyticalTableScaleWidthMode,
  IllustratedMessage,
  Badge,
  Bar,
  IllustrationMessageType,
  TableSelectionMode
} from '@ui5/webcomponents-react';

const ProveedoresTable = ({ 
  paginatedProveedores, 
  itemsPerPage, 
  onViewDetails, 
  proveedores,
  onAddProveedor
}) => {
  const getBadgeColorByProductCount = (count) => {
    if (count > 30) return ValueState.Success;
    if (count > 20) return ValueState.Warning;
    return ValueState.Information;
  };

  const getTipoValueState = (tipo) => {
    if (!tipo || typeof tipo !== 'string') return ValueState.None;
    
    switch (tipo.toLowerCase()) {
      case "fabricante": return ValueState.Success;
      case "distribuidor": return ValueState.Information;
      case "importador": return ValueState.Warning;
      default: return ValueState.Error;
    }
  };

  // Definir las columnas para la tabla analítica
  const columns = [
    {
      Header: "Proveedor",
      accessor: "nombreProveedor",
      width: 275,
      disableResizing: true,
      disableSortBy: true,
      disableFilters: true,
      Cell: ({ row }) => (
        <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '0.75rem 0' }}>
          <Text style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
            {row.original.nombreProveedor || 'N/A'}
          </Text>
          <FlexBox alignItems={FlexBoxAlignItems.Center}>
            <Icon name="calendar" style={{ fontSize: '0.75rem', marginRight: '0.375rem', color: '#0854a0' }} />
            <Text style={{ fontSize: '0.75rem', color: '#6a6d70' }}>
              Último pedido: {row.original.ultimoPedido || 'N/A'}
            </Text>
          </FlexBox>
        </FlexBox>
      )
    },
    {
      Header: "Contacto",
      accessor: "nombreContacto",
      width: 190,
      disableResizing: true,
      disableSortBy: true,
      disableFilters: true,
      Cell: ({ value, row }) => (
        <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '0.75rem 0' }}>
          <Text style={{ fontWeight: '600', fontSize: '0.875rem', marginBottom: '0.375rem' }}>
            {value || 'N/A'}
          </Text>
          <FlexBox alignItems={FlexBoxAlignItems.Center}>
            <Icon name="phone" style={{ fontSize: '0.75rem', marginRight: '0.375rem', color: '#0854a0' }} />
            <Text style={{ fontSize: '0.75rem', color: '#6a6d70' }}>
              {row.original.telefono || 'N/A'}
            </Text>
          </FlexBox>
        </FlexBox>
      )
    },
    {
      Header: "Email",
      accessor: "email",
      width: 230,
      disableResizing: true,
      disableSortBy: true,
      disableFilters: true,
      Cell: ({ value }) => (
        <FlexBox direction={FlexBoxDirection.Column} style={{ padding: '0.75rem 0' }}>
          <FlexBox alignItems={FlexBoxAlignItems.Start}>
            <Icon name="email" style={{ fontSize: '0.75rem', marginRight: '0.375rem', marginTop: '0.125rem', color: '#0854a0' }} />
            <Text style={{ fontSize: '0.75rem', color: '#32363a' }}>
              {value || 'N/A'}
            </Text>
          </FlexBox>
        </FlexBox>
      )
    },
    {
      Header: "Productos",
      accessor: "numeroProductos",
      width: 125,
      disableResizing: true,
      disableSortBy: true,
      disableFilters: true,
      Cell: ({ value }) => (
        <FlexBox alignItems={FlexBoxAlignItems.Center} justifyContent={FlexBoxJustifyContent.Center} style={{ padding: '0.75rem 0' }}>
          <Badge
            color={getBadgeColorByProductCount(value || 0)}
            style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}
          >
              {value || 0}
          </Badge>
        </FlexBox>
      )
    },
    {
      Header: "Tipo",
      accessor: "tipoProveedor",
      width: 150,
      disableResizing: true,
      disableSortBy: true,
      disableFilters: true,
      Cell: ({ value }) => {
        const tipoDisplayed = value && typeof value === 'string' 
          ? value.charAt(0).toUpperCase() + value.slice(1) 
          : 'No especificado';
        
        return (
          <FlexBox alignItems={FlexBoxAlignItems.Center} justifyContent={FlexBoxJustifyContent.Center} style={{ padding: '0.75rem 0' }}>
            <ObjectStatus
              state={getTipoValueState(value)}
              style={{ fontSize: '0.8125rem' }}
            >
              {tipoDisplayed}
            </ObjectStatus>
          </FlexBox>
        );
      }
    },
    {
      Header: "Acciones",
      accessor: "idProveedor",
      width: 150,
      disableResizing: true,
      disableFilters: true,
      disableSortBy: true,
      Cell: ({ row }) => (
        <FlexBox justifyContent={FlexBoxJustifyContent.Center} alignItems={FlexBoxAlignItems.Center} style={{ padding: '0.75rem 0' }}>
          <Button 
            design="Emphasized"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              fontSize: '0.75rem',
              height: '2.25rem',
              padding: '0 0.75rem'
            }}
            onClick={() => onViewDetails(row.original)}
          >
            <Icon name="detail-view" />
            Ver detalles
          </Button>
        </FlexBox>
      )
    }
  ];

  const renderTableTitle = () => (
    <div style={{ marginBottom: '1rem' }}>
      <Bar
        design="Header"
        startContent={
          <Text level="H4" style={{ margin: '0', fontSize: '1.125rem', fontWeight: '600' }}>
            Proveedores de Super Shoes
          </Text>
        }
        endContent={
          <Button 
            design="Emphasized"
            onClick={onAddProveedor}
            style={{ 
              height: '1.75rem',
              padding: '0 0.625rem',
              backgroundColor: '#0854a0',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              fontSize: '0.75rem',
              fontWeight: '400',
              border: 'none',
              borderRadius: '0.25rem'
            }}
          >
            Agregar Proveedor
          </Button>
        }
        style={{
          padding: '0.75rem 0',
          backgroundColor: 'transparent',
          height: 'auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: 'none',
          boxShadow: 'none'
        }}
      />
    </div>
  );

  return (
    <Card 
      style={{ 
        marginTop: '1rem',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        borderRadius: '0.5rem',
        border: 'none',
        width: '100%',
        overflowX: 'auto',
        overflowY: 'hidden'
      }}
    >
      {renderTableTitle()}
      
      {proveedores.length === 0 ? (
        <FlexBox
          justifyContent={FlexBoxJustifyContent.Center}
          alignItems={FlexBoxAlignItems.Center}
          style={{ padding: '3rem 0' }}
        >
          <IllustratedMessage
            name={IllustrationMessageType.SearchEarth}
            titleText="No se encontraron proveedores"
            subtitleText="Intenta con otra búsqueda o agrega un nuevo proveedor"
            style={{ maxWidth: '400px' }}
          />
        </FlexBox>
      ) : (
        <div style={{ 
          padding: '0.75rem', 
          overflowX: 'auto',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
          borderRadius: '0.5rem',
          border: '1px solid #e0e0e0',
        }}>
          <AnalyticalTable
            data={paginatedProveedores}
            columns={columns}
            visibleRows={itemsPerPage}
            minRows={4}
            scaleWidthMode={AnalyticalTableScaleWidthMode.Smart}
            selectionMode={TableSelectionMode.None}
            withRowHighlight
            tableHooks={[]}
            noDataText="No se encontraron proveedores"
            style={{
              width: '100%',
              borderCollapse: 'separate',
              borderSpacing: 0,
              fontSize: '0.875rem',
              '--_ui5_tc_header_row_outline_width': '0',
              '--_ui5_tc_row_outline_width': '0',
              tableLayout: 'fixed',
              '--_ui5_tc_cell_padding': '0.5rem 0.75rem',
              '--sapUiContentDisabledTextColor': '#32363a',
              '--sapContent_GridSize': '0.25rem',
              '--sapUiTableRowHeight': 'auto',
              '--sapUiTableRowHdrHeight': '3rem',
              '--_ui5_tc_cell_vertical_align': 'top',
              '--sapList_HeaderBorderColor': '#e0e0e0',
              '--sapList_BorderColor': '#e8e8e8',
              '--_ui5_tc_row_hover_outline_color': 'transparent',
              '--_ui5_analytical_table_header_cell_vertical_align': 'bottom',
              '--sapUiListHeaderBorderWidth': '0',
              '--sapUiFieldBorderWidth': '0',
              '--sapUiListTableFixedColumnWidth': 'auto',
              '--sapUiBaseBG': '#ffffff',
              '--sapUiListHeaderBackground': '#fafafa',
              '--sapUiListSelectionBackgroundColor': '#f0f7fd',
              '--_ui5_tc_row_outline_color': 'transparent',
              '--_ui5_tc_cell_outline_width': '0',
              '--_ui5_tc_header_cell_default_border_color': '#e5e5e5',
              '--_ui5_tc_headerBorderWidth': '0 0 1px 0',
              '--_ui5_analytical_table_header_box_shadow': 'none',
              '--sapGroup_TitleBackground': '#f5f5f5',
              '--_ui5_analytical_table_header_background_color': '#f5f5f5',
              '--_ui5_tc_row_height': 'auto',
              '--_ui5_tc_header_row_height': '2.75rem',
              '--_ui5_tc_row_highlight_display': 'none',
              '--sapUiElementLineHeight': '1.4',
              '--sapUiListTableHeaderFontSize': '0.8125rem',
              '--sapUiTextDisabled': '#666',
              '--_ui5_tc_padding': '0',
              '--_ui5_tc_header_cell_padding': '0.75rem 1rem',
            }}
            resizable={false}
            sortable={false}
            filterable={false}
            fixedLayout={false}
            alternateRowColor
            wrap="true"
            alwaysShowColHeaders
            rowHeight={80}
            headerRowHeight={45}
            highlightField="tipo"
          />
        </div>
      )}
    </Card>
  );
};

export default ProveedoresTable; 