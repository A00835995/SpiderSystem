import React from 'react';
import { Text } from '@ui5/webcomponents-react';

const MessageContent = ({ message }) => {
  return (
    <Text style={{ color: message.isSent ? 'white' : 'inherit' }}>
      {message.text}
    </Text>
  );
};

export default MessageContent; 