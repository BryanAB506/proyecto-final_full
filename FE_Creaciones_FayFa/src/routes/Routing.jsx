import React from 'react'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import Home from '../page/Home';
import Contact from '../page/Contact';
import SobreNosotrosPage from '../page/SobreNosotrosP';
import Login from '../page/Login';
import Register from '../page/Register';
import Products from '../page/ProductosP';
import AdminP from '../page/Admin';

export default function Routing() {
    return (
     <Router>
      <Routes>
        <Route path="/Home" element={<Home />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path='/sobrenosotros' element={<SobreNosotrosPage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/productos' element={<Products />} />
        <Route path='/admin' element={<AdminP />} />
      </Routes>
    </Router>
    )
}