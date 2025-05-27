import React from 'react';
import {
  Card,
  Title,
  Text,
  FlexBox,
  FlexBoxJustifyContent,
  Badge,
  ValueState,
  Icon,
  TabContainer,
  Tab as UI5Tab,
  Avatar,
  BusyIndicator,
  FlexBoxAlignItems
} from '@ui5/webcomponents-react';
import { useProveedores } from '../../hooks/useProveedores';

const InventoryResumen = ({ activeCategory, setActiveCategory }) => {
  const { resumenCategorias, distribucionInventario, loading, error } = useProveedores();

  // Función para obtener el color según el tipo
  const getColorForType = (type) => {
    switch (type) {
      case 'Success':
        return '#107e3e';
      case 'Information':
        return '#0a6ed1';
      case 'Warning':
        return '#e9730c';
      case 'Error':
        return '#bb0000';
      default:
        return '#6a6d70';
    }
  };

  // Función para formatear valores monetarios
  const formatMoney = (value) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value || 0);
  };

  // Función para obtener el color del badge según el número de productos
  const getBadgeColorForProducts = (count) => {
    if (count > 100) return ValueState.Success;
    if (count > 50) return ValueState.Information;
    if (count > 20) return ValueState.Warning;
    return ValueState.Error;
  };

  // Función para obtener el color del indicador de stock bajo
  const getStockAlertColor = (stockBajo) => {
    if (stockBajo > 10) return '#bb0000';
    if (stockBajo > 5) return '#e9730c';
    return '#0a6ed1';
  };

  if (loading) {
    return (
      <Card 
        style={{ 
          marginTop: '1.5rem',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
          borderRadius: '0.5rem',
          border: 'none',
          overflow: 'hidden',
          padding: '1.5rem',
          width: '100%',
          marginBottom: '3rem'
        }}
      >
        <FlexBox
          justifyContent={FlexBoxJustifyContent.Center}
          alignItems={FlexBoxAlignItems.Center}
          style={{ height: '200px' }}
        >
          <BusyIndicator active size="Medium" />
          <Text style={{ marginLeft: '1rem', color: 'inherit' }}>
            Cargando resumen de inventario...
          </Text>
        </FlexBox>
      </Card>
    );
  }

  if (error) {
    return (
      <Card 
        style={{ 
          marginTop: '1.5rem',
          backgroundColor: '#ffffff',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
          borderRadius: '0.5rem',
          border: 'none',
          overflow: 'hidden',
          padding: '1.5rem',
          width: '100%',
          marginBottom: '3rem'
        }}
      >
        <FlexBox
          justifyContent={FlexBoxJustifyContent.Center}
          alignItems={FlexBoxAlignItems.Center}
          style={{ height: '200px', flexDirection: 'column', gap: '1rem' }}
        >
          <Text style={{ color: '#d63031', fontSize: '1.125rem' }}>
            Error al cargar el resumen de inventario
          </Text>
          <Text style={{ color: '#6a6d70', fontSize: '0.875rem' }}>
            {error}
          </Text>
        </FlexBox>
      </Card>
    );
  }

  return (
    <Card 
      style={{ 
        marginTop: '1.5rem',
        backgroundColor: '#ffffff',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
        borderRadius: '0.5rem',
        border: 'none',
        overflow: 'hidden',
        padding: '1.5rem',
        width: '100%',
        marginBottom: '3rem'
      }}
    >
      <Title level="H4" style={{ marginBottom: '0.5rem', fontWeight: '600', marginLeft: '2rem', marginTop: '1rem' }}>
        Resumen de Inventario por Proveedor
      </Title>

      <div style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        <TabContainer
          onTabSelect={(e) => setActiveCategory(parseInt(e.detail.tabIndex))}
          selectedIndex={activeCategory}
          style={{ 
            marginBottom: '1.5rem', 
            borderBottom: '1px solid #e0e0e0'
          }}
          fixed
        >
          <UI5Tab
            text="Por Categoría de Producto"
            icon="product"
            semanticColor={activeCategory === 0 ? "Positive" : "Neutral"}
          />
          <UI5Tab
            text="Por Tipo de Proveedor"
            icon="supplier"
            semanticColor={activeCategory === 1 ? "Positive" : "Neutral"}
          />
        </TabContainer>
      </div>

      {activeCategory === 0 && (
        <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
          <Title level="H5" style={{ 
            marginBottom: '1rem', 
            color: '#32363a', 
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Vista general del inventario por categoría de producto
          </Title>
          
          {resumenCategorias?.data?.length > 0 ? (
            <FlexBox wrap style={{ gap: '1.5rem', alignItems: 'stretch', minWidth: '900px', justifyContent: 'space-between' }}>
              {resumenCategorias.data.map((categoria, index) => (
                <div 
                  key={`categoria-${index}`}
                  style={{ 
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    flexGrow: 1,
                    flexBasis: 'calc(50% - 1.5rem)',
                    minWidth: '400px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center" style={{ marginBottom: '1rem' }}>
                      <Title level="H5" style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                        {categoria.nombreCategoria}
                      </Title>
                      <Badge
                        color={getBadgeColorForProducts(categoria.numeroProductos)}
                        style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Icon name="product" style={{ fontSize: '0.875rem' }} />
                        <span>{categoria.numeroProductos} productos</span>
                      </Badge>
                    </FlexBox>
                    
                    <Text style={{ fontSize: '0.875rem', color: '#6a6d70', marginBottom: '1rem' }}>
                      Existencia total: {categoria.totalExistencia} unidades
                    </Text>
                  </div>
                  
                  <div>
                    <FlexBox style={{ gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: '#6a6d70',
                          marginBottom: '0.25rem'
                        }}>
                          Proveedores
                        </Text>
                        <FlexBox alignItems="Center" style={{ gap: '0.375rem' }}>
                          <Icon name="supplier" style={{ 
                            color: '#0854a0',
                            fontSize: '1rem'
                          }} />
                          <Text style={{ 
                            fontWeight: '600', 
                            color: '#0854a0',
                            fontSize: '0.875rem'
                          }}>
                            {categoria.numeroProveedores} activos
                          </Text>
                        </FlexBox>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: '#6a6d70',
                          marginBottom: '0.25rem'
                        }}>
                          Stock Bajo
                        </Text>
                        <FlexBox alignItems="Center" style={{ gap: '0.375rem' }}>
                          <Icon name="alert" style={{ 
                            color: getStockAlertColor(categoria.productosStockBajo),
                            fontSize: '1rem'
                          }} />
                          <Text style={{ 
                            fontWeight: '600',
                            color: getStockAlertColor(categoria.productosStockBajo),
                            fontSize: '0.875rem'
                          }}>
                            {categoria.productosStockBajo} productos
                          </Text>
                        </FlexBox>
                      </div>
                    </FlexBox>
                    
                    <div style={{ 
                      borderTop: '1px solid #e0e0e0',
                      paddingTop: '1rem'
                    }}>
                      <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center">
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: '#6a6d70',
                          fontWeight: '500'
                        }}>
                          Valor Total
                        </Text>
                        <Text style={{ 
                          fontSize: '1rem', 
                          fontWeight: '700',
                          color: '#107e3e',
                          textAlign: 'right'
                        }}>
                          {formatMoney(categoria.valorTotal)}
                        </Text>
                      </FlexBox>
                      <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center" style={{ marginTop: '0.5rem' }}>
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: '#6a6d70',
                          fontWeight: '500'
                        }}>
                          Promedio por Producto
                        </Text>
                        <Text style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          color: '#0854a0',
                          textAlign: 'right'
                        }}>
                          {formatMoney(categoria.valorTotal / categoria.numeroProductos)}
                        </Text>
                      </FlexBox>
                    </div>
                  </div>
                </div>
              ))}
            </FlexBox>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Icon name="product" style={{ fontSize: '3rem', color: '#6a6d70', marginBottom: '1rem' }} />
              <Text style={{ color: '#6a6d70', fontSize: '1rem' }}>
                No hay datos de categorías disponibles
              </Text>
            </div>
          )}
        </div>
      )}

      {activeCategory === 1 && (
        <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
          <Title level="H5" style={{ 
            marginBottom: '1rem', 
            color: '#32363a', 
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Distribución del inventario por tipo de proveedor
          </Title>
          
          {distribucionInventario?.data?.length > 0 ? (
            <FlexBox wrap style={{ gap: '1.5rem', alignItems: 'stretch', minWidth: '900px', justifyContent: 'space-between' }}>
              {distribucionInventario.data.map((tipo, index) => (
                <div 
                  key={`tipo-${index}`}
                  style={{ 
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    flexGrow: 1,
                    flexBasis: 'calc(33.333% - 1rem)',
                    minWidth: '280px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center" style={{ marginBottom: '1rem' }}>
                      <Title level="H5" style={{ margin: 0, fontSize: '1rem', fontWeight: '600' }}>
                        {tipo.tipoProveedor}
                      </Title>
                      <Avatar
                        icon="supplier"
                        size="S"
                        style={{
                          backgroundColor: '#f8f9fa',
                          border: '1px solid #e9ecef'
                        }}
                      />
                    </FlexBox>
                    
                    <Text style={{ fontSize: '0.875rem', color: '#6a6d70', marginBottom: '1rem' }}>
                      {tipo.numeroProveedores} proveedores activos
                    </Text>
                  </div>
                  
                  <div>
                    <div style={{ 
                      padding: '1rem',
                      borderRadius: '0.375rem',
                      backgroundColor: '#f8f9fa',
                      border: '1px solid #e9ecef'
                    }}>
                      <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center" style={{ marginBottom: '0.5rem' }}>
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: '#6a6d70'
                        }}>
                          Total Productos
                        </Text>
                        <Text style={{ 
                          fontSize: '1rem', 
                          fontWeight: '700',
                          color: '#0854a0'
                        }}>
                          {tipo.totalProductos}
                        </Text>
                      </FlexBox>
                      
                      <div style={{ 
                        height: '0.25rem',
                        backgroundColor: '#e9ecef',
                        borderRadius: '0.125rem',
                        overflow: 'hidden',
                        marginBottom: '0.5rem'
                      }}>
                        <div style={{
                          height: '100%',
                          width: `${Math.min((tipo.totalProductos / Math.max(...distribucionInventario.data.map(d => d.totalProductos))) * 100, 100)}%`,
                          backgroundColor: index % 4 === 0 ? '#107e3e' :
                                         index % 4 === 1 ? '#0854a0' :
                                         index % 4 === 2 ? '#e9730c' :
                                         '#bb0000',
                          borderRadius: '0.125rem',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                      
                      <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center">
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: '#32363a',
                          fontWeight: '500'
                        }}>
                          Valor Total
                        </Text>
                        <Text style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          color: '#107e3e'
                        }}>
                          {formatMoney(tipo.valorTotal)}
                        </Text>
                      </FlexBox>
                    </div>
                  </div>
                </div>
              ))}
            </FlexBox>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <Icon name="supplier" style={{ fontSize: '3rem', color: '#6a6d70', marginBottom: '1rem' }} />
              <Text style={{ color: '#6a6d70', fontSize: '1rem' }}>
                No hay datos de distribución disponibles
              </Text>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default InventoryResumen; 