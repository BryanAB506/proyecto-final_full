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
  
  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <FayFaContext.Provider value={{ isAuthenticated, login, logout, nuevoProducto, setNuevoProducto, productos}}>
      {children}
    </FayFaContext.Provider>
  );
};