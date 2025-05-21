import { useState } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

const useAdminLogic = () => {
  const { 
    usuarios, 
    loading, 
    error: apiError, 
    getUsuario, 
    crearUsuario, 
    actualizarRolUsuario, 
    actualizarNombreUsuario, 
    actualizarEmailUsuario, 
    eliminarUsuario 
  } = useAdmin();
  
  const [showDialog, setShowDialog] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    rol: '',
    estado: 'Activo'
  });

  // Función para mostrar mensajes en el Toast
  const showMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    // Asegurarse de que el Toast sea visible por un tiempo suficiente
    setTimeout(() => {
      setShowToast(false);
    }, 4000);
  };

  const handleAddUsuario = () => {
    setSelectedUsuario(null);
    setFormData({
      nombre: '',
      email: '',
      password: '',
      rol: 'ANALISTA',
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
    setUserIdToDelete(id);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (userIdToDelete) {
      try {
        await eliminarUsuario(userIdToDelete);
        showMessage('Usuario eliminado correctamente');
      } catch (error) {
        showMessage(`Error al eliminar: ${error.message}`);
      } finally {
        setShowConfirmDialog(false);
        setUserIdToDelete(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setUserIdToDelete(null);
  };

  const validateEmail = (email) => {
    if (!email || email.trim() === '') {
      return 'El correo electrónico no puede estar vacío';
    }
    
    if (!email.includes('@')) {
      return 'El correo electrónico debe contener el símbolo @';
    }
    
    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return 'Formato de correo electrónico inválido';
    }
    
    return '';
  };

  const validateNombre = (nombre) => {
    // Verificar si es null, undefined o vacío
    if (!nombre) {
      return 'El nombre no puede estar vacío';
    }
    
    // Verificar si después de quitar espacios queda vacío
    if (nombre.trim() === '') {
      return 'El nombre no puede contener solo espacios';
    }
    
    return '';
  };

  const validateForm = () => {
    // Validar nombre
    const nombreError = validateNombre(formData.nombre);
    if (nombreError) {
      console.log("Error de validación en nombre:", nombreError, "Valor:", formData.nombre);
      showMessage(nombreError);
      return false;
    }

    // Validar correo electrónico
    const emailError = validateEmail(formData.email);
    if (emailError) {
      console.log("Error de validación en email:", emailError);
      showMessage(emailError);
      return false;
    }

    // Validar contraseña (solo para creación de usuario nuevo)
    if (!selectedUsuario) {
      if (!formData.password) {
        console.log("Error: Contraseña vacía");
        showMessage('La contraseña no puede estar vacía');
        return false;
      }
      
      if (formData.password.length < 8) {
        console.log("Error: Contraseña demasiado corta");
        showMessage('La contraseña debe tener al menos 8 caracteres');
        return false;
      }
    }

    // Validar que se seleccionó un rol
    if (!formData.rol) {
      console.log("Error: Rol no seleccionado");
      showMessage('Debes seleccionar un rol para el usuario');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    // Mostrar que estamos validando
    console.log("Validando formulario...", formData);
    
    if (!validateForm()) {
      console.log("Validación fallida");
      return;
    }
    
    console.log("Formulario válido, guardando...");

    try {
      if (selectedUsuario) {
        // Actualizar usuario existente
        if (formData.nombre !== selectedUsuario.nombre) {
          await actualizarNombreUsuario(selectedUsuario.id, formData.nombre);
        }
        
        if (formData.email !== selectedUsuario.email) {
          await actualizarEmailUsuario(selectedUsuario.id, formData.email);
        }
        
        if (formData.rol !== selectedUsuario.rol) {
          await actualizarRolUsuario(selectedUsuario.id, formData.rol);
        }
        
        showMessage('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await crearUsuario({
          nombre: formData.nombre,
          email: formData.email, 
          password: formData.password,
          rol: formData.rol
        });
        showMessage('Usuario creado correctamente');
      }
      
      setShowDialog(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      showMessage(error.message || 'Error al guardar el usuario');
    }
  };

  const getRolColor = (rol) => {
    const rolUpperCase = typeof rol === 'string' ? rol.toUpperCase() : '';
    
    switch (rolUpperCase) {
      case 'DUEÑO':
        return 'var(--sapIndicationColor_1)';
      case 'ADMIN':
        return 'var(--sapIndicationColor_3)';
      case 'ANALISTA':
        return 'var(--sapIndicationColor_4)';
      case 'PROVEEDOR':
        return 'var(--sapIndicationColor_6)';
      default:
        return 'var(--sapIndicationColor_5)';
    }
  };

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  return {
    loading,
    error: apiError,
    usuarios,
    showDialog,
    setShowDialog,
    selectedUsuario,
    showToast,
    setShowToast,
    toastMessage,
    formData,
    setFormData,
    handleAddUsuario,
    handleEditUsuario,
    handleDeleteUsuario,
    handleSave,
    getRolColor,
    getInitials,
    showConfirmDialog,
    handleConfirmDelete,
    handleCancelDelete
  };
};

export default useAdminLogic; 