import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from "react-bootstrap";
// Ajusta la ruta según tu estructura
import '../styles/AdminPage.css';
import FayFaContext from '../Context/FayFaContext';
// import { useAuth } from '../Context/AuthContext';

function ProductosAdm() {
    const { productos } = useContext(FayFaContext);

    return (
        <div>
            <div className='tituloOurTeam'>
                <h2>PRODUCTOS</h2>
            </div><br />
            <Container fluid>
                <Col md={9}>
                    <Row>
                        {productos.map(producto => (
                            <Col key={producto.id} md={4} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src={producto.imagen_product || "src/assets/img/default.jpg"} />
                                    <Card.Body>
                                        <Card.Title>{producto.nombre}</Card.Title>
                                        <Card.Text>
                                            {producto.descripcion_producto}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between">
                                            <Button variant="primary" size="sm" style={{ backgroundColor: "#212529" }}>
                                                Editar
                                            </Button>
                                            <Button variant="danger" size="sm" style={{ backgroundColor: "#212529" }}>
                                                Eliminar
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Container>
        </div>
    );
}

export default ProductosAdm;
