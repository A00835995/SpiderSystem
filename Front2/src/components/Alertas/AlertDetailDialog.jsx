import React from "react";
import {
  Dialog,
  Bar,
  BarDesign,
  FlexBox,
  FlexBoxDirection,
  MessageStrip,
  Title,
  Text,
  Button
} from "@ui5/webcomponents-react";
import { styles } from "../../Styles/AlertasStyle";

export default function AlertDetailDialog({ 
  alert, 
  isOpen, 
  onClose, 
  getValueState 
}) {
  if (!alert) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    
    try {
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return "Fecha no válida";
      }
      
      // Check if it's near the epoch (likely an error)
      if (date.getFullYear() < 2000) {
        return "No disponible";
      }
      
      return date.toLocaleString();
    } catch (error) {
      console.error("Error al formatear la fecha:", error);
      return "Error de formato";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onAfterClose={onClose}
      headerText={alert.title}
      className="alert-detail-dialog"
      style={{ width: "600px" }}
      footer={
        <Bar 
          design={BarDesign.Footer}
          endContent={
            <FlexBox>
              <Button onClick={onClose}>
                Cerrar
              </Button>
            </FlexBox>
          }
        />
      }
    >
      <FlexBox direction={FlexBoxDirection.Column} style={{ padding: "1rem" }}>
        <MessageStrip
          design={getValueState(alert.type)}
          icon={alert.type === "error" ? "error" : alert.type === "warning" ? "warning" : "sys-enter-2"}
          style={{ 
            marginBottom: "1rem",
            ...styles[`statusBadge${alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}`]
          }}
          hideCloseButton
        >
          {alert.status}
        </MessageStrip>
        
        <Title level="H5" style={{ marginBottom: "0.5rem" }}>Detalles</Title>
        <Text style={{ marginBottom: "1rem" }}>{alert.details}</Text>
        
        <FlexBox direction={FlexBoxDirection.Column} style={{ marginBottom: "1rem" }}>
          <Text style={{ marginBottom: "0.5rem" }}>
            <strong>Categoría:</strong> {alert.category === "stock" ? "Inventario" : 
                                    alert.category === "demand" ? "Demanda" : 
                                    alert.category === "shipping" ? "Envíos" : 
                                    "Otro"}
          </Text>
          <Text style={{ marginBottom: "0.5rem" }}>
            <strong>Fecha de alerta:</strong> {formatDate(alert.timestamp)}
          </Text>
          {alert.isResolved && (
            <Text style={{ marginBottom: "0.5rem" }}>
              <strong>Fecha de resolución:</strong> {formatDate(alert.resolvedAt)}
            </Text>
          )}
        </FlexBox>
      </FlexBox>
    </Dialog>
  );
} 