import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Form,Button } from "react-bootstrap";
import getCategorias from '../services/GetCategorias';
import { getProductos } from '../services/GetProductos';
import FayFaContext from "../Context/FayFaContext";
import '../styles/Productos.css';

function Productos() {
    const [categorias, setCategorias] = useState([]);

    // Función para obtener categorías
    async function cargarCategorias() {
        try {
            const datos = await getCategorias();
            setCategorias(datos); // Supone que el servicio devuelve un array de objetos con `nombre_categoria` y `descripcion`
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }

    // useEffect para cargar categorías al montar el componente
    useEffect(() => {
        cargarCategorias();
    }, []);





    const { productos, setNuevoProducto } = useContext(FayFaContext);
        // useEffect para cargar los productos al montar el componente
        useEffect(() => {
            const fetchProductos = async () => {
                try {
                    const data = await getProductos();
                    setNuevoProducto(data);
                } catch (error) {
                    console.error('Error al obtener los productos:', error);
                }
            };
            fetchProductos();
        }, []);
  

    return (
        <div>
        <div className='tituloOurTeam'>
            <h2>PRODUCTOS</h2>
        </div><br />
        <Form className="my-3 w-50 mx-auto">
            <Form.Control
                type="text"
                placeholder="Buscar productos..."
                value=""
                // onChange={handleSearchChange}
            />
        </Form>
        <Container fluid>
            <Row>
                {/* Sidebar para filtros */}
                <Col md={3} className="bg-light p-3">
                    <h5>Filtros</h5>
                    <Form>
                        {/* Categorías como opciones en Género */}
                        <Form.Group>
                            <Form.Label>Categorías</Form.Label>
                            <Form.Select name="category">
                                <option value="">Todas</option>
                                {categorias.map((categoria) => (
                                    <option key={categoria.id} value={categoria.nombre_categoria}>
                                        {categoria.nombre_categoria}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        {/* Descripciones como radio buttons en Colección */}
                        <Form.Group className="mt-3">
                            <Form.Label>Descripciones</Form.Label>
                            {categorias.map((categoria) => (
                                <Form.Check
                                    key={categoria.id}
                                    type="radio"
                                    label={categoria.descripcion}
                                    name="description"
                                    value={categoria.descripcion}
                                />
                            ))}
                        </Form.Group>
                    </Form>
                </Col>

                    {/* Main content */}
                    <Col md={9}>
                        <Row>
                        {productos.map(producto => (
                            <Col key={producto.id} md={4} className="mb-4">
                                 <Card>
                                    <Card.Img variant="top" src={producto.imagen_product || "src/assets/img/default.jpg"} />
                                    <Card.Body>
                                        <Card.Title>{producto.nombre}</Card.Title>
                                        <Card.Text>
                                            <strong>Estilo:</strong> {producto.descripcion_producto}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Precio:</strong> ₡{producto.precio}
                                        </Card.Text>
                                        <div className="d-flex justify-content-between">
                                            <Button variant="primary" size="sm" style={{ backgroundColor: "#212529" }}>
                                                agregar al carrito
                                            </Button>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                           

                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Productos;