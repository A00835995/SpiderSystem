import { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';

export const useAdminLogic = () => {
  const { 
    usuarios, 
    loading, 
    error,
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

  useEffect(() => {
    if (error) {
      setToastMessage(`Error: ${error}`);
    setShowToast(true);
    }
  }, [error]);

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

  const handleDeleteUsuario = (userId) => {
    setUserIdToDelete(userId);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
      try {
        await eliminarUsuario(userIdToDelete);
      setToastMessage('Usuario eliminado correctamente');
      setShowToast(true);
      } catch (error) {
      setToastMessage(`Error al eliminar usuario: ${error.message}`);
      setShowToast(true);
      } finally {
        setShowConfirmDialog(false);
        setUserIdToDelete(null);
      }
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.nombre.trim()) {
      setToastMessage('El nombre es requerido');
      setShowToast(true);
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      setToastMessage('El email no es válido');
      setShowToast(true);
      return false;
    }
    if (!selectedUsuario && !formData.password) {
      setToastMessage('La contraseña es requerida para nuevos usuarios');
      setShowToast(true);
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      if (selectedUsuario) {
        // Actualizar usuario existente
          await actualizarNombreUsuario(selectedUsuario.id, formData.nombre);
          await actualizarEmailUsuario(selectedUsuario.id, formData.email);
          await actualizarRolUsuario(selectedUsuario.id, formData.rol);
        setToastMessage('Usuario actualizado correctamente');
      } else {
        // Crear nuevo usuario
        await crearUsuario({
          nombre: formData.nombre,
          email: formData.email, 
          password: formData.password,
          rol: formData.rol
        });
        setToastMessage('Usuario creado correctamente');
      }
      setShowToast(true);
      setShowDialog(false);
    } catch (error) {
      setToastMessage(`Error: ${error.message}`);
      setShowToast(true);
    }
  };

  const getRolColor = (rol) => {
    const colors = {
      'DUEÑO': 'var(--sapIndicationColor_1)',
      'ADMIN': 'var(--sapIndicationColor_3)',
      'ANALISTA': 'var(--sapIndicationColor_4)',
      'PROVEEDOR': 'var(--sapIndicationColor_6)',
      'OTRO': 'var(--sapIndicationColor_5)'
    };
    return colors[rol] || colors['OTRO'];
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
    usuarios,
    loading,
    error,
    showDialog,
    selectedUsuario,
    showToast,
    toastMessage,
    showConfirmDialog,
    userIdToDelete,
    formData,
    setFormData,
    handleAddUsuario,
    handleEditUsuario,
    handleDeleteUsuario,
    handleConfirmDelete,
    handleSave,
    getRolColor,
    getInitials
  };
};