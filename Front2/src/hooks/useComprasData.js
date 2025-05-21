import { useState, useEffect } from 'react';
import { fetchComprasData } from '../services/comprasService';

// Import images
import ImagenZapatoDeportivo from '../Fotos/ImagenZapatoDeportivo.jpg';
import ImagenZapatoDeVestir from '../Fotos/ImagenZapatoDeVestir.jpg';
import ImagenBotas from '../Fotos/ImagenBotas.png';
import ImagenSandalias from '../Fotos/ImagenSandalias.jpg';

const useComprasData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiData, setApiData] = useState({
    articulos: [],
    proveedores: [],
    pagos: []
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await fetchComprasData();
        setApiData(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        console.error('Error loading data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Transform API data into the format we need
  const providers = apiData.proveedores.map(provider => ({
    id: provider.id,
    name: provider.nombre
  }));

  const products = apiData.articulos.map((article, index) => {
    // Assign images based on index
    let image;
    switch(index) {
      case 0:
        image = ImagenZapatoDeportivo;
        break;
      case 1:
        image = ImagenZapatoDeVestir;
        break;
      case 2:
        image = ImagenBotas;
        break;
      case 3:
        image = ImagenSandalias;
        break;
      default:
        image = ImagenZapatoDeportivo; // Default image for any additional products
    }

    return {
      id: article.id,
      name: article.nombre,
      price: parseFloat(article.precioCompra),
      image: image,
      description: article.descripcion
    };
  });

  const paymentMethods = apiData.pagos.map(payment => ({
    id: payment.id,
    name: payment.nombre,
    description: "Método de pago disponible"
  }));

  return {
    loading,
    error,
    providers,
    products,
    paymentMethods
  };
};

export default useComprasData; 