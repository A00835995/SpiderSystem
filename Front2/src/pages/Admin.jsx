import React from 'react';
import {
  Toast,
  Dialog,
  Button,
  Bar,
  MessageBox
} from '@ui5/webcomponents-react';
import { useAdminLogic } from '../components/Admin/useAdminLogic';
import AdminHeader from '../components/Admin/AdminHeader';
import UserCard from '../components/Admin/UserCard';
import UserForm from '../components/Admin/UserForm';

const Admin = () => {
  const {
    loading,
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
  } = useAdminLogic();

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
        show={showToast}
        onClose={() => setShowToast(false)}
        duration={3000}
      >
        {toastMessage}
      </Toast>

      {/* Header */}
      <AdminHeader onAddUser={handleAddUsuario} />

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
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                Cargando...
              </div>
              <div>Cargando usuarios...</div>
            </div>
          ) : (
            usuarios.map(usuario => (
              <UserCard
                key={usuario.id}
                usuario={usuario}
                onEdit={handleEditUsuario}
                onDelete={handleDeleteUsuario}
                getRolColor={getRolColor}
                getInitials={getInitials}
              />
            ))
          )}
        </div>
      </div>

      {/* Formulario en Dialog */}
      <UserForm
        showDialog={showDialog}
        onClose={() => setShowDialog(false)}
        formData={formData}
        setFormData={setFormData}
        selectedUsuario={selectedUsuario}
        onSave={handleSave}
        showToast={showToast}
        setShowToast={setShowToast}
        toastMessage={toastMessage}
      />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCancelDelete}
        headerText="Confirmar eliminación"
      >
        <div style={{ padding: '1rem' }}>
          <p>¿Estás seguro de que deseas eliminar este usuario?</p>
        </div>
        <Bar design="Footer">
          <Button design="Emphasized" onClick={handleConfirmDelete}>Eliminar</Button>
          <Button design="Transparent" onClick={handleCancelDelete}>Cancelar</Button>
        </Bar>
      </Dialog>
    </div>
  );
};

export default Admin; 