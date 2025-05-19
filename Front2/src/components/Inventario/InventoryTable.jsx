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
      <Text style={{ marginTop: "1rem" }}>Cargando datos de inventario...</Text>
    </FlexBox>
  ) : (
    <Card>
      <AnalyticalTable
        data={data}
        columns={columns}
        visibleRows={10}
        alternateRowColor
        header={
          <Bar 
            design={BarDesign.Header}
            endContent={
              <Label>Mostrando {data.length} de {totalCount} productos</Label>
            }
          />
        }
        footer={
          <Bar 
            design={BarDesign.Footer}
            startContent={
              <Text>Total de productos: {data.length}</Text>
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
