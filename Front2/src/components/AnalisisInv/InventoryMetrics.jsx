import React from "react";
import { Card, CardHeader, Text, Icon } from "@ui5/webcomponents-react";
import { styles } from "../../Styles/InicioStyle";

export default function InventoryMetrics({ categoryMetrics }) {
  return (
    <Card
      style={styles.ordersCard}
      header={
        <CardHeader
          titleText="Métricas por Categoría"
          subtitleText="Rendimiento por categoría"
          avatar={<Icon name="table-view" />}
        />
      }
    >
      <div style={{ padding: "0.5rem" }}>
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.875rem"
        }}>
          <thead>
            <tr style={{
              borderBottom: "1px solid var(--sapList_BorderColor)",
              color: "var(--sapContent_LabelColor)"
            }}>
              <th style={{ 
                padding: "1rem",
                textAlign: "left",
                fontWeight: "normal"
              }}>Categoría</th>
              <th style={{ 
                padding: "1rem",
                textAlign: "left",
                fontWeight: "normal"
              }}>Ventas</th>
              <th style={{ 
                padding: "1rem",
                textAlign: "left",
                fontWeight: "normal"
              }}>% Devoluciones</th>
              <th style={{ 
                padding: "1rem",
                textAlign: "left",
                fontWeight: "normal"
              }}>Rotación</th>
              <th style={{ 
                padding: "1rem",
                textAlign: "left",
                fontWeight: "normal"
              }}>Beneficio</th>
              <th style={{ 
                padding: "1rem",
                textAlign: "left",
                fontWeight: "normal"
              }}>Tendencia</th>
            </tr>
          </thead>
          <tbody>
            {categoryMetrics.map((metric, index) => (
              <tr key={index} style={{
                borderBottom: "1px solid var(--sapList_BorderColor)",
                backgroundColor: index % 2 === 0 ? "var(--sapList_Background)" : "transparent"
              }}>
                <td style={{ padding: "1rem" }}>{metric.category}</td>
                <td style={{ padding: "1rem" }}>{metric.sales} unidades</td>
                <td style={{ padding: "1rem" }}>{metric.returnsRate}%</td>
                <td style={{ padding: "1rem" }}>{metric.turnoverRate}</td>
                <td style={{ padding: "1rem" }}>${metric.profit.toLocaleString()}</td>
                <td style={{ padding: "1rem" }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.25rem",
                    color: metric.trend >= 0 ? "var(--sapPositiveColor)" : "var(--sapNegativeColor)"
                  }}>
                    <Icon 
                      name={metric.trend >= 0 ? "trend-up" : "trend-down"} 
                      style={{
                        width: "1rem",
                        height: "1rem"
                      }}
                    />
                    {metric.trend >= 0 ? "+" : ""}{metric.trend}%
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
} 