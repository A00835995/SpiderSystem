import React, { useState } from 'react';
import {
  Card,
  Title,
  Text,
  Button,
  FlexBox,
  FlexBoxJustifyContent,
  FlexBoxAlignItems,
  Icon,
  ObjectStatus,
  ValueState,
  Label
} from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';
import UserAvatar from '../components/common/UserAvatar';

const Cuenta = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser.name;
    const userEmail = storedUser.email;
    const userRol = storedUser.role;
    const userRolN = userRol === 1 ? "ADMIN" : "USUARIO";

  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const [userData, setUserData] = useState({
    nombre: userName,
    email: userEmail,
    rol: userRolN,
  });

  const handleLogout = () => { 
    // Limpiar localStorage manualmente
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login
    navigate("/");
    
    // Recargar la página para limpiar completamente el estado
    window.location.reload();
  };

  return (
    <div style={{ 
      padding: '1.5rem', 
      paddingTop: '6rem', // Espacio para el header fijo
      maxWidth: '100%',
      boxSizing: 'border-box',
      background: '#f5f5f5'
    }}>
      <Title level="H1" style={{ marginBottom: '1.5rem', color: '#333' }}>Mi Cuenta</Title>

      <Card style={{ 
        marginTop: '1rem', 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        borderRadius: '8px' 
      }}>
        <div style={{ padding: '1.5rem' }}>
          <FlexBox justifyContent={FlexBoxJustifyContent.SpaceBetween} alignItems={FlexBoxAlignItems.Center}>
            <FlexBox alignItems={FlexBoxAlignItems.Center}>
              <UserAvatar 
                nombre={userData.nombre}
                rol={userData.rol}
                size="xlarge"
                style={{ marginRight: '1.5rem' }}
              />
              <div>
                <Title level="H2">{userData.nombre}</Title>
                <Text style={{ fontSize: '1rem', color: '#666' }}>{userData.email}</Text>
              </div>
            </FlexBox>
          </FlexBox>

          <div style={{ marginTop: '2.5rem' }}>
            <FlexBox direction="Column" style={{ gap: '1.5rem' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', paddingBottom: '0.75rem' }}>
                <Label style={{ width: '150px', fontWeight: 'bold' }}>Rol:</Label>
                <Text>{userData.rol}</Text>
              </div>
            </FlexBox>
          </div>

          <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              onClick={handleLogout} 
              icon="log" 
              design="Negative"
              style={{ 
                backgroundColor: '#bb0000',
                color: 'white',
                padding: '0.5rem 1rem',
                height: 'auto'
              }}
            >
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Cuenta; 