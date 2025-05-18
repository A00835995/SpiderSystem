export function applyFilters(data, { searchQuery, selectedCategories, selectedLocations, selectedProveedores, selectedEstados }) {
    let filtered = [...data];
  
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.producto.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower)
      );
    }
  
    if (Array.isArray(selectedCategories) && selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.categoria));
    }
  
    if (Array.isArray(selectedLocations) && selectedLocations.length > 0) {
      filtered = filtered.filter(item => selectedLocations.includes(item.ubicacion));
    }
  
    if (Array.isArray(selectedProveedores) && selectedProveedores.length > 0) {
      filtered = filtered.filter(item => selectedProveedores.includes(item.proveedor));
    }
  
    if (Array.isArray(selectedEstados) && selectedEstados.length > 0) {
      filtered = filtered.filter(item => selectedEstados.includes(item.estado));
    }
  
    return filtered;
  }
  