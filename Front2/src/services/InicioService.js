import { API_CONFIG } from '../config/api';

export async function fetchInicioData() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.ordenesPendientes}`);
  if (!response.ok) {
    throw new Error('Error fetching inicio data');
  }
  const json = await response.json();
  return [{ ordenesPendientes: json.data.total }];
}

export async function fetchVentasMes() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.ventasMes}`);
  if (!response.ok) {
    throw new Error('Error fetching ventas mes data');
  }
  const json = await response.json();
  if (Array.isArray(json.data)) {
    return json.data.map(item => ({
      mes: item.mes,
      ano: item.ano,
      total: item.total
    }));
  } else if (json.data && typeof json.data === 'object') {
    return [{
      mes: json.data.mes,
      ano: json.data.ano,
      total: json.data.total
    }];
  } else {
    return [{ mes: null, ano: null, total: 0 }];
  }
}

export async function fetchProductosInventario() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.productosInventario}`);
  if (!response.ok) {
    throw new Error('Error fetching productos inventario data');
  }
  const json = await response.json();
  return [{total:json.data.total}]
}

export async function fetchVentasMesAnterior() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.ventasMesAnterior}`);
  if (!response.ok) {
    throw new Error('Error fetching ventas mes anterior data');
  } 
  const json = await response.json();
  return [{porcentaje:json.data.porcentaje}]
}   

export async function fetchOrdenesRecientes() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.ordenesRecientes}`);
  if (!response.ok) {
    throw new Error('Error fetching ordenes recientes data');
  }
  const json = await response.json();
  return json.data.map(item => ({
    numeroOrden: item.numeroOrden,
    numeroProveedor: item.numeroProveedor,
    fecha: item.fecha,
    cantidad: item.cantidad,
    productos: item.productos,
    estado: item.estado,
    total: item.total
  }));
}   

export async function fetchVentasXCategoria() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.ventasXCategoria}`);
  if (!response.ok) {
    throw new Error('Error fetching ventas x categoria data');
  }
  const json = await response.json();
  return json.data.map(item => ({
    categoria: item.categoria,
    total: item.total,
    porcentaje: item.porcentaje
  }));      
}

export async function fetchProductosMasVendidosMesActual() {
  const response = await fetch(`${API_CONFIG.baseUrl}${API_CONFIG.endpoints.productosMasVendidosMesActual}`);
  if (!response.ok) {
    throw new Error('Error fetching productos mas vendidos data');
  }
  const json = await response.json();
  return json.data.map(item => ({
    idProducto: item.idProducto,
    nombre: item.nombre,
    precio: item.precio,
    existencia: item.existencia,
    estado: item.estado,
    total: item.total
  }));
}
