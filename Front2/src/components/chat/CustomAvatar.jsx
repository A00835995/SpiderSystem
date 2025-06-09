import React from 'react';
import { Avatar } from '@ui5/webcomponents-react';
import { getInitial } from './utils';

const CustomAvatar = ({ user, size = "S", style = {} }) => {
  const initial = getInitial(user.nombre);
  return (
    <Avatar 
      style={style}
      size={size}
      backgroundColor="Accent8"
    >
      {initial}
    </Avatar>
  );
};

export default CustomAvatar; 