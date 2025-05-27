import { API_CONFIG } from '../config/api';

/**
 * Servicio para gestionar las operaciones de proveedores
 */

// Obtener todos los proveedores con información resumida
export async function fetchProveedoresResumen() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getProveedoresResumen}`);
  if (!response.ok) {
    throw new Error('Error al obtener proveedores');
  }
  const json = await response.json();
  return json;
}

// Obtener detalles completos de un proveedor específico
export async function fetchDetalleProveedor(id) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getDetalleProveedor.replace(':id', id)}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Error al obtener detalles del proveedor con ID ${id}`);
  }
  const json = await response.json();
  return json;
}

// Obtener tipos de proveedores disponibles
export async function fetchTiposProveedores() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getTiposProveedores}`);
  if (!response.ok) {
    throw new Error('Error al obtener tipos de proveedores');
  }
  const json = await response.json();
  return json;
}

// Obtener tipos de pagos disponibles
export async function fetchTiposPagosProveedores() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getTiposPagosProveedores}`);
  if (!response.ok) {
    throw new Error('Error al obtener tipos de pagos');
  }
  const json = await response.json();
  return json;
}

// Crear un nuevo proveedor
export async function crearProveedor(proveedorData) {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.crearProveedor}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(proveedorData)
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al crear proveedor: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

// Actualizar nombre del proveedor
export async function actualizarNombreProveedor(id, nombre) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarNombreProveedor.replace(':id', id)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombre })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar nombre del proveedor: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

// Actualizar nombre del contacto del proveedor
export async function actualizarNombreContactoProveedor(id, nombreContacto) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarNombreContactoProveedor.replace(':id', id)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ nombreContacto })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar nombre del contacto: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

// Actualizar teléfono del proveedor
export async function actualizarTelefonoProveedor(id, telefono) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarTelefonoProveedor.replace(':id', id)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ telefono })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar teléfono del proveedor: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

// Actualizar email del proveedor
export async function actualizarEmailProveedor(id, email) {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarEmailProveedor.replace(':id', id)}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar email del proveedor: ${errorText}`);
    }
    
    const json = await response.json();
    return json;
  }

// Actualizar dirección del proveedor
export async function actualizarDireccionProveedor(id, direccion) {
    const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarDireccionProveedor.replace(':id', id)}`;
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ direccion })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al actualizar dirección del proveedor: ${errorText}`);
    }
    
    const json = await response.json();
    return json;
  }

// Actualizar tipo de proveedor
export async function actualizarTipoProveedor(id, tipoProveedor) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarTipoProveedor.replace(':id', id)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, tipoProveedor })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar tipo de proveedor: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

// Actualizar tipo de pago del proveedor
export async function actualizarTipoPagoProveedor(id, tipoPago) {
  const url = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.actualizarTipoPagoProveedor.replace(':id', id)}`;
  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, tipoPago })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar tipo de pago del proveedor: ${errorText}`);
  }
  
  const json = await response.json();
  return json;
}

// Obtener resumen por categorías
export async function fetchResumenCategorias() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getResumenCategorias}`);
  if (!response.ok) {
    throw new Error('Error al obtener resumen de categorías');
  }
  const json = await response.json();
  return json;
}

// Obtener distribución de proveedores por inventario
export async function fetchDistribucionProveedorInventario() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.getDistribucionProveedorInventario}`);
  if (!response.ok) {
    throw new Error('Error al obtener distribución de inventario');
  }
  const json = await response.json();
  return json;
}
