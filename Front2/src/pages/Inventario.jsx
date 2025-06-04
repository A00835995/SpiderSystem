import React, { useState, useEffect } from "react";
import { useInventory } from "../hooks/useInventory";

import InventoryStats from "../components/Inventario/InventoryStats";
import InventoryFilters from "../components/Inventario/InventoryFilters";
import InventoryTable from "../components/Inventario/InventoryTable";

import { downloadCSV } from "../utils/csvUtils";
import { applyFilters } from "../utils/filters";

import {
  fetchInventoryData,
  fetchTotalInventoryCount
} from "../services/inventoryService";


import {
  DynamicPageTitle,
  DynamicPageHeader,
  Title,
  Text,
  FlexBox,
  FlexBoxAlignItems,
  FlexBoxJustifyContent,
  FlexBoxWrap,
  Icon,
  Button,
  MessageStrip,
  ObjectStatus,
  Toast,
  ValueState
} from "@ui5/webcomponents-react";
import { useUI5Theme } from "../components/UI5ThemeProvider";
import { styles } from "../Styles/InventarioStyles";

// Importar íconos necesarios
import "@ui5/webcomponents-icons/dist/inventory.js";
import "@ui5/webcomponents-icons/dist/filter.js";
import "@ui5/webcomponents-icons/dist/search.js";
import "@ui5/webcomponents-icons/dist/download.js";
import "@ui5/webcomponents-icons/dist/refresh.js";
import "@ui5/webcomponents-icons/dist/add.js";
import "@ui5/webcomponents-icons/dist/edit.js";
import "@ui5/webcomponents-icons/dist/delete.js";
import "@ui5/webcomponents-icons/dist/warning.js";
import "@ui5/webcomponents-icons/dist/alert.js";
import "@ui5/webcomponents-icons/dist/message-success.js";
import "@ui5/webcomponents-icons/dist/synchronize.js";
import "@ui5/webcomponents-icons/dist/sys-help.js";
import "@ui5/webcomponents-icons/dist/sort.js";
import "@ui5/webcomponents-icons/dist/group-2.js";
import "@ui5/webcomponents-icons/dist/locate-me.js";
import "@ui5/webcomponents-icons/dist/shipping-status.js";
import "@ui5/webcomponents-icons/dist/supplier.js";

