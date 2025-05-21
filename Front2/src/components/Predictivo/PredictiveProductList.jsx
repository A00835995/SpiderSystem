import React from "react";
import { Card, CardHeader, List, StandardListItem, Icon, ValueState } from "@ui5/webcomponents-react";

export default function PredictiveProductList({ products, onProductSelect }) {
  return (
    <Card>
      <CardHeader 
        titleText="Productos con Potencial de Pérdidas" 
        subtitle="Seleccione un producto para un análisis detallado" 
        avatar={<Icon name="alert" />}
      />
      <div style={{ maxHeight: "400px", overflow: "auto" }}>
        <List>
          {products.sort((a, b) => b.perdidas - a.perdidas).map((producto, index) => (
            <StandardListItem
              key={index}
              info={`${producto.perdidas} unidades`}
              infoState={producto.perdidas > 10 ? ValueState.Error : producto.perdidas > 5 ? ValueState.Warning : ValueState.Success}
              description={`Ventas: ${producto.ventas} | Predicción: ${producto.prediccion}`}
              icon={producto.perdidas > 10 ? "status-critical" : "cart"}
              onClick={() => onProductSelect(producto)}
            >
              {producto.articulo}
            </StandardListItem>
          ))}
        </List>
      </div>
    </Card>
  );
} 