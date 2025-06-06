import { useState, useEffect } from 'react';
import { API_CONFIG } from '../config/api';

export function useWebSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://${API_CONFIG.baseUrl.replace('http://', '')}/ws`);

    ws.onopen = () => {
      console.log('WebSocket conectado');
      setIsConnected(true);
    };

    ws.onclose = () => {
      console.log('WebSocket desconectado');
      setIsConnected(false);
    };

    ws.onerror = (error) => {
      console.error('Error en WebSocket:', error);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Mensaje WebSocket recibido:', data.type);
        setLastMessage(data);
      } catch (error) {
        console.error('Error al procesar mensaje:', error);
      }
    };

    // Limpiar al desmontar
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);

  return { isConnected, lastMessage };
} 