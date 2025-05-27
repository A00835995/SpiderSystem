import React, { useState, useEffect, useMemo } from 'react';
import {
  Title,
  Text,
  BusyIndicator,
  FlexBox,
  FlexBoxJustifyContent,
  FlexBoxAlignItems
} from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

import { useProveedores } from '../hooks/useProveedores';

// Import necesario para soporte de formularios UI5
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";

// Importar componentes
import ProveedorHeader from '../components/Proveedores/ProveedorHeader';
import ProveedoresTable from '../components/Proveedores/ProveedoresTable';
import ProveedoresFilters from '../components/Proveedores/ProveedoresFilters';
import ProveedoresPagination from '../components/Proveedores/ProveedoresPagination';
import ProveedorDetailsDialog from '../components/Proveedores/ProveedorDetailsDialog';
import AddProveedorDialog from '../components/Proveedores/AddProveedorDialog';
import InventoryResumen from '../components/Proveedores/InventoryResumen';

const Gestion_de_Proveedores = () => {
  const navigate = useNavigate();

  
  // Usar el hook de proveedores
  const {
    proveedores: allProveedores,
    tiposProveedores,
    tiposPagos,
    loading: hookLoading,
    error: hookError,
    crearProveedor,
    getProveedor,
    actualizarNombreProveedor,
    actualizarNombreContactoProveedor,
    actualizarTelefonoProveedor,
    actualizarDireccionProveedor,
    actualizarTipoProveedor,
    actualizarTipoPagoProveedor,
    actualizarEmailProveedor
  } = useProveedores();

  // Estados locales para UI
  const [proveedores, setProveedores] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: '',
    tipo: 'Fabricante',
    tipoPago: 'Crédito Corporativo'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  const [activeCategory, setActiveCategory] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const itemsPerPage = 4;

  // Sincronizar proveedores del hook con estado local
  useEffect(() => {
    if (allProveedores && allProveedores.data) {
      setProveedores(allProveedores.data);
    }
  }, [allProveedores]);

  // Filtrar proveedores según búsqueda y tipo
  useEffect(() => {
    if (!allProveedores || !allProveedores.data) return;

    let filtered = allProveedores.data;

    // Aplicar filtro de tipo
    if (filterType !== 'todos') {
      filtered = filtered.filter(proveedor => 
        proveedor.tipoProveedor && 
        proveedor.tipoProveedor.toLowerCase() === filterType
      );
    }

    // Aplicar filtro de búsqueda
    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(proveedor =>
        proveedor.nombreProveedor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.nombreContacto?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        proveedor.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setProveedores(filtered);
    setCurrentPage(1); // Reset página al filtrar
  }, [allProveedores, filterType, searchTerm]);

  const handleAddProveedor = async () => {
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    try {
      await crearProveedor(formData);
    handleCloseAddDialog();
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      setFormErrors({ general: 'Error al crear el proveedor. Intente nuevamente.' });
    }
  };

  const handleViewDetails = async (proveedor) => {
    console.log("=== DEBUG handleViewDetails ===");
    console.log("Proveedor recibido:", proveedor);
    console.log("ID del proveedor:", proveedor.idProveedor);
    console.log("Todas las propiedades del proveedor:", Object.keys(proveedor));
    
    try {
      setLoadingDetails(true);
    setShowDialog(true);
    document.body.style.overflow = 'hidden';
      
      const detalles = await getProveedor(proveedor.idProveedor);
      console.log("Detalles obtenidos del servidor:", detalles);
      
      // Asegurar que el objeto tenga el ID en el campo correcto
      const proveedorConId = {
        ...detalles.data,
        idProveedor: detalles.data.idProveedor || detalles.data.id || detalles.data.PROVID || proveedor.idProveedor
      };
      
      console.log("Proveedor con ID asegurado:", proveedorConId);
      setSelectedProveedor(proveedorConId);
    } catch (error) {
      console.error('Error al cargar detalles:', error);
      
      // Asegurar que el fallback también tenga el ID correcto
      const proveedorFallback = {
        ...proveedor,
        idProveedor: proveedor.idProveedor || proveedor.id || proveedor.PROVID
      };
      
      console.log("Usando proveedor fallback:", proveedorFallback);
      setSelectedProveedor(proveedorFallback);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleSearch = () => {
    // La búsqueda se maneja automáticamente en el useEffect
    setCurrentPage(1);
  };

  const handleFilterChange = (tipo) => {
    setFilterType(tipo);
    // El filtrado se maneja automáticamente en el useEffect
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedProveedor(null);
    setLoadingDetails(false);
    document.body.style.overflow = 'unset';
  };

  const handleCloseAddDialog = () => {
    setShowAddDialog(false);
    document.body.style.overflow = 'unset';
    
    setTimeout(() => {
      setFormErrors({});
      setFormData({
        nombre: '',
        contacto: '',
        email: '',
        telefono: '',
        direccion: '',
        tipo: 'Fabricante',
        tipoPago: 'Crédito Corporativo'
      });
    }, 100);
  };

  const handleOpenAddDialog = () => {
    setShowAddDialog(true);
    document.body.style.overflow = 'hidden';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    
    // Limpiar error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Cálculo de elementos paginados
  const paginatedProveedores = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return proveedores.slice(startIndex, startIndex + itemsPerPage);
  }, [proveedores, currentPage, itemsPerPage]);

  // Funciones para el manejo del formulario de agregar proveedor
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del proveedor es obligatorio";
    }
    
    if (!formData.contacto.trim()) {
      errors.contacto = "El nombre de contacto es obligatorio";
    }
    
    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es obligatorio";
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Formato de correo inválido";
      }
    }
    
    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio";
    } else {
      // Validación más flexible para números internacionales
      const phoneRegex = /^\+?[\d\s\-\(\)]{7,20}$/;
      if (!phoneRegex.test(formData.telefono)) {
        errors.telefono = "Formato de teléfono inválido";
      }
    }
    
    if (!formData.direccion.trim()) {
      errors.direccion = "La dirección es obligatoria";
    }

    if (!formData.email.trim()) {
      errors.email = "El correo electrónico es obligatorio";
    } else {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        errors.email = "Formato de correo inválido";
      }
    }
    
    return errors;
  };

  // Mostrar error si hay problemas con el hook
  if (hookError) {
  return (
    <div style={{ 
      padding: '1.5rem',
        backgroundColor: '#f7f7f7',
        minHeight: '100vh',
        fontFamily: '"72", Arial, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <FlexBox
          justifyContent={FlexBoxJustifyContent.Center}
          alignItems={FlexBoxAlignItems.Center}
          style={{ height: '50vh', flexDirection: 'column', gap: '1rem' }}
        >
          <Text style={{ color: '#d63031', fontSize: '1.125rem' }}>
            {hookError}
          </Text>
        </FlexBox>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '1.5rem',
      backgroundColor: '#f7f7f7',
      minHeight: '100vh',
      fontFamily: '"72", Arial, sans-serif',
      maxWidth: '1200px',
      margin: '0 auto',
      overflowY: 'auto',
      overflowX: 'hidden',
      position: 'relative'
    }}>
      <div style={{ 
        marginBottom: '1.25rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '1rem',
        marginTop: '1rem',
      }}>
        <ProveedorHeader />
        </div>

      {hookLoading ? (
        <div 
          style={{ 
            marginTop: '1rem',
            backgroundColor: '#ffffff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
            borderRadius: '0.5rem',
            border: 'none',
            overflow: 'hidden',
            padding: '2rem'
          }}
        >
            <FlexBox
              justifyContent={FlexBoxJustifyContent.Center}
              alignItems={FlexBoxAlignItems.Center}
              style={{ height: '300px' }}
            >
              <BusyIndicator active size="Medium" />
            <Text style={{ marginLeft: '1rem', color: 'inherit' }}>
              Cargando proveedores...
            </Text>
            </FlexBox>
        </div>
        ) : (
        <>
          <ProveedoresFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onSearch={handleSearch}
            onKeyPress={handleKeyPress}
            filterType={filterType}
            onFilterChange={handleFilterChange}
            tiposProveedores={tiposProveedores?.data || []}
          />

          <ProveedoresTable
            paginatedProveedores={paginatedProveedores}
            itemsPerPage={itemsPerPage}
            onViewDetails={handleViewDetails}
            proveedores={proveedores}
            onAddProveedor={handleOpenAddDialog}
          />

          <ProveedoresPagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            proveedores={proveedores}
            itemsPerPage={itemsPerPage}
          />

          <InventoryResumen
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </>
      )}

      <ProveedorDetailsDialog
        selectedProveedor={selectedProveedor}
        showDialog={showDialog}
        onClose={handleCloseDialog}
        loading={loadingDetails}
        onUpdateNombre={actualizarNombreProveedor}
        onUpdateContacto={actualizarNombreContactoProveedor}
        onUpdateTelefono={actualizarTelefonoProveedor}
        onUpdateDireccion={actualizarDireccionProveedor}
        onUpdateEmail={actualizarEmailProveedor}
        onUpdateTipo={actualizarTipoProveedor}
        onUpdateTipoPago={actualizarTipoPagoProveedor}
        tiposProveedores={tiposProveedores}
        tiposPagos={tiposPagos}
      />

      <AddProveedorDialog
        showAddDialog={showAddDialog}
        onClose={handleCloseAddDialog}
        formData={formData}
        onInputChange={handleInputChange}
        formErrors={formErrors}
        onAddProveedor={handleAddProveedor}
        tiposProveedores={tiposProveedores}
        tiposPagos={tiposPagos}
      />
    </div>
  );
};

export default Gestion_de_Proveedores;