// Función para convertir a CSV
function convertArrayOfObjectsToCSV(array) {
  let result;

  const columnDelimiter = ",";
  const lineDelimiter = "\n";
  const keys = Object.keys(array[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  array.forEach((item) => {
    let ctr = 0;
    keys.forEach((key) => {
      if (ctr > 0) result += columnDelimiter;

      if (key === 'ultimaActualizacion') {
        result += item[key] instanceof Date ? item[key].toLocaleString() : item[key];
      } else {
        result += item[key];
      }
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
}

//Main Componente
export default function Inventario() {
  const { isDarkMode } = useUI5Theme();

  //Consigo los datos del inventario
  const { 
    inventoryData, //Contiene los datos del inventario
    filteredData, //Contiene los datos filtrados
    setFilteredData, //Contiene la funcion para filtrar los datos
    isLoading, //Contiene el estado de carga
    error, //Contiene el error
    inventoryStats, //Contiene las estadisticas del inventario
    lastUpdateTime, //Contiene la ultima actualizacion
    refreshInventory
  } = useInventory();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedProveedores, setSelectedProveedores] = useState([]);
  const [selectedEstados, setSelectedEstados] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Lista de categorías únicas
  const categorias = [...new Set(inventoryData.map(item => item.categoria))];
  // Lista de ubicaciones únicas
  const ubicaciones = [...new Set(inventoryData.map(item => item.ubicacion))];
  // Lista de proveedores únicos
  const proveedores = [...new Set(inventoryData.map(item => item.proveedor))];


  // Columnas para la tabla
  const columns = [
    {
      Header: "SKU",
      accessor: "sku",
      width: 120,
    },
    {
      Header: "Producto",
      accessor: "producto",
      width: 220,
    },
    {
      Header: "Categoría",
      accessor: "categoria",
      width: 150,
    },
    {
      Header: "Cantidad",
      accessor: "cantidad",
      width: 100,
      Cell: ({ value }) => (
        <Text style={{ fontWeight: "bold", color: value === 0 ? "var(--sapErrorColor)" : value <= 5 ? "var(--sapWarningColor)" : "inherit" }}>
          {value}
        </Text>
      )
    },
    {
      Header: "Estado",
      accessor: "estado",
      width: 130,
      Cell: ({ value }) => {
        let state, icon;
        switch (value) {
          case "Agotado":
            state = ValueState.Error;
            //icon = "alert";
            break;
          case "Bajo stock":
            state = ValueState.Warning;
            //icon = "warning";
            break;
          default:
            state = ValueState.Success;
            //icon = "message-success";
            break;
        }
    
        return (
          <span
            style={{
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            title={value}
          >
            <ObjectStatus
              state={state}
             // icon={icon}
              style={{
                display: "inline",
              }}
            >
              {value}
            </ObjectStatus>
          </span>
        );
      }
    }
    
    
    ,
    
    
    {
      Header: "Ubicación",
      accessor: "ubicacion",
      width: 130,
      Cell: ({ value }) => (
        <FlexBox alignItems={FlexBoxAlignItems.Center}>
          <Icon name="locate-me" style={{ marginRight: '0.5rem', color: value === "Almacén A" ? "#1976d2" : value === "Almacén B" ? "#388e3c" : "#e64a19" }} />
          <Text>{value}</Text>
        </FlexBox>
      )
    },
    {
      Header: "Proveedor",
      accessor: "proveedor",
      width: 220,
      Cell: ({ value }) => (
        <FlexBox alignItems={FlexBoxAlignItems.Center}>
          <Icon name="supplier" style={{ marginRight: '0.5rem' }} />
          <Text>{value}</Text>
        </FlexBox>
      )
    },
    {
      Header: "Última Actualización",
      accessor: "ultimaActualizacion",
      width: 180,
      Cell: ({ value }) => (
        <Text>{value instanceof Date ? value.toLocaleString() : value}</Text>
      )
    },
  ];
  
  //APLICO EL BACKEND
  //Solo se ejecuta cuando se carga la pagina porque tiene "[]"
  useEffect(() => {
    const loadInventory = async () => {
      setIsLoading(true);
      try {
        const data = await fetchInventoryData();
        //Update los datos del inventario
        setFilteredData(data);
        setLastUpdateTime(new Date());
      } catch (error) {
        console.error("Error al obtener artículos:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    loadInventory();
  }, []);
  
  //APLICO EL BACKEND
  useEffect(() => {
    const loadTotalCount = async () => {
      try {
        const total = await fetchTotalInventoryCount();
      } catch (error) {
        console.error("Error al obtener el total de productos:", error);
      }
    };
  
    loadTotalCount();
  }, []);
  
  // Aplicar filtros cuando cambian
  useEffect(() => {
    const filtered = applyFilters(inventoryData, {
      searchQuery,
      selectedCategories,
      selectedLocations,
      selectedProveedores,
      selectedEstados
    });
    setFilteredData(filtered);
  }, [inventoryData, searchQuery, selectedCategories, selectedLocations, selectedProveedores, selectedEstados]);
  
  
  // Manejadores de eventos
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  
  const handleCategoriesChange = (event) => {
    setSelectedCategories(event.detail.items.map(item => item.text));
  };
  
  const handleLocationsChange = (event) => {
    const selectedItems = event.detail.items;
    const selectedLocations = selectedItems.map(item => item.text);
    setSelectedLocations(selectedLocations);
  };
  
  const handleProveedoresChange = (event) => {
    setSelectedProveedores(event.detail.items.map(item => item.text));
  };
  
  const handleEstadosChange = (event) => {
    setSelectedEstados(event.detail.items.map(item => item.text));
  };
  
  const handleRefresh = async () => {
    setShowToast(true);
    setToastMessage("Actualizando datos...");
    await refreshInventory();
    setToastMessage("Datos actualizados correctamente");
    setTimeout(() => setShowToast(false), 3000);
  };
  
  
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedProveedores([]);
    setSelectedEstados([]);
    setFilteredData([...inventoryData]);
  };
        
  const handleExportCSV = () => {
    downloadCSV(filteredData);
    setToastMessage("Archivo CSV exportado");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
  
  const addNotification = (producto, nuevoEstado) => {
    const id = Date.now();
    const nuevaNotificacion = {
      id,
      mensaje: `${producto} ha cambiado a estado: ${nuevoEstado}`,
      estado: nuevoEstado
    };
  
    setNotifications(prev => [nuevaNotificacion, ...prev]);
  
    setTimeout(() => {
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    }, 5000); // Se borra después de 5 segundos
  };
  
  
  return (
    
    <>
      <DynamicPageTitle
        header={<Title>Inventario</Title>}
        subHeader={<Text>Gestión y control de inventario de productos</Text>}
        className={styles.pageHeader}
      />

{notifications.map(notif => (
  <MessageStrip
    key={notif.id}
    design={
      notif.estado === "Agotado"
        ? "Negative"
        : notif.estado === "Bajo stock"
        ? "Warning"
        : "Positive"
    }
    hideCloseButton={false}
    style={{ marginBottom: "0.5rem" }}
  >
    {notif.mensaje}
  </MessageStrip>
))}

      
      <DynamicPageHeader className={styles.pageHeader}>
        <FlexBox 
          justifyContent={FlexBoxJustifyContent.SpaceBetween}
          alignItems={FlexBoxAlignItems.Center}
          wrap={FlexBoxWrap.Wrap}
          style={{ marginTop: "0.5rem", marginBottom: "1.5rem" }}

        >
          <Text>
            Última actualización: {lastUpdateTime.toLocaleString()}
          </Text>
          
          <FlexBox>
            <Button 
              icon="refresh" 
              onClick={handleRefresh}
              tooltip="Actualizar inventario"
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
      </DynamicPageHeader>

      

      
      <div className={styles.pageContainer}>
        {/* Estadísticas de inventario */}
        <InventoryStats
          inventoryStats={inventoryStats}
          styles={styles}
        />


        
        {/* Filtros */}
        <InventoryFilters
          searchQuery={searchQuery}
          handleSearch={handleSearch}
          categorias={categorias}
          ubicaciones={ubicaciones}
          handleCategoriesChange={handleCategoriesChange}
          handleLocationsChange={handleLocationsChange}
          handleEstadosChange={handleEstadosChange}
          selectedEstados={selectedEstados}
          handleClearFilters={handleClearFilters}
          styles={styles}
        />
        {/* Tabla de inventario */}
        <InventoryTable
          data={filteredData}
          columns={columns}
          isLoading={isLoading}
          totalCount={inventoryData.length}
        />

        
        {/* Toast para notificaciones */}
        {showToast && (
          <Toast duration={3000} className={styles.toastContent}>
            <FlexBox alignItems={FlexBoxAlignItems.Center}>
              <Icon name="synchronize" style={{ marginRight: '0.5rem' }} />
              <Text>{toastMessage}</Text>
            </FlexBox>
          </Toast>
        )}
        

      </div>
    </>
  );
}