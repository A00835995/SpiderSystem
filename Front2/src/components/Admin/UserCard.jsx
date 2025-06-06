import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  Text,
  Title,
  Button
} from '@ui5/webcomponents-react';
import UserAvatar from '../common/UserAvatar';

const UserCard = ({ 
  usuario, 
  onEdit, 
  onDelete, 
  getRolColor, 
  getInitials 
}) => {
  return (
    <Card
      style={{
        padding: '1rem',
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
        gap: '1rem',
        padding: '0.5rem'
      }}>
        {/* Header de la tarjeta */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}>
          <UserAvatar 
            nombre={usuario.nombre}
            rol={usuario.rol}
            size="medium"
          />
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
          marginTop: '0.5rem',
          borderTop: '1px solid var(--sapContent_ForegroundBorderColor)',
          paddingTop: '1rem'
        }}>
          <Button
            icon="edit"
            design="Transparent"
            onClick={() => onEdit(usuario)}
            tooltip="Editar usuario"
          >
            Editar
          </Button>
          {
            <Button
              icon="delete"
              design="Transparent"
              onClick={() => onDelete(usuario.id)}
              tooltip="Eliminar usuario"
            >
              Eliminar
            </Button>
          }
        </div>
      </div>
    </Card>
  );
};

UserCard.propTypes = {
  usuario: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    nombre: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    rol: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  getRolColor: PropTypes.func.isRequired,
  getInitials: PropTypes.func.isRequired
};

export default UserCard; 