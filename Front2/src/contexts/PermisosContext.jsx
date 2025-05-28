import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchPaginasPermitidas, verificarPermiso } from '../services/PermisosService';

const PermisosContext = createContext();

export const usePermisos = () => {
  const context = useContext(PermisosContext);
  if (!context) {
    throw new Error('usePermisos debe ser usado dentro de un PermisosProvider');
  }
  return context;
};

export const PermisosProvider = ({ children }) => {
  const [paginasPermitidas, setPaginasPermitidas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  // Cargar permisos cuando cambie el rol del usuario
  const cargarPermisos = useCallback(async (idRol) => {
    if (!idRol) {
      setPaginasPermitidas([]);
      setUserRole(null);
      setLoading(false);
      setConnectionError(false);
      return;
    }

    try {
      setLoading(true);
      setConnectionError(false);
      const response = await fetchPaginasPermitidas(idRol);
      
      if (response.success) {
        // Los datos ya vienen formateados por el DTO
        setPaginasPermitidas(response.data);
        setUserRole(idRol);
        setConnectionError(false);
      } else {
        console.error('Error al cargar permisos:', response.message);
        setPaginasPermitidas([]);
        setConnectionError(true);
      }
    } catch (error) {
      console.error('Error al cargar permisos:', error);
      setPaginasPermitidas([]);
      setConnectionError(true);
      
      // Si es un error de conexión, no lanzar el error para evitar bucles
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
        console.warn('Backend no disponible, continuando sin permisos');
      } else {
        // Solo relanzar errores que no sean de conexión
        throw error;
      }
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias porque no usa ningún estado externo

  // Verificar si el usuario tiene permiso para una ruta específica
  const tienePermiso = useCallback((ruta) => {
    // Si hay error de conexión, permitir acceso por defecto (modo offline)
    if (connectionError) {
      console.warn('Verificando permisos en modo offline para ruta:', ruta);
      return true; // O false, dependiendo de tu política de seguridad
    }
    
    if (!paginasPermitidas || paginasPermitidas.length === 0) {
      return false;
    }
    
    // Usar la propiedad 'ruta' del DTO formateado
    return paginasPermitidas.some(pagina => pagina.ruta === ruta);
  }, [connectionError, paginasPermitidas]);

  // Verificar permiso de forma asíncrona (más precisa)
  const verificarPermisoAsync = useCallback(async (ruta) => {
    if (!userRole) {
      return false;
    }

    try {
      const response = await verificarPermiso(userRole, ruta);
      // La respuesta del DTO incluye la verificación en response.data.tienePermiso
      return response.success && response.data && response.data.tienePermiso;
    } catch (error) {
      console.error('Error al verificar permiso:', error);
      
      // Si hay error de conexión, usar verificación local
      if (error.message.includes('Failed to fetch') || error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
        console.warn('Usando verificación local de permisos para ruta:', ruta);
        return tienePermiso(ruta);
      }
      
      return false;
    }
  }, [userRole, tienePermiso]);

  // Obtener rutas permitidas para el sidebar
  const getRutasPermitidas = useCallback(() => {
    return paginasPermitidas.map(pagina => ({
      id: pagina.id,
      nombre: pagina.nombre,
      ruta: pagina.ruta
    }));
  }, [paginasPermitidas]);

  // Filtrar rutas del sidebar basado en permisos
  const filtrarRutasSidebar = useCallback((rutasCompletas) => {
    // Si hay error de conexión, mostrar todas las rutas (modo offline)
    if (connectionError) {
      console.warn('Mostrando todas las rutas en modo offline');
      return rutasCompletas; // O un subconjunto básico
    }
    
    if (!paginasPermitidas || paginasPermitidas.length === 0) {
      return [];
    }

    return rutasCompletas.filter(ruta => 
      paginasPermitidas.some(pagina => pagina.ruta === ruta.path)
    );
  }, [connectionError, paginasPermitidas]);

  const value = {
    paginasPermitidas,
    loading,
    userRole,
    connectionError,
    cargarPermisos,
    tienePermiso,
    verificarPermisoAsync,
    getRutasPermitidas,
    filtrarRutasSidebar
  };

  return (
    <PermisosContext.Provider value={value}>
      {children}
    </PermisosContext.Provider>
  );
}; 