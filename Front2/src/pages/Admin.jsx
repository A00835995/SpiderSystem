import React, { useState, useEffect, useRef } from 'react';
import {
  Title,
  Text,
  Button,
  Dialog,
  Input,
  Form,
  FormItem,
  Icon,
  Select,
  Option,
  Avatar,
  FlexBox,
  Card,
  Toast
} from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';
import "@ui5/webcomponents-icons/dist/AllIcons.js";

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const fileInputRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    estado: 'Activo'
  });

  useEffect(() => {
    // Simulación de carga de datos
    setTimeout(() => {
      setUsuarios([
        {
          id: 1,
          nombre: 'Emilio Vidal',
          email: 'emilio@spidershoes.com',
          rol: 'Dueño',
          estado: 'Activo',
          ultimoAcceso: '2024-03-15 14:30:00',
          foto: null
        },
        {
          id: 2,
          nombre: 'Alejandro Charles',
          email: 'alex@spidershoes.com',
          rol: 'Administrador',
          estado: 'Activo',
          ultimoAcceso: '2024-03-14 10:15:00',
          foto: null
        },
        {
          id: 3,
          nombre: 'Mauricio Perea',
          email: 'mauricio@spidershoes.com',
          rol: 'Analista',
          estado: 'Activo',
          ultimoAcceso: '2024-03-13 16:45:00',
          foto: null
        },
        {
          id: 4,
          nombre: 'Nike México',
          email: 'nike@provider.com',
          rol: 'Proveedor',
          estado: 'Activo',
          ultimoAcceso: '2024-03-12 09:30:00',
          foto: null
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddUsuario = () => {
    setSelectedUsuario(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: '',
      estado: 'Activo'
    });
    setShowDialog(true);
  };

  const handleEditUsuario = (usuario) => {
    setSelectedUsuario(usuario);
    setFormData({
      ...usuario,
      password: ''
    });
    setShowDialog(true);
  };

  const handleDeleteUsuario = (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const handleSaveUsuario = () => {
    if (!formData.nombre || !formData.email || (!selectedUsuario && !formData.password) || !formData.rol) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    if (selectedUsuario) {
      // Actualizar usuario existente
      setUsuarios(usuarios.map(u => 
        u.id === selectedUsuario.id ? { ...u, ...formData } : u
      ));
    } else {
      // Agregar nuevo usuario
      const newUsuario = {
        id: usuarios.length + 1,
        ...formData,
        ultimoAcceso: 'Nunca'
      };
      setUsuarios([...usuarios, newUsuario]);
    }
    setShowDialog(false);
  };

  const getRolColor = (rol) => {
    switch (rol) {
      case 'Dueño':
        return 'var(--sapIndicationColor_1)';
      case 'Administrador':
        return 'var(--sapIndicationColor_3)';
      case 'Analista':
        return 'var(--sapIndicationColor_4)';
      case 'Proveedor':
        return 'var(--sapIndicationColor_6)';
      default:
        return 'var(--sapIndicationColor_5)';
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handlePhotoClick = (usuario) => {
    if (usuario.rol === 'Dueño' && !selectedUsuario) {
      setToastMessage('No tienes permisos para editar la foto del Dueño');
      setShowToast(true);
      return;
    }
    setSelectedUsuario(usuario);
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (file && selectedUsuario) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUsuarios(usuarios.map(u => 
          u.id === selectedUsuario.id 
            ? { ...u, foto: reader.result }
            : u
        ));
        setSelectedUsuario(null);
      };
      reader.readAsDataURL(file);
    }
    // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
    event.target.value = '';
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
      <Toast
        open={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      >
        {toastMessage}
      </Toast>

      {/* Input file oculto para fotos */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handlePhotoChange}
      />

      {/* Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        backgroundColor: "var(--sapBackgroundColor)",
        padding: "1.25rem",
        borderRadius: "0.5rem",
        boxShadow: "var(--sapContent_Shadow0)",
        marginTop: "0.5rem",
        minHeight: "72px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem"
        }}>
          <Icon 
            name="customer" 
            style={{
              fontSize: "1.75rem",
              color: "var(--sapContent_IconColor)"
            }}
          />
          <Title level="H1" style={{
            margin: 0,
            fontSize: "1.75rem",
            color: "var(--sapTextColor)",
            padding: "0.25rem 0"
          }}>
            Gestión de Usuarios
          </Title>
        </div>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}>
          <Button
            icon="add"
            design="Emphasized"
            onClick={handleAddUsuario}
          >
            Crear Usuario
          </Button>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem"
          }}>
            <Icon 
              name="map" 
              style={{
                fontSize: "1rem",
                color: "var(--sapContent_IconColor)"
              }}
            />
            <Text style={{
              fontSize: "0.875rem",
              color: "var(--sapContent_LabelColor)"
            }}>
              Plaza Comercial Reforma, Local 42B, CDMX
            </Text>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        backgroundColor: 'var(--sapList_Background)',
        margin: '0 2rem 2rem',
        borderRadius: '0.5rem',
        boxShadow: 'var(--sapContent_Shadow0)',
        overflow: 'hidden'
      }}>
        <div style={{ 
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {loading ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '2rem',
              gridColumn: '1 / -1'
            }}>
              <Icon name="loading" />
              <Text>Cargando usuarios...</Text>
            </div>
          ) : (
            usuarios.map(usuario => (
              <Card
                key={usuario.id}
                style={{
                  padding: '1.5rem',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  cursor: 'pointer',
                  ':hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'var(--sapContent_Shadow2)'
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem'
                }}>
                  {/* Header de la tarjeta */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div 
                      style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        overflow: 'hidden',
                        backgroundColor: getRolColor(usuario.rol),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'opacity 0.2s'
                      }}
                      onClick={() => handlePhotoClick(usuario)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    >
                      {usuario.foto ? (
                        <>
                          <img 
                            src={usuario.foto} 
                            alt={usuario.nombre}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            ':hover': {
                              opacity: 1
                            }
                          }}>
                            <Icon 
                              name="camera" 
                              style={{
                                color: 'white',
                                fontSize: '1.5rem'
                              }}
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          <Text style={{
                            color: 'white',
                            fontSize: '1.75rem',
                            fontWeight: 'bold'
                          }}>
                            {getInitials(usuario.nombre)}
                          </Text>
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            ':hover': {
                              opacity: 1
                            }
                          }}>
                            <Icon 
                              name="camera" 
                              style={{
                                color: 'white',
                                fontSize: '1.5rem'
                              }}
                            />
                          </div>
                        </>
                      )}
                      <div style={{
                        position: 'absolute',
                        bottom: '0',
                        right: '0',
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--sapContent_Shadow0)'
                      }}>
                        <Icon 
                          name={
                            usuario.rol === 'Dueño' ? 'key-user-settings' :
                            usuario.rol === 'Administrador' ? 'employee-approvals' :
                            usuario.rol === 'Analista' ? 'business-objects-experience' :
                            usuario.rol === 'Proveedor' ? 'supplier' :
                            'customer'
                          }
                          style={{
                            fontSize: '0.875rem',
                            color: getRolColor(usuario.rol)
                          }}
                        />
                      </div>
                    </div>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem'
                    }}>
                      <Title level="H3" style={{
                        margin: 0,
                        fontSize: '1.25rem'
                      }}>
                        {usuario.nombre}
                      </Title>
                      <Text style={{
                        color: 'var(--sapContent_LabelColor)',
                        fontSize: '0.875rem'
                      }}>
                        {usuario.email}
                      </Text>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '0.25rem'
                      }}>
                        <div style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          backgroundColor: getRolColor(usuario.rol),
                          color: 'white',
                          fontSize: '0.75rem',
                          fontWeight: 'bold'
                        }}>
                          {usuario.rol}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Acciones */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '0.5rem',
                    marginTop: '1rem',
                    borderTop: '1px solid var(--sapContent_ForegroundBorderColor)',
                    paddingTop: '1rem'
                  }}>
                    <Button
                      icon="edit"
                      design="Transparent"
                      onClick={() => handleEditUsuario(usuario)}
                      tooltip="Editar usuario"
                    >
                      Editar
                    </Button>
                    {usuario.rol !== 'Dueño' && (
                      <Button
                        icon="delete"
                        design="Transparent"
                        onClick={() => handleDeleteUsuario(usuario.id)}
                        tooltip="Eliminar usuario"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Dialog para crear/editar usuario */}
      <Dialog
        open={showDialog}
        onAfterClose={() => setShowDialog(false)}
        headerText={selectedUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        style={{ width: '400px' }}
      >
        <Form style={{ padding: '1rem' }}>
          <FormItem label="Nombre Completo">
            <Input
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Juan Pérez"
              required
            />
          </FormItem>
          <FormItem label="Correo Electrónico">
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="correo@spidershoes.com"
              type="Email"
              required
            />
          </FormItem>
          {!selectedUsuario && (
            <FormItem label="Contraseña">
              <Input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                type="Password"
                required
              />
            </FormItem>
          )}
          <FormItem label="Rol">
            <Select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.detail.selectedOption.value })}
            >
              <Option value="Analista">Analista</Option>
              <Option value="Administrador">Administrador</Option>
              <Option value="Proveedor">Proveedor</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          padding: '0.5rem'
        }}>
          <Button onClick={() => setShowDialog(false)}>Cancelar</Button>
          <Button design="Emphasized" onClick={handleSaveUsuario}>
            {selectedUsuario ? 'Guardar Cambios' : 'Crear Usuario'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default Admin; 