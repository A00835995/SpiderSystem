import { useState, useEffect, useMemo } from 'react';

export const usePaginationSearch = (items, initialItemsPerPage = 5) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  // Efecto para resetear a la primera página cuando se realiza una búsqueda
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Filtrar items según la búsqueda
  const filteredItems = useMemo(() => {
    return items.filter(item => 
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (item.proveedor && item.proveedor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.producto && item.producto.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [items, searchQuery]);

  // Calcular los índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);

  // Función para cambiar la página
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Función para cambiar el número de items por página
  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  return {
    currentItems,
    totalPages,
    currentPage,
    itemsPerPage,
    searchQuery,
    filteredItems,
    indexOfFirstItem,
    indexOfLastItem,
    setSearchQuery,
    handlePageChange,
    handleItemsPerPageChange
  };
}; 