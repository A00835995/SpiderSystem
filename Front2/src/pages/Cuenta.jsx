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
  Avatar,
  ObjectStatus,
  ValueState,
  Label
} from '@ui5/webcomponents-react';
import { useNavigate } from 'react-router-dom';

const Cuenta = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const userName = storedUser.name;
    const userEmail = storedUser.email;
    const userRol = storedUser.role;
    const userRolN = userRol === 1 ? "Administrador" : "Usuario";

  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  const [userData, setUserData] = useState({
    nombre: userName,
    email: userEmail,
    rol: userRolN,
    telefono: '555-0101',
    departamento: 'TI',
    ultimoAcceso: '2024-03-15 14:30:00'
  });

  const handleLogout = () => {
    // Aquí podrías agregar lógica para cerrar la sesión si es necesario
    // Por ahora, simplemente navegamos a la página de login
    navigate('/login');
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
              <Avatar size="XL" style={{ marginRight: '1.5rem', backgroundColor: '#0854a0' }}>
                <Icon name="employee" />
              </Avatar>
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
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', paddingBottom: '0.75rem' }}>
                <Label style={{ width: '150px', fontWeight: 'bold' }}>Teléfono:</Label>
                <Text>{userData.telefono}</Text>
              </div>
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e5e5', paddingBottom: '0.75rem' }}>
                <Label style={{ width: '150px', fontWeight: 'bold' }}>Departamento:</Label>
                <Text>{userData.departamento}</Text>
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