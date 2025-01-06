import simbolo from '../assets/img/simbolo.png';
import whatsapp from '../assets/img/whatsapp.png';
import telefono from '../assets/img/telefono.png';
import { Container, Row, Col, Image, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useRef } from 'react';
import emailjs from '@emailjs/browser';
import '../styles/ContactS.css';

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
        }
      );
  };

  return (
    <div>
      <Container className="mt-5">
        {/* Título */}
        <Row>
          <Col className="text-center">
            <h2>Contacto con nosotros</h2>
          </Col>
        </Row>
        <br />

        {/* Descripción */}
        <Row>
          <Col className="text-center">
            <p>Estas son algunas de las opciones para nuestro contacto:</p>
          </Col>
        </Row>

        {/* Íconos y opciones */}
        <Row className="text-center align-items-center">
          <Col md={4}>
            <Image className="ocultar-simbolo" src={simbolo} alt="Ícono 1" fluid />
          </Col>
          <Col md={4}>
            <Image className="ocultar-simbolo" src={simbolo} alt="Ícono 2" fluid />
          </Col>
          <Col md={4}>
            <Image className="ocultar-simbolo" src={simbolo} alt="Ícono 3" fluid />
          </Col>
        </Row>


        <Row className="mt-4 text-center">
          <Col>
            <p>
              <strong>WhatsApp:</strong> Contáctanos mediante WhatsApp{' '}
              <Image id="simboloW" src={whatsapp} alt="WhatsApp" style={{ width: '20px' }} />
            </p>
          </Col>
          <Col>
            <p>
              <strong>Teléfono:</strong> Llámanos al <span>(84513401)</span>, horario: 9:00 AM - 7:00 PM <br />
              Sábados: 9:00 AM - 4:00 PM{' '}
              <Image id="simboloT" src={telefono} alt="Teléfono" style={{ width: '20px' }} />
            </p>
          </Col>
          <Col>
            <p>
              <strong>Redes Sociales:</strong> Síguenos en Facebook, Instagram o mándanos un correo
            </p>
          </Col>
        </Row>
      </Container>

      {/* Formulario */}
      
      <Container className="mt-5">
        <Row>
          <Col md={{ span: 8, offset: 2 }}>
          <h1>Formulario de contacto</h1><br />
            <Form ref={form} onSubmit={sendEmail}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control type="text" name="user_name" placeholder="Ingresa tu nombre" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control type="email" name="user_email" placeholder="nombre@correo.com" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Consulta</Form.Label>
                <Form.Control as="textarea" name="message" rows={4} placeholder="Escribe tu consulta aquí" required />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100" style={{
                backgroundColor: "#212529",
                borderColor: "#FF5733",
                margin: "10px",
              }}>
                Enviar
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ContactPage;
