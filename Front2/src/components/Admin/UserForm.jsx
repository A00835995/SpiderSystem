import React, { useEffect, useState } from 'react';
import {
  Dialog,
  Form,
  FormItem,
  Input,
  Select,
  Option,
  Button,
  Toast,
  MessageStrip
} from '@ui5/webcomponents-react';

const UserForm = ({ 
  showDialog,
  onClose,
  formData,
  setFormData,
  selectedUsuario,
  onSave,
  showToast,
  setShowToast,
  toastMessage
}) => {
  // Estados locales para los errores
  const [nombreError, setNombreError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Funciones de validación
  const validateNombre = (nombre) => {
    if (nombre === '') {
      setNombreError('El nombre no puede estar vacío');
      return false;
    } else if (nombre && nombre.trim() === '') {
      setNombreError('El nombre no puede contener solo espacios');
      return false;
    } else {
      setNombreError('');
      return true;
    }
  };

  const validateEmail = (email) => {
    if (email === '') {
      setEmailError('');
      return true; 
    } else if (!email.includes('@')) {
      setEmailError('El correo electrónico debe contener @');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = (password) => {
    if (!selectedUsuario) {
      if (!password) {
        setPasswordError('La contraseña no puede estar vacía');
        return false;
      } else if (password.length < 8) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres');
        return false;
      }
    }
    setPasswordError('');
    return true;
  };

  // Función para validar todo el formulario cuando se hace clic en Guardar
  const validateFormOnSave = () => {
    const isNombreValid = validateNombre(formData.nombre);
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = validatePassword(formData.password);
    
    // También validar campos vacíos explícitamente
    if (formData.email === '') {
      setEmailError('El correo electrónico no puede estar vacío');
      return false;
    }
    
    return isNombreValid && isEmailValid && isPasswordValid;
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      email: '',
      password: '',
    });
    setNombreError('');
    setEmailError('');
    setPasswordError('');
    onClose();
  };

  // Manejador para el botón de Guardar
  const handleSave = () => {
    if (validateFormOnSave()) {
      onSave();
    }
  };

 
  const errorMessageStyle = {
    marginTop: '0rem',       
    width: '100%',            
    display: 'block',         
    textAlign: 'left',         
    position: 'relative',      
    left: '0',
  };

  return (
    <>
      <Dialog
        open={showDialog}
        onClose={handleClose}
        headerText={selectedUsuario ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
        style={{ width: '400px' }}
      >
        <Form style={{ padding: '1rem'}}>
          
          <FormItem label="Nombre Completo">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
            }}>
                {nombreError && (
                <MessageStrip 
                    design="Negative" 
                    style={errorMessageStyle}
                >
                    {nombreError}
                </MessageStrip>
                )}
                <Input
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Juan Pérez"
                required
                valueState={nombreError ? "Error" : "None"}
                valueStateMessage={nombreError}
                />
            </div>
            
          </FormItem>
          
          <FormItem label="Correo Electrónico">
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
            }}>
                {emailError && (
                <MessageStrip 
                    design="Negative" 
                    style={errorMessageStyle}
                >
                    {emailError}
                </MessageStrip>
                )}
                <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="correo@spidershoes.com"
                type="Email"
                required
                valueState={emailError ? "Error" : "None"}
                valueStateMessage={emailError}
                />
            </div>
          </FormItem>
          
          {!selectedUsuario && (
            <FormItem label="Contraseña">
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                }}>
                    {passwordError && (
                        <MessageStrip 
                        design="Negative" 
                        style={errorMessageStyle}
                        >
                        {passwordError}
                    </MessageStrip>
                )}
                <Input
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Mínimo 8 caracteres"
                type="Password"
                required
                valueState={passwordError ? "Error" : "None"}
                valueStateMessage={passwordError}
                />
            </div>
            </FormItem>
          )}
          
          <FormItem label="Rol">
            <Select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.detail.selectedOption.value })}
              dialogMode="popover"
            >
              <Option value="ANALISTA">Analista</Option>
              <Option value="ADMIN">Administrador</Option>
              <Option value="PROVEEDOR">Proveedor</Option>
              <Option value="DUEÑO">Dueño</Option>
            </Select>
          </FormItem>
        </Form>
        <div slot="footer" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '0.5rem',
          padding: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <Button design="Transparent" onClick={handleClose}>Cancelar</Button>
          <Button 
            design="Emphasized" 
            onClick={handleSave}
          >
            Guardar
          </Button>
        </div>
      </Dialog>
      
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      >
        {toastMessage}
      </Toast>
    </>
  );
};

export default UserForm; 