import simbolo from '../assets/img/simbolo.png'
import whatsapp from '../assets/img/whatsapp.png'
import telefono from '../assets/img/telefono.png'

import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/ContactS.css'




function ContactPage() {
    const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm('service_c062v4e', 'template_zd9zvvb', form.current, {
        publicKey: '9sc3KyaybsAxgPdMm',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error) => {
          console.log('FAILED...', error.text);
        },
      );
  };



  return (
    <div>

      <div className='titulo'>
        <h2>Contacto con nosotros</h2>
      </div>
      <br />

 
      <p className='Parrafo'>Estas son algunas de las opciones par nuestro contacto</p>

        <div className='acomodo'>
         <div className='icons'> 
            <img src={simbolo} alt="" />
            <img src={simbolo} alt="" />
            <img src={simbolo} alt="" />
    
         </div>
         <div className='icons'>
            <p id='whatsapp'>contactanos mediante whatsapp <img id='simboloW' src={whatsapp} alt="" /></p>
            <p id='llamadas'>Llamanos (84513401) 9:00-7:00pm Sabados9:00-4:pm <img id='simboloT' src={telefono} alt="" /></p>
            <p id='Redes'>Por nuestras redes Sociales Faceboock-instagram o correo electronico</p>
         </div>
        </div>

        <div className="form-container">
            <form className="field" ref={form} onSubmit={sendEmail}>
                <label>Nombre completo</label>
                <input type="text" name="user_name" />
                <label>Correo electronico</label>
                <input className='inputF' type="email" name="user_email" />
                <label>Consulta</label>
                <textarea name="message"></textarea>
                <input className='inputButon' type="submit" value="Send" />
            </form>
        </div>
     
   
      

    </div> 
  )
}

export default ContactPage
