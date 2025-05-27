import React, { useState, useEffect } from 'react';
import {
  Button,
  FlexBox,
  FlexBoxDirection,
  Text,
  Title,
  ObjectStatus,
  Badge,
  ValueState,
  BusyIndicator,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  Input,
  Toast
} from '@ui5/webcomponents-react';

const ProveedorDetailsDialog = ({ 
  selectedProveedor, 
  showDialog, 
  onClose, 
  loading = false,
  onUpdateNombre,
  onUpdateContacto,
  onUpdateTelefono,
  onUpdateDireccion,
  onUpdateEmail,
  onUpdateTipo,
  onUpdateTipoPago,
  tiposProveedores,
  tiposPagos
}) => {
  // Estados para modo de edición
  const [editingField, setEditingField] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Inicializar valores de edición cuando se selecciona un proveedor
  useEffect(() => {
    if (selectedProveedor) {
      setEditValues({
        nombre: selectedProveedor.nombreProveedor || '',
        contacto: selectedProveedor.nombreContacto || '',
        email: selectedProveedor.email || '',
        telefono: selectedProveedor.telefono || '',
        direccion: selectedProveedor.direccion || '',
        tipo: selectedProveedor.tipoProveedor || 'Fabricante',
        tipoPago: selectedProveedor.tipoPago || 'Crédito Corporativo'
      });
    }
  }, [selectedProveedor]);

  const getBadgeColorByProductCount = (count) => {
    if (count > 30) return ValueState.Success;
    if (count > 20) return ValueState.Warning;
    return ValueState.Information;
  };

  const getTipoValueState = (tipo) => {
    if (!tipo || typeof tipo !== 'string') return ValueState.None;
    
    switch (tipo.toLowerCase()) {
      case "fabricante": return ValueState.Success;
      case "distribuidor": return ValueState.Information;
      case "importador": return ValueState.Warning;
      default: return ValueState.Error;
    }
  };

  // Función para formatear el nombre del tipo
  const formatTipoNombre = (tipo) => {
    if (!tipo || typeof tipo !== 'string') return 'No especificado';
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  // Función para formatear el nombre del tipo de pago
  const formatTipoPagoNombre = (tipoPago) => {
    if (!tipoPago || typeof tipoPago !== 'string') return 'No especificado';
    return tipoPago.charAt(0).toUpperCase() + tipoPago.slice(1);
  };

  // Función para iniciar edición de un campo
  const startEditing = (field) => {
    console.log('Iniciando edición del campo:', field);
    console.log('Estado actual editingField:', editingField);
    setEditingField(field);
    setUpdateError(null);
    console.log('Nuevo estado editingField será:', field);
  };

  // Función para cancelar edición
  const cancelEditing = () => {
    setEditingField(null);
    setUpdateError(null);
    // Restaurar valores originales
    if (selectedProveedor) {
      setEditValues({
        nombre: selectedProveedor.nombreProveedor || '',
        contacto: selectedProveedor.nombreContacto || '',
        email: selectedProveedor.email || '',
        telefono: selectedProveedor.telefono || '',
        direccion: selectedProveedor.direccion || '',
        tipo: selectedProveedor.tipoProveedor || 'Fabricante',
        tipoPago: selectedProveedor.tipoPago || 'Crédito Corporativo'
      });
    }
  };

  // Función para guardar cambios
  const saveField = async (field) => {
    console.log('=== DEBUG saveField ===');
    console.log('selectedProveedor completo:', selectedProveedor);
    console.log('selectedProveedor.idProveedor:', selectedProveedor?.idProveedor);
    console.log('selectedProveedor.id:', selectedProveedor?.id);
    console.log('selectedProveedor.PROVID:', selectedProveedor?.PROVID);
    console.log('Todas las propiedades:', Object.keys(selectedProveedor || {}));
    
    if (!selectedProveedor) {
      console.error('No hay proveedor seleccionado');
      setUpdateError('No hay proveedor seleccionado');
      return;
    }
    
    // Intentar diferentes nombres de campo para el ID
    const proveedorId = selectedProveedor.idProveedor || 
                       selectedProveedor.id || 
                       selectedProveedor.PROVID ||
                       selectedProveedor.proveedorId;
    
    if (!proveedorId) {
      console.error('No se encontró ID del proveedor en ningún campo esperado');
      console.error('Campos disponibles:', Object.keys(selectedProveedor));
      setUpdateError('No se pudo identificar el ID del proveedor');
      return;
    }
    
    console.log('Iniciando guardado del campo:', field);
    console.log('Valor a guardar:', editValues[field]);
    console.log('ID del proveedor a usar:', proveedorId);
    
    setUpdating(true);
    setUpdateError(null);
    
    try {
      const newValue = editValues[field];
      
      // Validar que el valor no esté vacío
      if (!newValue || newValue.trim() === '') {
        console.error('El valor no puede estar vacío');
        setUpdateError('El valor no puede estar vacío');
        return;
      }
      
      console.log('Llamando función de actualización para:', field, 'con valor:', newValue);
      
      let result;
      switch (field) {
        case 'nombre':
          result = await onUpdateNombre(proveedorId, newValue);
          break;
        case 'contacto':
          result = await onUpdateContacto(proveedorId, newValue);
          break;
        case 'telefono':
          result = await onUpdateTelefono(proveedorId, newValue);
          break;
        case 'direccion':
          result = await onUpdateDireccion(proveedorId, newValue);
          break;
        case 'email':
          result = await onUpdateEmail(proveedorId, newValue);
          break;
        case 'tipo':
          result = await onUpdateTipo(proveedorId, newValue);
          break;
        case 'tipoPago':
          result = await onUpdateTipoPago(proveedorId, newValue);
          break;
        default:
          throw new Error(`Campo no reconocido: ${field}`);
      }
      
      console.log('Resultado de la actualización:', result);
      
      // Actualizar el proveedor seleccionado con el nuevo valor
      const fieldMap = {
        'nombre': 'nombreProveedor',
        'contacto': 'nombreContacto',
        'tipo': 'tipoProveedor',
        'email': 'email',
        'telefono': 'telefono',
        'direccion': 'direccion',
        'tipoPago': 'tipoPago'
      };
      
      selectedProveedor[fieldMap[field]] = newValue;
      
      console.log('Campo actualizado exitosamente, saliendo del modo edición');
      setEditingField(null);
      
      // Mostrar toast de éxito
      setToastMessage(`${field.charAt(0).toUpperCase() + field.slice(1)} actualizado exitosamente`);
      setShowToast(true);
      
    } catch (error) {
      console.error(`Error al actualizar ${field}:`, error);
      setUpdateError(`Error al actualizar ${field}: ${error.message}`);
    } finally {
      setUpdating(false);
    }
  };

  // Función para manejar cambios en inputs
  const handleInputChange = (field, value) => {
    console.log(`handleInputChange - Campo: ${field}, Valor: "${value}"`);
    setEditValues(prev => {
      const newValues = {
        ...prev,
        [field]: value
      };
      console.log('Nuevos editValues:', newValues);
      return newValues;
    });
  };

  // Función para renderizar un campo editable
  const renderEditableField = (label, field, type = 'text', options = null) => {
    const isEditing = editingField === field;
    const isMobile = window.innerWidth <= 768;
    const currentValue = selectedProveedor ? 
      (field === 'nombre' ? selectedProveedor.nombreProveedor :
       field === 'contacto' ? selectedProveedor.nombreContacto :
       field === 'tipo' ? selectedProveedor.tipoProveedor :
       selectedProveedor[field]) : '';

    console.log(`Renderizando campo ${field}:`, {
      editingField,
      isEditing,
      currentValue
    });

    return (
      <FlexBox style={{ 
        margin: '0.5rem 0', 
        alignItems: isMobile ? 'flex-start' : 'center',
        flexDirection: isMobile ? 'column' : 'row',
        minWidth: isMobile ? '100%' : '450px',
        gap: isMobile ? '0.5rem' : '0'
      }}>
        <Text style={{ 
          width: isMobile ? '100%' : '140px',
          minWidth: isMobile ? 'auto' : '120px',
          fontWeight: 'bold',
          color: '#32363a'
        }}>
          {label}:
        </Text>
        
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          minWidth: isMobile ? '100%' : '300px',
          width: isMobile ? '100%' : 'auto'
        }}>
          {isEditing ? (
            <>
              {type === 'select' && options ? (
                <select
                  value={editValues[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  style={{ 
                    width: isMobile ? '100%' : '250px', 
                    minWidth: isMobile ? '100%' : '200px',
                    padding: '0.5rem',
                    borderRadius: '0.25rem',
                    border: '1px solid #d9d9d9',
                    backgroundColor: '#ffffff',
                    color: '#32363a',
                    fontSize: '0.875rem',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {options.map((option, index) => (
                    <option key={index} value={option}>
                      {formatTipoNombre(option)}
                    </option>
                  ))}
                </select>
              ) : (
                <Input
                  value={editValues[field]}
                  onChange={(e) => handleInputChange(field, e.target.value)}
                  style={{ 
                    width: isMobile ? '100%' : '250px', 
                    minWidth: isMobile ? '100%' : '200px' 
                  }}
                  valueState={updateError ? ValueState.Error : ValueState.None}
                />
              )}
              
              <Button
                icon={updating ? "busy" : "accept"}
                design="Positive"
                onClick={() => {
                  console.log('Botón de guardar clickeado para campo:', field);
                  saveField(field);
                }}
                disabled={updating}
                style={{ minWidth: 'auto', padding: '0.25rem' }}
              />
              <Button
                icon="decline"
                design="Negative"
                onClick={() => {
                  console.log('Cancelando edición del campo:', field);
                  cancelEditing();
                }}
                disabled={updating}
                style={{ minWidth: 'auto', padding: '0.25rem' }}
              />
            </>
          ) : (
            <>
              {field === 'tipo' ? (
                <ObjectStatus state={getTipoValueState(currentValue)}>
                  {formatTipoNombre(currentValue)}
                </ObjectStatus>
              ) : (
                <Text style={{ 
                  color: '#32363a',
                  marginRight: '0.5rem',
                  flex: 1,
                  wordBreak: 'break-word'
                }}>
                  {currentValue || 'No especificado'}
                </Text>
              )}
              
              <Button
                icon="edit"
                design="Transparent"
                onClick={() => {
                  console.log('Botón de editar clickeado para campo:', field);
                  startEditing(field);
                }}
                style={{ minWidth: 'auto', padding: '0.25rem' }}
              />
            </>
          )}
        </div>
      </FlexBox>
    );
  };

  if (!showDialog) return null;

  return (
    <>
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      >
        {toastMessage}
      </Toast>

      {/* Modal Backdrop */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          zIndex: 999,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'fit-content',
          minWidth: window.innerWidth <= 768 ? '95vw' : '500px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '0.5rem',
          border: '1px solid #e0e0e0',
          zIndex: 1000,
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Title level="H4" style={{ margin: 0, color: '#32363a' }}>
            Detalles del Proveedor
          </Title>
          <Button
            icon="decline"
            design="Transparent"
            onClick={onClose}
            style={{ minWidth: 'auto', padding: '0.25rem' }}
          />
        </div>

        {/* Modal Body */}
        <div style={{ 
          padding: '1.5rem',
          overflowY: 'auto',
          maxHeight: 'calc(90vh - 130px)'
        }}>
          {loading ? (
            <FlexBox
              justifyContent={FlexBoxJustifyContent.Center}
              alignItems={FlexBoxAlignItems.Center}
              style={{ height: '200px' }}
            >
              <BusyIndicator active size="Medium" />
              <Text style={{ marginLeft: '1rem', color: 'inherit' }}>
                Cargando detalles...
              </Text>
            </FlexBox>
          ) : selectedProveedor ? (
            <FlexBox direction={FlexBoxDirection.Column} style={{ gap: '1rem' }}>
              {/* Error display */}
              {updateError && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#ffeaea',
                  border: '1px solid #ffd7d7',
                  borderRadius: '0.25rem'
                }}>
                                      <Text style={{
                      color: '#ab1f1f',
                      fontSize: '0.875rem'
                    }}>
                      {updateError}
                    </Text>
                </div>
              )}

              {/* Campos editables */}
              {renderEditableField('Nombre', 'nombre')}
              {renderEditableField('Contacto', 'contacto')}
              {renderEditableField('Email', 'email')}
              {renderEditableField('Teléfono', 'telefono')}
              {renderEditableField('Dirección', 'direccion')}
    
              
              {renderEditableField('Tipo', 'tipo', 'select', tiposProveedores?.data || tiposProveedores || [])}
              {renderEditableField('Tipo de Pago', 'tipoPago', 'select', tiposPagos?.data || tiposPagos || [])}
              
              <FlexBox style={{ margin: '0.5rem 0' }}>
                <Text style={{ 
                  width: '140px', 
                  fontWeight: 'bold',
                  color: '#32363a'
                }}>
                  Productos:
                </Text>
                <Badge color={getBadgeColorByProductCount(selectedProveedor.numeroProductos || 0)}>
                  {selectedProveedor.numeroProductos || 0}
                </Badge>
              </FlexBox>
              
              <FlexBox style={{ margin: '0.5rem 0' }}>
                <Text style={{ 
                  width: '140px', 
                  fontWeight: 'bold',
                  color: '#32363a'
                }}>
                  Total Existencia:
                </Text>
                <Badge color={ValueState.Information}>
                  {selectedProveedor.totalExistencia || 0} unidades
                </Badge>
              </FlexBox>
              
              <FlexBox style={{ margin: '0.5rem 0' }}>
                <Text style={{ 
                  width: '140px', 
                  fontWeight: 'bold',
                  color: '#32363a'
                }}>
                  Último Pedido:
                </Text>
                <Text style={{ 
                  color: '#32363a'
                }}>
                  {selectedProveedor.ultimoPedido || 'No registrado'}
                </Text>
              </FlexBox>
            </FlexBox>
          ) : (
            <FlexBox
              justifyContent={FlexBoxJustifyContent.Center}
              alignItems={FlexBoxAlignItems.Center}
              style={{ height: '200px', flexDirection: 'column', gap: '1rem' }}
            >
              <Text style={{ color: '#6a6d70', fontSize: '1rem' }}>
                No se pudo cargar la información del proveedor
              </Text>
            </FlexBox>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end'
        }}>
          <Button 
            design="Emphasized" 
            onClick={onClose}
            style={{ 
              minWidth: '5rem',
              backgroundColor: '#0854a0',
              color: 'white'
            }}
          >
            Cerrar
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProveedorDetailsDialog; 