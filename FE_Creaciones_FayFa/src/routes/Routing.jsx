import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import PrivateRoute from '../components/PrivateRoute';
import Home from '../page/Home';
import Contact from '../page/Contact';
import SobreNosotrosPage from '../page/SobreNosotrosP';
import Login from '../page/Login';
import Register from '../page/Register';
import Products from '../page/ProductosP';
import AdminP from '../page/Admin';
import AdmPedidos from '../page/AdminPedidos';
import CarritoComprasP from '../page/CarritoPage';
import RegAdmin from '../page/RegAdmin'
import PaymentPage from '../page/Pagos';
import UserP from '../page/Users';
import { AuthProvider } from '../Context/AuthContext';
import GetClienteId from '../components/decodificarToken';
import SugundoPaso from '../page/SugundoPaso';
import Perfil from '../page/Cuenta';

export default function Routing() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/Home" element={<Home />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path='/sobrenosotros' element={<SobreNosotrosPage />} />
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/productos' element={<Products />} />
          <Route path='/admin' element={<PrivateRoute><AdminP /></PrivateRoute>} />
          <Route path='/pedidosadmin' element={<AdmPedidos />} />
          <Route path='/carritodecompras' element={<CarritoComprasP />} />
          <Route path='/admin' element={<AdminP />} />
          <Route path='/RegistroAdmin' element={<RegAdmin />} />
          <Route path='/pago' element={<PaymentPage />} />
          <Route path='/Segundopaso' element={< SugundoPaso/>} />
          <Route path='/usuarios' element={<UserP />} />
          <Route path='/perfil' element={<Perfil />} />

          <Route path='/token' element={<GetClienteId />} />

          
        </Routes>
      </Router>
    </AuthProvider>
  )
}