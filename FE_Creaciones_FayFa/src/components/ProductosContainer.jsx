import { useState } from 'react'
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import '../styles/Productos.css'
import getCategorias from '../services/GetCategorias';


function Productos() {

    const [nombre_categoria, setNombre_categoria] = useState([])
    const [descripcion, setdescripcion] = useState([])

    async function dotosCategory() {
        const datos = await getCategorias()
        setNombre_categoria(datos)
        setdescripcion(datos)
        
        
    }

    return (
        <div >
            <div className='tituloOurTeam'>
                <h2>PRODUCTOS</h2>
            </div><br />
            <Container fluid>
                <Row>
                    {/* Sidebar for filters */}
                    <Col md={3} className="bg-light p-3">
                        <h5>Filtros</h5>
                        <Form>

                            <Form.Group>
                                <Form.Label>Género</Form.Label>
                                <Form.Select name="gender">
                                    <option value="">Todos</option>
                                    <option value="Hombre">Hombre</option>
                                    <option value="Mujer">Mujer</option>
                                    <option value="Unisex">Unisex</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mt-3">
                                <Form.Label>Colección</Form.Label>
                                <Form.Check
                                    type="radio"
                                    label="Casual"
                                    name="collection"
                                    value="Casual"
                                    defaultChecked
                                />
                                <Form.Check
                                    type="radio"
                                    label="Básquetbol"
                                    name="collection"
                                    value="Básquetbol"
                                />
                            </Form.Group>
                        </Form>
                    </Col>

                    {/* Main content */}
                    <Col md={9}>
                        <Row>

                            <Col md={4} className="mb-4">
                                <Card>
                                    <Card.Img variant="top" src="src\assets\img\local.jpg" />
                                    <Card.Body>
                                        <Card.Title></Card.Title>
                                        <Card.Text>
                                            How to divide the former part of the Communist Party of China from the major difficulties
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>

                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Productos;