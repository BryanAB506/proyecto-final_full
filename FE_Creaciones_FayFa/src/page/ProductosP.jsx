import React from 'react'
import CustomNavbar from '../components/Navbar'
import Productos from '../components/ProductosContainer'
import FooterPage from '../components/FooterPage'



export default function Products() {
    return (
        <div>
            <CustomNavbar /><br />
            <Productos />
            <FooterPage />
        </div>
    )
}