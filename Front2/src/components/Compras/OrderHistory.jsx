import React from 'react';
import {
  Title,
  Text,
  Button,
  Icon,
  AnalyticalTable
} from '@ui5/webcomponents-react';

const OrderHistory = ({ orderHistory, onClose }) => {
  return (
    <div style={{ 
      padding: '2rem',
      backgroundColor: 'var(--sapList_Background)',
      borderRadius: '0.5rem',
      boxShadow: 'var(--sapContent_Shadow0)',
      margin: '0 2rem 2rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <Title level="H1">Historial de Pedidos</Title>
        <Button 
          icon="decline"
          design="Transparent"
          onClick={onClose}
        >
          Cerrar
        </Button>
      </div>

      {orderHistory.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'var(--sapContent_LabelColor)'
        }}>
          <Icon 
            name="document"
            style={{
              fontSize: '3rem',
              marginBottom: '1rem',
              color: 'var(--sapContent_NonInteractiveIconColor)'
            }}
          />
          <Text>No hay pedidos en el historial</Text>
        </div>
      ) : (
        <AnalyticalTable
          data={orderHistory}
          columns={[
            {
              Header: "Orden #",
              accessor: "id",
              width: 120
            },
            {
              Header: "Fecha",
              accessor: "date",
              Cell: ({ value }) => new Date(value).toLocaleDateString()
            },
            {
              Header: "Proveedor",
              accessor: "provider"
            },
            {
              Header: "Productos",
              accessor: "products",
              Cell: ({ value }) => value.map(p => `${p.name} (${p.quantity})`).join(', ')
            },
            {
              Header: "Total",
              accessor: "total",
              Cell: ({ value }) => `$${value.toFixed(2)}`,
              width: 120
            },
            {
              Header: "Estado",
              accessor: "status",
              width: 120
            }
          ]}
          alternateRowColor
          visibleRows={5}
        />
      )}
    </div>
  );
};

export default OrderHistory;