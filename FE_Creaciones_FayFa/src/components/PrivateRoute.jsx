// src/components/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import FayFaContext from '../Context/FayFaContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(FayFaContext)

  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
