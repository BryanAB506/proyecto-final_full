import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup, Form } from "react-bootstrap";
import { fetchCartItems, updateCartItem, removeCartItem } from "../services/carritoservices"

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Cargar el carrito desde la API
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const items = await fetchCartItems();
                setCartItems(items);
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };

        loadCartItems();
    }, []);

    // Actualizar la cantidad de un producto
    const handleUpdateQuantity = async (id, cantidad) => {
        if (cantidad <= 0) return; // Evitar cantidades negativas o cero
        try {
            const updatedItem = await updateCartItem(id, cantidad);
    
            setCartItems((prevItems) =>
                prevItems.map((item) =>
                    item.id === id
                        ? { ...item, quantity: updatedItem.cantidad, total: updatedItem.total }
                        : item
                )
            );
        } catch (error) {
            console.error("Error al actualizar la cantidad:", error);
        }
    };
    


    // Eliminar un producto del carrito
    const handleRemoveItem = async (id) => {
        try {
            await removeCartItem(id);
            setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error al eliminar el producto:", error);
        }
    };

    // Calcular el subtotal
    const calculateSubtotal = () => {
        return cartItems
            .reduce((total, item) => {
                const precio = parseFloat(item.price) || 0;
                const cantidad = parseInt(item.quantity) || 0;
                return total + precio * cantidad;
            }, 0)
            .toFixed(2);
    };


    if (loading) {
        return <p>Cargando carrito...</p>;
    }

    if (cartItems.length === 0) {
        return <p>No hay productos en el carrito.</p>;
    }

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
                                            <strong>Categoría:</strong> {item.category}
                                        </p>
                                    </Col>
                                    <Col md={2}>
                                        <Form.Control
                                            as="select"
                                            value={item.quantity}
                                            onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value))}
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
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleRemoveItem(item.id)}
                                            style={{
                                                backgroundColor: "#212529",
                                                borderColor: "#FF5733",
                                                margin: "10px",
                                            }}
                                        >
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

                            </ListGroup>
                            <Button
                                variant="dark"
                                className="w-100 mt-3"
                                style={{
                                    backgroundColor: "#212529",
                                    borderColor: "#FF5733",
                                    margin: "10px",
                                }}
                                onClick={() => navigate("/pago")}
                            >
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
