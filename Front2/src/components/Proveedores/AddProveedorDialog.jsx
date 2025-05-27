import React from 'react';
import {
  Button,
  Input,
  Text,
  Title,
  Form,
  FormItem,
  Select,
  Option,
  ValueState
} from '@ui5/webcomponents-react';

// Import necesario para soporte de formularios UI5
import "@ui5/webcomponents/dist/features/InputElementsFormSupport.js";

const AddProveedorDialog = ({
  showAddDialog,
  onClose,
  formData,
  onInputChange,
  formErrors,
  onAddProveedor,
  tiposProveedores = [],
  tiposPagos = []
}) => {
  // Debug: Ver qué datos están llegando
 // console.log('tiposProveedores:', tiposProveedores);
  //console.log('tiposPagos:', tiposPagos);

  // Función para formatear el nombre del tipo para mostrar
  const formatTipoNombre = (tipo) => {
    if (!tipo) return '';
    return tipo;
  };

  // Función para formatear nombres de tipos de pago
  const formatTipoPagoNombre = (tipoPago) => {
    if (!tipoPago) return '';
    return tipoPago;
  };

  if (!showAddDialog) return null;

  return (
    <>
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
          zIndex: 100,
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
          width: '500px',
          maxWidth: '90vw',
          maxHeight: '90vh',
          backgroundColor: '#ffffff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          borderRadius: '0.5rem',
          border: '1px solid #e0e0e0',
          zIndex: 101,
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
            Agregar Nuevo Proveedor
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
          <Text style={{ 
            marginBottom: '1.5rem', 
            color: '#6a6d70',
            fontSize: '0.875rem',
            lineHeight: '1.4',
            display: 'block'
          }}>
            Complete la información del nuevo proveedor. Todos los campos marcados con * son obligatorios.
          </Text>
          <Form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <FormItem
              style={{ margin: 0 }}
              label={
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <Text style={{ 
                      fontWeight: '600',
                      color: '#32363a',
                      fontSize: '0.875rem'
                    }}>
                      Nombre del Proveedor
                    </Text>
                    <Text style={{ 
                      color: '#bb0000',
                      marginLeft: '0.25rem'
                    }}>*</Text>
                  </div>
                  <Text style={{ 
                    fontSize: '0.75rem',
                    color: '#6a6d70',
                    lineHeight: '1.3'
                  }}>
                    Nombre comercial o razón social completa
                  </Text>
                </div>
              }
            >
              <Input
                name="nombre"
                value={formData.nombre}
                onChange={onInputChange}
                valueState={formErrors.nombre ? ValueState.Error : ValueState.None}
                valueStateMessage={formErrors.nombre}
                placeholder="Ej: Distribuidora ABC S.A. de C.V."
                style={{ width: '100%' }}
              />
            </FormItem>

            <FormItem
              style={{ margin: 0 }}
              label={
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <Text style={{ 
                      fontWeight: '600',
                      color: '#32363a',
                      fontSize: '0.875rem'
                    }}>
                      Nombre del Contacto
                    </Text>
                    <Text style={{ 
                      color: '#bb0000',
                      marginLeft: '0.25rem'
                    }}>*</Text>
                  </div>
                  <Text style={{ 
                    fontSize: '0.75rem',
                    color: '#6a6d70',
                    lineHeight: '1.3'
                  }}>
                    Persona responsable o representante
                  </Text>
                </div>
              }
            >
              <Input
                name="contacto"
                value={formData.contacto}
                onChange={onInputChange}
                valueState={formErrors.contacto ? ValueState.Error : ValueState.None}
                valueStateMessage={formErrors.contacto}
                placeholder="Ej: Juan Pérez González"
                style={{ width: '100%' }}
              />
            </FormItem>

            <FormItem
              style={{ margin: 0 }}
              label={
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <Text style={{ 
                      fontWeight: '600',
                      color: '#32363a',
                      fontSize: '0.875rem'
                    }}>
                      Correo Electrónico
                    </Text>
                    <Text style={{ 
                      color: '#bb0000',
                      marginLeft: '0.25rem'
                    }}>*</Text>
                  </div>
                  <Text style={{ 
                    fontSize: '0.75rem',
                    color: '#6a6d70',
                    lineHeight: '1.3'
                  }}>
                    Correo electrónico principal para comunicaciones
                  </Text>
                </div>
              }
            >
              <Input
                name="email"
                value={formData.email}
                onChange={onInputChange}
                valueState={formErrors.email ? ValueState.Error : ValueState.None}
                valueStateMessage={formErrors.email}
                placeholder="Ej: contacto@empresa.com"
                style={{ width: '100%' }}
              />
            </FormItem>

            <FormItem
              style={{ margin: 0 }}
              label={
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <Text style={{ 
                      fontWeight: '600',
                      color: '#32363a',
                      fontSize: '0.875rem'
                    }}>
                      Teléfono
                    </Text>
                    <Text style={{ 
                      color: '#bb0000',
                      marginLeft: '0.25rem'
                    }}>*</Text>
                  </div>
                  <Text style={{ 
                    fontSize: '0.75rem',
                    color: '#6a6d70',
                    lineHeight: '1.3'
                  }}>
                    Número de teléfono con código de país (ej: +52, +1, +34)
                  </Text>
                </div>
              }
            >
              <Input
                name="telefono"
                value={formData.telefono}
                onChange={onInputChange}
                valueState={formErrors.telefono ? ValueState.Error : ValueState.None}
                valueStateMessage={formErrors.telefono}
                placeholder="+52 55 1234 5678 o +1 555 123 4567"
                style={{ width: '100%' }}
              />
            </FormItem>

            <FormItem
              style={{ margin: 0 }}
              label={
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <Text style={{ 
                      fontWeight: '600',
                      color: '#32363a',
                      fontSize: '0.875rem'
                    }}>
                      Dirección
                    </Text>
                    <Text style={{ 
                      color: '#bb0000',
                      marginLeft: '0.25rem'
                    }}>*</Text>
                  </div>
                  <Text style={{ 
                    fontSize: '0.75rem',
                    color: '#6a6d70',
                    lineHeight: '1.3'
                  }}>
                    Dirección completa incluyendo calle, número, colonia, ciudad y estado
                  </Text>
                </div>
              }
            >
              <Input
                name="direccion"
                value={formData.direccion}
                onChange={onInputChange}
                valueState={formErrors.direccion ? ValueState.Error : ValueState.None}
                valueStateMessage={formErrors.direccion}
                placeholder="Ej: Calle Industria 123, Col. Centro, Ciudad de México"
                style={{ width: '100%' }}
              />
            </FormItem>

            <FormItem
              style={{ margin: 0 }}
              label={
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <Text style={{ 
                      fontWeight: '600',
                      color: '#32363a',
                      fontSize: '0.875rem'
                    }}>
                      Tipo de Proveedor
                    </Text>
                  </div>
                  <Text style={{ 
                    fontSize: '0.75rem',
                    color: '#6a6d70',
                    lineHeight: '1.3'
                  }}>
                    Seleccione la categoría que mejor describe al proveedor
                  </Text>
                </div>
              }
            >
              <Select
                name="tipo"
                value={formData.tipo}
                onChange={(e) => onInputChange({ target: { name: 'tipo', value: e.target.value } })}
                style={{ width: '100%' }}
              >
                {/* Manejar tanto estructura de API como array directo */}
                {(() => {
                  const tipos = tiposProveedores?.data || tiposProveedores || [];
                  
                  return tipos.map((tipo, index) => (
                    <Option key={`tipo-${index}`} value={tipo}>
                      {formatTipoNombre(tipo)}
                    </Option>
                  ));
                })()}
              </Select>
            </FormItem>

            <FormItem
              style={{ margin: 0 }}
              label={
                <div style={{ marginBottom: '0.5rem' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    marginBottom: '0.25rem'
                  }}>
                    <Text style={{ 
                      fontWeight: '600',
                      color: '#32363a',
                      fontSize: '0.875rem'
                    }}>
                      Tipo de Pago
                    </Text>
                  </div>
                  <Text style={{ 
                    fontSize: '0.75rem',
                    color: '#6a6d70',
                    lineHeight: '1.3'
                  }}>
                    Método de pago preferido para transacciones
                  </Text>
                </div>
              }
            >
              <Select
                name="tipoPago"
                value={formData.tipoPago}
                onChange={(e) => onInputChange({ target: { name: 'tipoPago', value: e.target.value } })}
                style={{ width: '100%' }}
              >
                {/* Manejar tanto estructura de API como array directo */}
                {(() => {
                  const tiposPago = tiposPagos?.data || tiposPagos || [];
                  
                  return tiposPago.map((tipoPago, index) => (
                    <Option key={`tipoPago-${index}`} value={tipoPago}>
                      {formatTipoPagoNombre(tipoPago)}
                    </Option>
                  ));
                })()}
              </Select>
            </FormItem>
          </Form>

          {formErrors.general && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#ffeaea',
              border: '1px solid #ffd7d7',
              borderRadius: '0.25rem'
            }}>
              <Text style={{
                color: '#ab1f1f',
                fontSize: '0.875rem',
                fontWeight: '500',
                display: 'block'
              }}>
                {formErrors.general}
              </Text>
            </div>
          )}

          {Object.keys(formErrors).filter(key => key !== 'general').length > 0 && (
            <div style={{
              marginTop: '1.5rem',
              padding: '1rem',
              backgroundColor: '#ffeaea',
              border: '1px solid #ffd7d7',
              borderRadius: '0.25rem'
            }}>
              <Text style={{
                color: '#ab1f1f',
                fontSize: '0.875rem',
                fontWeight: '500',
                marginBottom: '0.5rem',
                display: 'block'
              }}>
                Por favor, corrija los siguientes errores:
              </Text>
              <ul style={{ 
                margin: '0', 
                paddingLeft: '1.25rem',
                color: '#ab1f1f',
                fontSize: '0.8125rem'
              }}>
                {Object.entries(formErrors)
                  .filter(([key]) => key !== 'general')
                  .map(([field, error]) => (
                    <li key={field} style={{ marginBottom: '0.25rem' }}>
                      <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong> {error}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div style={{
          padding: '1rem 1.5rem',
          borderTop: '1px solid #e0e0e0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.75rem'
        }}>
          <Button 
            design="Transparent" 
            onClick={onClose}
            style={{ minWidth: '5rem' }}
          >
            Cancelar
          </Button>
          <Button 
            design="Emphasized" 
            onClick={onAddProveedor}
            style={{ 
              minWidth: '5rem',
              backgroundColor: '#0854a0',
              color: 'white'
            }}
          >
            Agregar
          </Button>
        </div>
      </div>
    </>
  );
};

export default AddProveedorDialog; 