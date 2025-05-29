import React from 'react';

const StatusIndicator = ({ status }) => {
  const statusColors = {
    online: "#22c55e",
    away: "#f59e0b",
    offline: "#94a3b8"
  };
  return (
    <div style={{ 
      width: "10px", 
      height: "10px", 
      borderRadius: "50%", 
      backgroundColor: statusColors[status] || statusColors.offline,
      marginLeft: "8px",
      boxShadow: `0 0 0 2px white, 0 0 0 3px ${statusColors[status] || statusColors.offline}`
    }} />
  );
};

export default StatusIndicator; 