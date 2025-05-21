import { API_CONFIG } from '../config/api';

/**
 * Servicio para gestionar las operaciones de administración de usuarios
 */
export async function fetchUsuarios() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.usuarios}`);
  if (!response.ok) {
    throw new Error('Error al obtener usuarios');
  }
  const json = await response.json();
  return json;
}

export async function fetchUsuario(id) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.usuario.replace(':id', id)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al obtener usuario con ID ${id}`);
  }
  const json = await response.json();
  return json;
}

export async function crearUsuario(userData) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.crearUsuario}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear usuario: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

export async function actualizarRolUsuario(id, rol) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarRolUsuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, rol })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar rol: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

export async function actualizarNombreUsuario(id, nombre) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarNombreUsuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, nombre })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar nombre: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

export async function actualizarEmailUsuario(id, email) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarEmailUsuario}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, email })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar email: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

export async function eliminarUsuario(id) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.eliminarUsuario}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al eliminar usuario: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}