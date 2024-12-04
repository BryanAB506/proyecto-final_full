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
                                    <Card.Title>Efficiency</Card.Title>
                                    <Card.Text>
                                        How to deal with the problems in the front of the Ministry and how many samples are given
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="text-center shadow-sm h-100 mt-30">
                                <Card.Body>
                                    <div className="icone">🧠</div>
                                    <Card.Title>Intelligence</Card.Title>
                                    <Card.Text>
                                        How to deal with the problems in the front of the Ministry and how many samples are given
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="text-center shadow-sm h-100 ">
                                <Card.Body>
                                    <div className="icone">🔺</div>
                                    <Card.Title>Stable</Card.Title>
                                    <Card.Text>
                                        How to deal with the problems in the front of the Ministry and how many samples are given
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6}>
                            <Card className="text-center shadow-sm h-100 mt-30">
                                <Card.Body>
                                    <div className="icone">📊</div>
                                    <Card.Title>Efficiency</Card.Title>
                                    <Card.Text>
                                        How to deal with the problems in the front of the Ministry and how many samples are given
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                {/* Texto a la derecha */}
                <Col lg={4}>
                    <div className="text-expect text-center text-lg-start">
                        <h2>Internet products full of expectation</h2>
                        <p>
                            The purpose of this paper is to find out what kind of medicine is to cure the disease, and to combine it with other things.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Expect;
