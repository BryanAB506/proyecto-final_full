import React from 'react'
import CustomNavbar from '../components/Navbar'
import FormAdminC from '../components/FormAdmin'
import ProductosAdm from '../components/ProductosAdmin'


export default function AdminP() {
  return (
    <div>
      <CustomNavbar/>
      <FormAdminC/>
      <ProductosAdm/>
    </div>
  )
}