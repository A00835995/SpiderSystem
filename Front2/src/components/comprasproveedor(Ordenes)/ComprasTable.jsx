import React from 'react';
import { 
  AnalyticalTable, 
  Badge, 
  Button, 
  FlexBox, 
  IllustratedMessage, 
  IllustrationMessageType 
} from '@ui5/webcomponents-react';

const ComprasTable = ({ 
  data, 
  itemsPerPage, 
  onViewDetails, 
  onConfirmCompra
}) => {
  // Obtener texto del estado
  const getStatusText = (estado) => {
    switch(estado) {
      case 'pendiente': return 'Pendiente';
      case 'en_proceso': return 'En proceso';
      case 'en_transito': return 'En tránsito';
      case 'confirmada': return 'Confirmada';
      case 'completada': return 'Completada';
      case 'rechazada': return 'Rechazada';
      case 'cancelada': return 'Cancelada';
      default: return 'Pendiente';
    }
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-MX', options);
  };

  // Definir las columnas para la tabla analítica
  const columns = [
    {
      Header: "Número de Orden",
      accessor: "id",
      width: 150
    },
    {
      Header: "Fecha de Pedido",
      accessor: "fecha",
      width: 150,
      Cell: ({ value }) => formatDate(value)
    },
    {
      Header: "Estado",
      accessor: "estado",
      width: 150,
      Cell: ({ value }) => {
        const estado = value || 'pendiente';
        let backgroundColor;
        let textColor = 'white';
        
        switch(estado) {
          case 'pendiente':
            backgroundColor = '#e9730c';
            break;
          case 'en_proceso':
            backgroundColor = '#0a6ed1';
            break;
          case 'en_transito':
            backgroundColor = '#0a6ed1';
            break;
          case 'completada':
          case 'confirmada':
            backgroundColor = '#107e3e';
            break;
          default:
            backgroundColor = '#e9730c';
        }
        
        return (
          <div style={{
            backgroundColor: backgroundColor,
            color: textColor,
            padding: '4px 8px',
            borderRadius: '4px',
            display: 'inline-block',
            fontWeight: 'bold',
            fontSize: '0.875rem',
            textAlign: 'center'
          }}>
            {getStatusText(estado)}
          </div>
        );
      }
    },
    {
      Header: "Fecha Límite",
      accessor: "fechaLimite",
      width: 150,
      Cell: ({ value }) => formatDate(value)
    },
    {
      Header: "Dirección de Entrega",
      accessor: "direccionEntrega",
      width: 300
    },
    {
      Header: "Acciones",
      accessor: "actions",
      width: 300,
      Cell: ({ row }) => (
        <FlexBox style={{ gap: '0.5rem' }}>
          <Button 
            design="Emphasized"
            icon="detail-view"
            onClick={() => onViewDetails(row.original)}
            style={{ backgroundColor: '#0854a0', color: 'white' }}
          >
            Ver Detalle
          </Button>
          {row.original.estado === 'pendiente' && (
            <>
              <Button 
                design="Emphasized"
                icon="accept"
                onClick={() => onConfirmCompra(row.original)}
                style={{ backgroundColor: '#0a6ed1', color: 'white' }}
              >
                Aceptar
              </Button>
            </>
          )}
        </FlexBox>
      )
    }
  ];

  return (
    <div style={{ 
      borderRadius: '4px',
      overflow: 'hidden',
      boxShadow: '0 1px 4px rgba(0, 0, 0, 0.05)'
    }}>
      <AnalyticalTable
        data={data}
        columns={columns}
        visibleRows={itemsPerPage}
        minRows={itemsPerPage}
        scaleWidthMode="Grow"
        alternateRowColor
        header={<div style={{ height: '0.5rem' }}></div>}
        noDataText={
          <IllustratedMessage
            name={IllustrationMessageType.SearchEarth}
            titleText="No se encontraron compras"
            subtitleText="Intenta cambiar tus criterios de búsqueda"
            style={{ margin: '2rem 0' }}
          />
        }
      />
    </div>
  );
};

export default ComprasTable; 