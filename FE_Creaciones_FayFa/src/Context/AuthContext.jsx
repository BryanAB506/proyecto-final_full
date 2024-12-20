// src/context/AuthContext.js
import React, { useState, useEffect } from 'react';
import { getProductos } from '../services/GetProductos';
import FayFaContext from './FayFaContext';

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState("");

  // useEffect para cargar los productos al montar el componente
  const fetchProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error('Error al obtener los productos:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, [nuevoProducto]);

  // Eliminación del producto
  // const eliminarProducto = async (id) => {
  //   const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
  //   if (!confirmar) return;

  //   try {
  //     const success = await eliminarProductoApi(id);
  //     if (success) {
  //       setProductos(productos.filter(producto => producto.id !== id));
  //       alert("Producto eliminado correctamente.");
  //     } else {
  //       alert("Hubo un error al intentar eliminar el producto.");
  //     }
  //   } catch (error) {
  //     alert("Error eliminando el producto.");
  //   }
  // };

  // Edición del producto (se asume que 'editarProductoApi' retorna la URL de edición)
  // Función para editar un producto (aquí solo llamamos a la API)
  // const editarProducto = async (id) => {
  //   try {
  //     const formData = { /* Agrega los datos que deseas editar aquí */ };
  //     const updatedProduct = await editarProductoApi(id, formData);
  //     if (updatedProduct) {
  //       // Actualiza el estado con el producto editado
  //       setProductos(prevProductos =>
  //         prevProductos.map(producto =>
  //           producto.id === id ? updatedProduct : producto
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error al editar el producto:", error);
  //   }
  // };

  // Funciones para login y logout
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <FayFaContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      nuevoProducto,
      setNuevoProducto,
      productos,
      fetchProductos
    }}>
      {children}
    </FayFaContext.Provider>
  );
};
