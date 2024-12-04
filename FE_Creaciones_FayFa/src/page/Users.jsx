import React from 'react'
import CustomNavbar from '../components/Navbar'
import UsuarioTable from '../components/Usuarios'
import FooterPage from '../components/FooterPage'



export default function UserP() {
    return (
        <div>
            <CustomNavbar /><br />
            <UsuarioTable />
            <FooterPage />
        </div>
    )
}