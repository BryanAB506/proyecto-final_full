import { Container, Row, Col, Card, Button } from "react-bootstrap";
import '../styles/AdminPage.css';

function ProductosAdm() {
    return (
        <div>
            <div className='tituloOurTeam'>
                <h2>PRODUCTOS</h2>
            </div><br />
            <Container fluid>
                {/* Main content */}
                <Col md={9}>
                    <Row>
                        <Col md={4} className="mb-4">
                            <Card >
                                <Card.Img variant="top" src="src/assets/img/local.jpg" />
                                <Card.Body>
                                    <Card.Title>Producto 1</Card.Title>
                                    <Card.Text>
                                        How to divide the former part of the Communist Party of China from the major difficulties.
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
                        {/* Puedes duplicar y modificar las columnas para agregar más productos */}
                    </Row>
                </Col>
            </Container>
        </div>
    );
}

export default ProductosAdm;
