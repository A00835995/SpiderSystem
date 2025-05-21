import React from "react";
import { Card, CardHeader } from "@ui5/webcomponents-react";
import { LineChart, BarChart } from "@ui5/webcomponents-react-charts";

export default function PredictiveChart({ chartType, chartData }) {
  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardHeader titleText={`Tendencia de Ventas y Predicción ${chartType === "line" ? "Lineal" : "Comparativa"}`} />
      <div style={{ height: "400px", padding: "1rem" }}>
        {chartType === "line" ? (
          <LineChart 
            dataset={chartData}
            dimensions={[{ accessor: "mes" }]}
            measures={[
              { 
                accessor: "ventas", 
                label: "Ventas Reales",
                color: "#0070F2"
              },
              { 
                accessor: "prediccion", 
                label: "Predicción",
                color: "#16B9D4",
                type: "dashed"
              }
            ]}
            chartConfig={{
              legendPosition: "top",
              legendHorizontalAlign: "left",
              paddingTop: 50,
              zoomingTool: false
            }}
          />
        ) : (
          <BarChart 
            dataset={chartData}
            dimensions={[{ accessor: "mes" }]}
            measures={[
              { 
                accessor: "ventas", 
                label: "Ventas Reales",
                color: "#0070F2"
              },
              { 
                accessor: "prediccion", 
                label: "Predicción",
                color: "#16B9D4"
              }
            ]}
            chartConfig={{
              legendPosition: "top",
              legendHorizontalAlign: "left",
              paddingTop: 50,
              zoomingTool: false
            }}
          />
        )}
      </div>
    </Card>
  );
} 