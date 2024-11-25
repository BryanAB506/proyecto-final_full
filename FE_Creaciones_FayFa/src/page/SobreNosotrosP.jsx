import React from 'react'
import SobreNosotros from '../components/HeaderSobreNosotros'
import Mapa from '../components/ubicacion'
import ImgsSN from '../components/imgsSobreNosotros'
import OurTeam from '../components/NuestroEquipo'
import Locales from '../components/NuestrosLocales'
import FooterPage from '../components/FooterPage'
import CustomNavbar from '../components/Navbar'

function SobreNosotrosPage() {
  return (
    <div>
      <CustomNavbar/>
      <SobreNosotros/><br />
      <div className='map'>
      <Mapa/><br />
      <ImgsSN/><br />
      </div><br /><br />
      <OurTeam/><br />
      <Locales/> 
      <FooterPage/>
    </div>
  )
}
export default SobreNosotrosPage