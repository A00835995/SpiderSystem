import React, { useState, useEffect } from "react";
import { useAnalisisInv } from '../hooks/useAnalisisInv';
import InventoryTable from "../components/Inventario/InventoryTable";
import InventoryHeader from "../components/Inventario/InventoryHeader";
import { downloadCSV } from "../utils/csvUtils";

import {
  Text,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  FlexBoxWrap,
  FlexBoxDirection,
  Icon,
  Button,
  MessageStrip,
  Toast,
  BusyIndicator,
  Input
} from "@ui5/webcomponents-react";
import { styles } from "../Styles/InventarioStyles";

// Importar íconos necesarios
import "@ui5/webcomponents-icons/dist/inventory.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/download.js";
import "@ui5/webcomponents-icons/dist/refresh.js";
import "@ui5/webcomponents-icons/dist/synchronize.js";

function getNextMonthLabel() {
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 2; // +2 porque getMonth() es 0-based y queremos el siguiente mes

  if (month > 12) {
    month = 1;
    year += 1;
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return `${monthNames[month - 1]} ${year}`;
}

function getCurrentMonthLabel() {
  const now = new Date();
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];
  return monthNames[now.getMonth()];
}

const Analisis_Inv = () => {
  const {
    analisisData,
    loading,
    error,
    refresh,
    hasData
  } = useAnalisisInv();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  // Filtrar datos basado en la búsqueda
  useEffect(() => {
    if (analisisData?.data?.productos) {
      const filtered = analisisData.data.productos.filter(producto =>
        producto.artNombre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData([]);
    }
  }, [analisisData, searchQuery]);

  // Columnas para la tabla, ahora con categoría y valor inventario
  const columns = [
    {
      Header: "Nombre del Producto",
      accessor: "artNombre",
      width: 220,
      Cell: ({ value }) => <Text style={{ fontWeight: "500" }}>{value}</Text>
    },
    {
      Header: "Categoría",
      accessor: "categoria",
      width: 160,
      Cell: ({ value }) => <Text>{value}</Text>
    },
    {
      Header: "Existencia Actual",
      accessor: "existenciaActual",
      width: 120,
      Cell: ({ value }) => <Text style={{ color: "var(--sapInformativeColor)", fontWeight: "bold" }}>{value} unidades</Text>
    },
    {
      Header: `Predicción Ventas en ${getNextMonthLabel()}`,
      accessor: "prediccion",
      width: 120,
      Cell: ({ value }) => <Text style={{ color: "var(--sapAccentColor7)", fontWeight: "bold", }}>{value} unidades</Text>
    },
    {
      Header: "Costo Unitario",
      accessor: "costoUnitario",
      width: 120,
      Cell: ({ value }) => <Text>${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
    },
    {
      Header: "Valor Inventario",
      accessor: "valorInventario",
      width: 140,
      Cell: ({ value }) => <Text style={{ color: "var(--sapPositiveColor)", fontWeight: "bold" }}>${value?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
    },
    {
      Header: "Déficit Estimado",
      accessor: "deficitEstimado",
      width: 120,
      Cell: ({ value }) => <Text>{value}</Text>
    },
    {
      Header: "Riesgo",
      accessor: "riesgo",
      width: 80,
      Cell: ({ value }) => <Text style={{ color: value === 'Sí' ? 'var(--sapNegativeColor)' : 'var(--sapPositiveColor)' }}>{value}</Text>
    },
    {
      Header: "Días Cobertura",
      accessor: "diasCobertura",
      width: 120,
      Cell: ({ value }) => <Text>{value !== null && value !== undefined ? value.toFixed(2) : '-'}</Text>
    },
    {
      Header: "Última Compra",
      accessor: "ultimaCompra",
      width: 120,
      Cell: ({ value }) => <Text>{value || '-'}</Text>
    },
    {
      Header: "Días Prom. entre Órdenes",
      accessor: "diasPromEntreOrdenes",
      width: 150,
      Cell: ({ value }) => <Text>{value !== null && value !== undefined ? value.toFixed(2) : '-'}</Text>
    }
  ];

  // KPIs desde el resumen del backend
  const resumen = analisisData?.data?.resumen || {};
  const valorTotalInventario = resumen.totalValorInventario || 0;
  const productosBajoStock = resumen.productosBajoStock || 0;

  // Manejadores de eventos
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleRefresh = async () => {
    setShowToast(true);
    setToastMessage("Actualizando datos...");
    await refresh();
    setToastMessage("Datos actualizados correctamente");
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
  };

  const handleExportCSV = () => {
    downloadCSV(filteredData);
    setToastMessage("Archivo CSV exportado");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div style={{ 
      width: "100%",
      minHeight: "100%",
      padding: "1rem",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      paddingTop: "2rem"
    }}>
      <InventoryHeader />
      <div style={{
        padding: "0.5rem 1rem",
        backgroundColor: "var(--sapList_Background)",
        borderRadius: "0.5rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "var(--sapContent_Shadow0)",
      }}>
        <FlexBox 
          justifyContent={FlexBoxJustifyContent.SpaceBetween}
          alignItems={FlexBoxAlignItems.Center}
          wrap={FlexBoxWrap.Wrap}
          style={{ width: "100%" }}
        >
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "1rem" }}>
            <Text>
              Período: {analisisData?.data?.anio || 'No disponible'}
            </Text>
          </FlexBox>
          
          <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "0.5rem" }}>
            <Button 
              icon="refresh" 
              onClick={handleRefresh}
              tooltip="Actualizar análisis"
              style={{ marginRight: '0.5rem' }}
            >
              Actualizar
            </Button>
            <Button 
              icon="download"
              onClick={handleExportCSV}
              tooltip="Exportar a CSV"
              style={{ marginRight: '0.5rem' }}
            >
              Exportar
            </Button>
          </FlexBox>
        </FlexBox>
      </div>

      <div style={{ padding: "1rem" }}>
        {/* Error Message */}
        {error && (
          <MessageStrip 
            design="Negative" 
            style={{ marginBottom: "1rem" }}
          >
            Error: {error}
          </MessageStrip>
        )}

        {/* Filtros de búsqueda */}
        <div className={styles.filterBar}>
          <FlexBox 
            justifyContent={FlexBoxJustifyContent.SpaceBetween}
            alignItems={FlexBoxAlignItems.Center}
            wrap={FlexBoxWrap.Wrap}
            style={{ gap: "1rem" }}
          >
            <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "1rem", padding: "1rem" }}>
              <FlexBox alignItems={FlexBoxAlignItems.Center} style={{ gap: "0.5rem" }}>
                <Icon name="search" />
                <Text>Buscar producto:</Text>
                <Input
                  placeholder="Ingrese nombre del producto..."
                  value={searchQuery}
                  onInput={handleSearch}
                  style={{ width: "300px" }}
                />
              </FlexBox>
              <Button 
                icon="refresh"
                design="Transparent"
                onClick={handleClearFilters}
              >
                Limpiar Filtros
              </Button>
            </FlexBox>
          </FlexBox>
        </div>
        {/* Loading State */}
        {loading ? (
          <FlexBox
            direction={FlexBoxDirection.Column}
            justifyContent={FlexBoxJustifyContent.Center}
            alignItems={FlexBoxAlignItems.Center}
            style={{ height: "400px", gap: "1rem" }}
          >
            <BusyIndicator size="Large" />
            <Text style={{ fontSize: "1.25rem", fontWeight: "600" }}>
              Cargando Análisis de Inventario
            </Text>
          </FlexBox>
        ) : (
          <>
            {hasData ? (
              <InventoryTable
                data={filteredData}
                columns={columns}
                title="Análisis de Inventario"
                totalCount={analisisData?.data?.productos?.length || 0}
                isLoading={loading}
              />
            ) : (
              <MessageStrip design="Information">
                No hay datos disponibles para mostrar
              </MessageStrip>
            )}
          </>
        )}
      </div>

      <Toast
        show={showToast}
        onAfterClose={() => setShowToast(false)}
      >
        {toastMessage}
      </Toast>
    </div>
  );
};

export default Analisis_Inv; 