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
                                Pepita Ruiz
                            </Card.Title>
                            <Card.Subtitle className="mb-3 text-primary" style={{ fontSize: '22px' }}>
                                Fundadora
                            </Card.Subtitle>
                            <Card.Text style={{ textAlign: 'justify', fontSize: '26px' }}>
                                However, it's hard to get rid of all kinds of things, and it's difficult to pass on all kinds of articles. In the field of feixinshan, jiutuan people's films are very keen on thinking that people can increase their eyes to get the Dragon King's moon gone, and the small ones can't take any water to make noodles. It refers to the fact that during the period of Jiyun Festival...
                            </Card.Text>
                        </Card.Body>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}
