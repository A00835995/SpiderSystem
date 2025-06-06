import React from 'react';
import { Text } from '@ui5/webcomponents-react';

// Función para obtener color basado en rol
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

// Función para generar iniciales
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
};

/**
 * Componente de Avatar de Usuario
 * @param {Object} props
 * @param {string} props.nombre - Nombre del usuario
 * @param {string} props.rol - Rol del usuario  
 * @param {string} props.size - Tamaño del avatar ('small', 'medium', 'large')
 * @param {string} props.imageUrl - URL de imagen personalizada (opcional)
 * @param {Object} props.style - Estilos adicionales
 */
const UserAvatar = ({ 
  nombre, 
  rol, 
  size = 'medium', 
  imageUrl = null, 
  style = {} 
}) => {
  // Definir tamaños
  const sizes = {
    small: { width: '40px', height: '40px', fontSize: '1rem' },
    medium: { width: '60px', height: '60px', fontSize: '1.5rem' },
    large: { width: '80px', height: '80px', fontSize: '2rem' },
    xlarge: { width: '120px', height: '120px', fontSize: '3rem' }
  };

  const avatarSize = sizes[size] || sizes.medium;

  const avatarStyle = {
    width: avatarSize.width,
    height: avatarSize.height,
    minWidth: avatarSize.width,
    minHeight: avatarSize.height,
    borderRadius: '50%',
    overflow: 'hidden',
    backgroundColor: getRolColor(rol),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0,
    border: '2px solid var(--sapContent_ForegroundBorderColor)',
    ...style
  };

  // Si hay imagen personalizada, mostrarla
  if (imageUrl) {
    return (
      <div style={avatarStyle}>
        <img 
          src={imageUrl}
          alt={`Avatar de ${nombre}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
          onError={(e) => {
            // Si la imagen falla, mostrar las iniciales
            e.target.style.display = 'none';
          }}
        />
        {/* Fallback con iniciales si la imagen falla */}
        <Text style={{
          color: 'white',
          fontSize: avatarSize.fontSize,
          fontWeight: 'bold',
          lineHeight: 1,
          position: 'absolute'
        }}>
          {getInitials(nombre)}
        </Text>
      </div>
    );
  }

  // Avatar con iniciales
  return (
    <div style={avatarStyle}>
      <Text style={{
        color: 'white',
        fontSize: avatarSize.fontSize,
        fontWeight: 'bold',
        lineHeight: 1
      }}>
        {getInitials(nombre)}
      </Text>
    </div>
  );
};

export default UserAvatar; 