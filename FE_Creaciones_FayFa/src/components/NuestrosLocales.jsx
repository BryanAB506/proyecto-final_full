import React from 'react';
import '../styles/SobreNosotros.css';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

export default function Locales() {
    const locales = [
        {
            id: 1,
            titulo: "Local 1",
            descripcion: "Este es el primer local ubicado en El roble, Puntarenas",
            imagen: "src/assets/img/local.jpg"
        },
        {
            id: 2,
            titulo: "Local 2",
            descripcion: "Este es el segundo local uubicado en el centro de Puntarenas",
            imagen: "src/assets/img/local_2.jpg"
        },
    ];

    return (
        <div>
            <div className='contLocales'>
                <br />
                <div className='tituloOurTeam'>
                    <h2>NUESTROS LOCALES</h2>
                </div>
                <br />
                <div className='cartasLocales'>
                    <Row xs={1} md={2} className="g-4">
                        {locales.map((local) => (
                            <Col key={local.id}>
                                <Card>
                                    <Card.Img variant="top" src={local.imagen} />
                                    <Card.Body>
                                        <Card.Title>{local.titulo}</Card.Title>
                                        <Card.Text>{local.descripcion}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </div>
            </div>
        </div>
    );
}
