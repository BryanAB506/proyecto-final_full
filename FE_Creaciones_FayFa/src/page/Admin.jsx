import React from 'react'
import CustomNavbar from '../components/Navbar'
import FormAdminC from '../components/FormAdmin'
import ProductosAdm from '../components/ProductosAdmin'
import AdminNavbar from '../components/NavbarAdmin'

export default function AdminP() {
  return (
    <div>
      <CustomNavbar/>
      <AdminNavbar/>
      <FormAdminC/>
      <ProductosAdm/>
    </div>
  )
}