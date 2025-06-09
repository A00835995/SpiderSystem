import React from "react";
import {
  AnalyticalTable,
  Bar,
  BarDesign,
  Label,
  Text,
  Card,
  FlexBox,
  BusyIndicator,
  FlexBoxDirection,
  FlexBoxAlignItems,
} from "@ui5/webcomponents-react";

export default function InventoryTable({ data = [], columns = [], isLoading, totalCount = 0 }) {
  return isLoading ? (
    <FlexBox 
      direction={FlexBoxDirection.Column}
      justifyContent="Center"
      alignItems={FlexBoxAlignItems.Center}
      style={{ padding: "2rem" }}
    >
      <BusyIndicator size="Large" />
      <Text style={{ marginTop: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>
        Cargando datos de inventario...
      </Text>
    </FlexBox>
  ) : (
    <Card style={{ width: "100%" }}>
      <AnalyticalTable
        data={data}
        columns={columns}
        visibleRows={50}
        alternateRowColor
        header={
          <Bar 
            design={BarDesign.Header}
            endContent={
              <Text style={{ 
                fontSize: "0.875rem",
                color: "var(--sapContent_LabelColor)",
                fontWeight: "500"
              }}>
                Mostrando {data.length} de {totalCount} productos
              </Text>
            }
          />
        }
        footer={
          <Bar 
            design={BarDesign.Footer}
            startContent={
              <Text style={{ 
                fontSize: "0.875rem",
                color: "var(--sapContent_LabelColor)",
                fontWeight: "500"
              }}>
                Total de productos: {data.length}
              </Text>
            }
          />
        }
        scaleWidthMode="Smart"
        selectionMode="SingleSelect"
        withRowHighlight
        sortable
        filterable
        groupable
      />
    </Card>
  );
}
