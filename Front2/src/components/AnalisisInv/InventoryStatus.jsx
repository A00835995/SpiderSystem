import React from "react";
import { Card, CardHeader, Text, Icon, ObjectStatus } from "@ui5/webcomponents-react";
import { styles } from "../../Styles/InicioStyle";

export default function InventoryStatus({ inventoryStatus }) {
  const total = inventoryStatus.inStock + inventoryStatus.lowStock + inventoryStatus.outOfStock;
  const attentionPercentage = (((inventoryStatus.lowStock + inventoryStatus.outOfStock) / total) * 100).toFixed(1);

  return (
    <Card
      style={styles.categoryCard}
      header={
        <CardHeader
          titleText="Estado del Inventario"
          subtitleText="Distribución por estado"
          avatar={<Icon name="status-completed" />}
        />
      }
    >
      <div style={{ padding: "1rem" }}>
        <div style={{
          height: "24px",
          display: "flex",
          borderRadius: "12px",
          overflow: "hidden",
          marginBottom: "1rem"
        }}>
          <div style={{ 
            width: `${(inventoryStatus.inStock / total) * 100}%`, 
            backgroundColor: "var(--sapPositiveColor)" 
          }} />
          <div style={{ 
            width: `${(inventoryStatus.lowStock / total) * 100}%`, 
            backgroundColor: "var(--sapWarningColor)" 
          }} />
          <div style={{ 
            width: `${(inventoryStatus.outOfStock / total) * 100}%`, 
            backgroundColor: "var(--sapNegativeColor)" 
          }} />
        </div>

        <div style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.875rem"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <ObjectStatus state="Success">
              En Stock: {inventoryStatus.inStock}
            </ObjectStatus>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <ObjectStatus state="Warning">
              Stock Bajo: {inventoryStatus.lowStock}
            </ObjectStatus>
          </div>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <ObjectStatus state="Error">
              Agotado: {inventoryStatus.outOfStock}
            </ObjectStatus>
          </div>
        </div>

        <Text
          style={{
            color: "var(--sapInformativeColor)",
            fontSize: "0.875rem",
            marginTop: "1rem"
          }}
        >
          El {attentionPercentage}% de productos requieren atención en el inventario.
        </Text>
      </div>
    </Card>
  );
} 