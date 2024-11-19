import React from 'react'
import SobreNosotros from '../components/HeaderSobreNosotros'
import Mapa from '../components/ubicacion'
import ImgsSN from '../components/imgsSobreNosotros'

function SobreNosotrosPage() {
  return (
    <div>
      <SobreNosotros/>
      <div className='map'>
      <Mapa/>
      <ImgsSN/>
      </div>
    </div>
  )
}
export default SobreNosotrosPage