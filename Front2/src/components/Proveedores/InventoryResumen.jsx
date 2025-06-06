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
    if (stockBajo > 10) return '#ef5350';
    if (stockBajo > 5) return '#ffab00';
    return '#4c9aff';
  };

  if (loading) {
    return (
      <Card 
        style={{ 
          marginTop: '1.5rem',
          backgroundColor: 'var(--sapBackgroundColor)',
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
          <Text style={{ marginLeft: '1rem', color: 'var(--sapTextColor)' }}>
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
          backgroundColor: 'var(--sapBackgroundColor)',
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
          <Text style={{ color: 'var(--sapNegativeTextColor)', fontSize: '1.125rem' }}>
            Error al cargar el resumen de inventario
          </Text>
          <Text style={{ color: 'var(--sapTextColor)', fontSize: '0.875rem' }}>
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
        backgroundColor: 'var(--sapBackgroundColor)',
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
            borderBottom: '1px solid var(--sapContent_ForegroundBorderColor)'
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
            color: 'var(--sapTextColor)', 
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
                    backgroundColor: 'var(--sapBackgroundColor)',
                    border: `1px solid var(--sapContent_ForegroundBorderColor)`,
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
                    
                    <Text style={{ fontSize: '0.875rem', color: 'var(--sapTextColor)', marginBottom: '1rem' }}>
                      Existencia total: {categoria.totalExistencia} unidades
                    </Text>
                  </div>
                  
                  <div>
                    <FlexBox style={{ gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--sapTextColor)',
                          marginBottom: '0.25rem'
                        }}>
                          Proveedores
                        </Text>
                        <FlexBox alignItems="Center" style={{ gap: '0.375rem' }}>
                          <Icon name="supplier" style={{ 
                            color: getColorForType('Success'),
                            fontSize: '1rem'
                          }} />
                          <Text style={{ 
                            fontWeight: '600', 
                            color: getColorForType('Success'),
                            fontSize: '0.875rem'
                          }}>
                            {categoria.numeroProveedores} activos
                          </Text>
                        </FlexBox>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--sapTextColor)',
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
                      marginTop: '1rem', 
                      paddingTop: '1rem', 
                      borderTop: `1px solid var(--sapContent_ForegroundBorderColor)` 
                    }}>
                      <FlexBox style={{ gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                          <Text style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--sapTextColor)',
                            marginBottom: '0.25rem'
                          }}>
                            Valor Costo
                          </Text>
                          <FlexBox alignItems="Center" style={{ gap: '0.375rem' }}>
                            <Icon name="money-bills" style={{ 
                              color: getColorForType('Success'),
                              fontSize: '1rem'
                            }} />
                            <Text style={{ 
                              fontWeight: '600', 
                              fontSize: '0.875rem',
                              color: getColorForType('Success')
                            }}>
                              {formatMoney(categoria.valorInventarioCosto)}
                            </Text>
                          </FlexBox>
                        </div>
                        <div style={{ flex: 1 }}>
                          <Text style={{ 
                            fontSize: '0.75rem', 
                            color: 'var(--sapTextColor)',
                            marginBottom: '0.25rem'
                          }}>
                            Valor Venta
                          </Text>
                          <FlexBox alignItems="Center" style={{ gap: '0.375rem' }}>
                            <Icon name="sales-document" style={{ 
                              color: getColorForType('Information'),
                              fontSize: '1rem'
                            }} />
                            <Text style={{ 
                              fontWeight: '600', 
                              fontSize: '0.875rem',
                              color: getColorForType('Information')
                            }}>
                              {formatMoney(categoria.valorInventarioVenta)}
                            </Text>
                          </FlexBox>
                        </div>
                      </FlexBox>
                    </div>
                  </div>
                </div>
              ))}
            </FlexBox>
          ) : (
            <FlexBox
              justifyContent={FlexBoxJustifyContent.Center}
              alignItems={FlexBoxAlignItems.Center}
              style={{ height: '150px', flexDirection: 'column', gap: '1rem' }}
            >
              <Text style={{ color: 'var(--sapTextColor)', fontSize: '1rem' }}>
                No hay datos de categorías disponibles
              </Text>
            </FlexBox>
          )}
        </div>
      )}
      
      {activeCategory === 1 && (
        <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
          <Title level="H5" style={{ 
            marginBottom: '1rem', 
            color: 'var(--sapTextColor)', 
            fontSize: '1.125rem',
            fontWeight: '600'
          }}>
            Distribución de proveedores por tipo y su participación en el inventario
          </Title>
          
          {distribucionInventario?.data?.length > 0 ? (
            <FlexBox wrap style={{ gap: '1.5rem', alignItems: 'stretch', minWidth: '900px', justifyContent: 'space-between' }}>
              {distribucionInventario.data.map((distribucion, index) => (
                <div 
                  key={`distribucion-${index}`}
                  style={{ 
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'var(--sapBackgroundColor)',
                    border: `1px solid var(--sapContent_ForegroundBorderColor)`,
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
                        {distribucion.tipoProveedor}
                      </Title>
                      <Badge
                        color={index % 4 === 0 ? ValueState.Success : 
                               index % 4 === 1 ? ValueState.Information : 
                               index % 4 === 2 ? ValueState.Warning : ValueState.Error}
                        style={{
                          padding: '0.25rem 0.75rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        <Icon name="supplier" style={{ fontSize: '0.875rem' }} />
                        <span>{distribucion.cantidadProveedores} proveedores</span>
                      </Badge>
                    </FlexBox>
                    
                    <Text style={{ fontSize: '0.875rem', color: 'var(--sapTextColor)', marginBottom: '1rem' }}>
                      Participación en el inventario general
                    </Text>
                  </div>
                  
                  <div>
                    <div style={{ 
                      marginBottom: '1rem',
                      padding: '1rem',
                      borderRadius: '0.25rem',
                      backgroundColor: 'var(--sapBackgroundColor)',
                      border: `1px solid var(--sapContent_ForegroundBorderColor)`
                    }}>
                      <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems="Center" style={{ marginBottom: '0.5rem' }}>
                        <Text style={{ 
                          fontSize: '0.75rem', 
                          color: 'var(--sapTextColor)'
                        }}>
                          Porcentaje de Participación
                        </Text>
                        <Text style={{ 
                          fontWeight: '700',
                          fontSize: '1.25rem',
                          color: getColorForType('Information')
                        }}>
                          {distribucion.porcentajeParticipacion.toFixed(1)}%
                        </Text>
                      </FlexBox>
                      
                      <div style={{
                        width: '100%',
                        height: '8px',
                        backgroundColor: 'var(--sapContent_ForegroundBorderColor)',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{
                          width: `${Math.min(distribucion.porcentajeParticipacion, 100)}%`,
                          height: '100%',
                          backgroundColor: index % 4 === 0 ? getColorForType('Success') : 
                                          index % 4 === 1 ? getColorForType('Information') : 
                                          index % 4 === 2 ? getColorForType('Warning') : 
                                          getColorForType('Error'),
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>
                    
                    <FlexBox alignItems="Center" style={{ gap: '0.5rem' }}>
                      
                      <div>
                        <Text style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600',
                          color: 'var(--sapTextColor)',
                        }}>
                          {distribucion.cantidadProveedores} {distribucion.cantidadProveedores === 1 ? 'proveedor' : 'proveedores'}
                        </Text>
                      </div>
                    </FlexBox>
                  </div>
                </div>
              ))}
            </FlexBox>
          ) : (
            <FlexBox
              justifyContent={FlexBoxJustifyContent.Center}
              alignItems={FlexBoxAlignItems.Center}
              style={{ height: '150px', flexDirection: 'column', gap: '1rem' }}
            >
              <Text style={{ color: 'var(--sapTextColor)', fontSize: '1rem' }}>
                No hay datos de distribución disponibles
              </Text>
            </FlexBox>
          )}
        </div>
      )}
    </Card>
  );
};

export default InventoryResumen; 