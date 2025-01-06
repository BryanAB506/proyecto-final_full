import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import '../styles/home.css';

const Expect = () => {
    return (
        <Container fluid className="contExp py-4 centered-container">
            <Row className="align-items-center">
                {/* Tarjetas */}
                <Col lg={8}>
                    <Row className="g-4">
                        <Col md={6}>
                            <Card className="text-center shadow-sm h-100 ">
                                <Card.Body>
                                    <div className="icone">📊</div>
                                    <Card.Title>Calidad</Card.Title>
                                    <Card.Text>
                                        Prendas confeccionadas con los mejores materiales y atención a cada detalle, asegurando una experiencia única.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="text-center shadow-sm h-100 mt-30">
                                <Card.Body>
                                    <div className="icone">🧠</div>
                                    <Card.Title>Personalización</Card.Title>
                                    <Card.Text>
                                        Cada cliente es único, por eso adaptamos cada prenda a tus necesidades y estilo personal.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="text-center shadow-sm h-100 ">
                                <Card.Body>
                                    <div className="icone">🔺</div>
                                    <Card.Title>Confianza</Card.Title>
                                    <Card.Text>
                                        Más de 10 años creando trajes y prendas con la precisión y el arte de la sastrería clásica.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="text-center shadow-sm h-100 mt-30">
                                <Card.Body>
                                    <div className="icone">📊</div>
                                    <Card.Title>Innovación</Card.Title>
                                    <Card.Text>
                                        Combinamos técnicas tradicionales con diseños contemporáneos para una apariencia sofisticada.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Texto a la derecha */}
                <Col lg={4}>
                    <div className="text-expect text-center text-lg-start">
                        <h2>Comprometidos con tu estilo</h2>
                        <p>
                        Fusionamos calidad, personalización y confianza para brindarte productos que superen tus expectativas.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Expect;
