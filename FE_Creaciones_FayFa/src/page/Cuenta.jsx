import React from 'react'
import CustomNavbar from '../components/Navbar'
import FooterPage from '../components/FooterPage'
import { UsuarioPerfil } from '../components/PerfilUsuario'

export default function Perfil() {
    return (
        <div>
            <CustomNavbar />
            <UsuarioPerfil />
            <FooterPage />
        </div>
    )
}