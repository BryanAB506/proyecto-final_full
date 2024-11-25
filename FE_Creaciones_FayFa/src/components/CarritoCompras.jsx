import React, { useState } from "react";
import { Container, Row, Col, Card, Button, ListGroup, Form } from "react-bootstrap";

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Nike Sportswear Chill Terry",
            description: "Sudadera con capucha completa de tejido French Terry",
            color: "Light Army/Sail",
            size: "S (UE 36-38)",
            price: 48.99,
            quantity: 1,
            image: "src/assets/img/HOODIE.png",
        },
        {
            id: 2,
            name: "Nike Tech",
            description: "Sudadera con capucha Windrunner",
            color: "Game Royal/Negro",
            size: "XL",
            price: 119.99,
            quantity: 1,
            image: "src/assets/img/CREW.png",
        },
        {
            id: 3,
            name: "Nike Sportswear Chill Terry",
            description: "Pantalón de chándal",
            color: "Light Army/Sail",
            size: "L (EU 44-46)",
            price: 41.99,
            quantity: 1,
            image: "src/assets/img/chandal.png",
        },
    ]);

    // Función para actualizar la cantidad de un producto
    const updateQuantity = (id, quantity) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, quantity: quantity } : item
            )
        );
    };

    // Función para eliminar un producto del carrito
    const removeItem = (id) => {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Calcular subtotal
    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    };

    return (
        <Container>
            <Row>
                {/* Sección del carrito */}
                <Col md={8}>
                    <br />
                    <h2>Carrito</h2>
                    <br />
                    <ListGroup variant="flush">
                        {cartItems.map((item) => (
                            <ListGroup.Item key={item.id}>
                                <Row>
                                    <Col md={2}>
                                        <img src={item.image} alt={item.name} className="img-fluid" />
                                    </Col>
                                    <Col md={6}>
                                        <h5>{item.name}</h5>
                                        <p>{item.description}</p>
                                        <p>
                                            <strong>Color:</strong> {item.color}
                                        </p>
                                        <p>
                                            <strong>Talla:</strong> {item.size}
                                        </p>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as="select"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                        >
                                            {[...Array(10).keys()].map((x) => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    <Col md={2} className="d-flex flex-column align-items-center">
                                        <p>
                                            <strong>{(item.price * item.quantity).toFixed(2)} €</strong>
                                        </p>
                                        <Button variant="danger" size="sm" onClick={() => removeItem(item.id)}
                                            style={{
                                                backgroundColor: "#212529",
                                                borderColor: "#FF5733",
                                                margin: "10px",
                                            }}>
                                            Eliminar
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Sección del resumen */}
                <Col md={4}>
                    <br />
                    <h2>Resumen</h2>
                    <br />
                    <Card>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Subtotal</Col>
                                        <Col>
                                            <strong>{calculateSubtotal()} €</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Gastos de envío</Col>
                                        <Col>
                                            <strong>Gratuito</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Total</Col>
                                        <Col>
                                            <strong>{calculateSubtotal()} €</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>
                            <Button variant="dark" className="w-100 mt-3"
                                style={{
                                    backgroundColor: "#212529",
                                    borderColor: "#FF5733",
                                    margin: "10px",
                                }}>
                                Pasar por caja
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ShoppingCart;
