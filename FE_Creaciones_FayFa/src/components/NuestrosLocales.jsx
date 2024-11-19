import React from 'react'
import '../styles/SobreNosotros.css'
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Locales() {
    return (
        <div>
            <div className='contLocales'>
                <br />
                <div className='tituloOurTeam'>
                    <h2>NUESTROS LOCALES</h2>
                </div><br />
                <div className='cartasLocales'>
                    <Row xs={1} md={3} className="g-4">
                        {Array.from({ length: 3 }).map((_, idx) => (
                            <Col key={idx}>
                                <Card>
                                    <Card.Img variant="top" src="src\assets\img\local.jpg" />
                                    <Card.Body>
                                        <Card.Title>Card title</Card.Title>
                                        <Card.Text>
                                            This is a longer card with supporting text below as a natural
                                            lead-in to additional content. This content is a little bit
                                            longer.
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    )
}