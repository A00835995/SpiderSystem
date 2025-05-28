import { useState, useEffect, useCallback } from 'react';
import { usePermisos } from '../contexts/PermisosContext';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const { cargarPermisos } = usePermisos();

  // Inicializar autenticación desde localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(userData);
          setIsAuthenticated(true);

          // Cargar permisos si el usuario tiene rol
          if (userData.role) {
            try {
              await cargarPermisos(userData.role);
            } catch (error) {
              console.warn('No se pudieron cargar los permisos, pero el usuario sigue autenticado:', error);
              // No fallar la autenticación si no se pueden cargar los permisos
            }
          }
        } else {
          // Si no hay datos de autenticación, limpiar permisos sin hacer petición al servidor
          try {
            await cargarPermisos(null);
          } catch (error) {
            console.warn('Error al limpiar permisos:', error);
            // Continuar sin fallar
          }
        }
      } catch (error) {
        console.error('Error al inicializar autenticación:', error);
        // Limpiar datos corruptos
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        try {
          await cargarPermisos(null);
        } catch (permisosError) {
          console.warn('Error al limpiar permisos después de error de inicialización:', permisosError);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []); // Remover cargarPermisos de las dependencias para evitar el bucle

  // Función para hacer login
  const login = async (userData, tokenData) => {
    try {
      localStorage.setItem('token', tokenData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setToken(tokenData);
      setUser(userData);
      setIsAuthenticated(true);

      // Cargar permisos
      if (userData.role) {
        try {
          await cargarPermisos(userData.role);
        } catch (error) {
          console.warn('No se pudieron cargar los permisos después del login:', error);
          // No fallar el login si no se pueden cargar los permisos
        }
      }

      return true;
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    }
  };

  // Función para hacer logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    // Intentar limpiar permisos, pero no fallar si hay error
    try {
      cargarPermisos(null);
    } catch (error) {
      console.warn('Error al limpiar permisos en logout:', error);
    }
  };

  // Función para actualizar datos del usuario
  const updateUser = async (newUserData) => {
    try {
      localStorage.setItem('user', JSON.stringify(newUserData));
      setUser(newUserData);

      // Recargar permisos si cambió el rol
      if (newUserData.role !== user?.role) {
        try {
          await cargarPermisos(newUserData.role);
        } catch (error) {
          console.warn('No se pudieron recargar los permisos después de actualizar usuario:', error);
        }
      }

      return true;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      return false;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    login,
    logout,
    updateUser
  };
}; 