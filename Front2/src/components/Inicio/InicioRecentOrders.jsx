import React, { useEffect, useState } from "react";
import { Card, CardHeader, AnalyticalTable, Icon } from "@ui5/webcomponents-react";
import { fetchOrdenesRecientes } from "../../services/InicioService";
import { styles } from "../../Styles/InicioStyle"; // Ajusta la ruta si es necesario

export default function InicioRecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrdenesRecientes().then(setOrders);
  }, []);

  return (
    <Card
      style={styles.ordersCard}
      header={
        <CardHeader
          titleText="Órdenes Recientes"
          subtitleText="Últimas órdenes registradas"
          avatar={<Icon name="sales-order" />}
        />
      }
    >
      <AnalyticalTable
        data={orders}
        columns={[
          {
            Header: "Orden #",
            accessor: row => `OD-${String(row.numeroOrden).padStart(2, '0')}-${String(row.numeroProveedor).padStart(2, '0')}`,
            id: "ordenCombinada",
            width: 120
          },
          {
            Header: "Fecha",
            accessor: "fecha",
            width: 100
          },
          {
            Header: "Cantidad",
            accessor: "cantidad",
            width: 100
          },
          {
            Header: "Productos",
            accessor: "productos"
          },
          {
            Header: "Estado",
            accessor: "estado",
            Cell: ({ value }) => {
              const getStatusStyle = (status) => {
                switch (status) {
                  case "Pendiente":
                    return styles.pendiente;
                  case "En proceso":
                    return styles.enProceso;
                  case "Completada":
                    return styles.completada;
                  case "En tránsito":
                    return styles.enTransito;
                  default:
                    return {};
                }
              };
              return (
                <span style={{ ...styles.statusBadge, ...getStatusStyle(value) }}>
                  {value}
                </span>
              );
            }
          },
          {
            Header: "Total",
            accessor: "total",
            Cell: ({ value }) => (
              <span>
                $ {value}
              </span>
            )
          }
        ]}
        visibleRows={4}
        minRows={4}
        alternateRowColor
        scaleWidthMode="Smart"
        selectionMode="None"
      />
    </Card>
  );
}