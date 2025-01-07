import React from 'react'
import '../styles/SobreNosotros.css'
import { Card, Row, Col, Button } from 'react-bootstrap';

export default function OurTeam() {
    return (
        <div>
            <div className='tituloOurTeam'>
                <h2>NUESTROS EQUIPO</h2>
            </div><br />
            <Card style={{ maxWidth: '1100px', margin: 'auto', padding: '20px' }}>
                <Row className="g-0">
                    {/* Imagen */}
                    <Col md={4}>
                        <Card.Img
                            src="src\assets\img\ourteam.jpg"
                            alt="Pepita Ruiz"
                            style={{ borderRadius: '10px', objectFit: 'cover', height: '100%' }}
                        />
                    </Col>

                    {/* Texto */}
                    <Col md={8}>
                        <Card.Body>
                            <Card.Title className="fw-bold" style={{ fontSize: '3rem' }}>
                                Sofía Delgado
                            </Card.Title>
                            <Card.Subtitle className="mb-3 text-primary" style={{ fontSize: '22px' }}>
                                Fundadora
                            </Card.Subtitle>
                            <Card.Text style={{ textAlign: 'justify', fontSize: '26px' }}>
                                Bienvenidos a creaciones fayfa, donde cada prenda cuenta una historia. Soy Sofía Delgado, fundadora y apasionada por la moda que inspira confianza y celebra la autenticidad. Aquí encontrarás piezas únicas diseñadas para realzar tu estilo y acompañarte en cada momento especial de tu vida. Creemos en la calidad, la sostenibilidad y en empoderarte a través de lo que llevas puesto. ¡Gracias por ser parte de esta aventura!
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
