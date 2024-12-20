import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, ListGroup } from "react-bootstrap";
import { fetchCartItems, addToCart, removeFromCart } from "../services/carritoservices";
import { createOrder, fetchCartItemsA } from "../services/Ordenesservices";

const ShoppingCart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate();
    

    // Cargar el carrito desde la API
    
    useEffect(() => {
        const loadCartItems = async () => {
            try {
                const items = await fetchCartItems();  // Llamada a la API
                setCartItems(items);  // Asigna directamente el arreglo de productos a cartItems
            } catch (error) {
                console.error("Error al cargar los productos del carrito:", error.message);
                setCartItems([]);  // En caso de error, asignamos un arreglo vacío
            }
        };

        loadCartItems();
    }, [cartItems]);



    const handleAddToCart = async (productId) => {
        try {
            await addToCart(productId, 1);  // Añadir el producto al carrito
            const updatedItems = await fetchCartItems();  // Recargar los productos del carrito
            setCartItems(updatedItems.cart_items || []);  // Actualiza con los nuevos items
        } catch (error) {
            console.error("Error al añadir producto al carrito:", error.message);
        }
    };

    const handleRemoveFromCart = async (productId) => {
        try {
            await removeFromCart(productId, 1);  // Eliminar un producto del carrito
            const updatedItems = await fetchCartItems();  // Recargar los productos del carrito
            setCartItems(updatedItems.cart_items || []);  // Actualiza con los nuevos items
        } catch (error) {
            console.error("Error al quitar producto del carrito:", error.message);
        }
    };

    const calculateSubtotal = () => {
        return cartItems
            .reduce((acc, item) => acc + item.product_price * item.quantity, 0)
            .toFixed(2);  // Formato con dos decimales
    };
    
    //completar e ir a pago
    const handleCreateOrder = async () => {
        try {
            const cartData = await fetchCartItemsA();
    
            if (!cartData.cart_id) {
                console.error("No hay carrito asociado.");
                return;
            }
    
            const orderData = await createOrder({ cart_id: cartData.cart_id });
    
            navigate("/pago");
        } catch (error) {
            console.error("Error en el proceso de crear orden:", error.message);
        }
    };
    
    
    
    
    

    return (
        <Container>
            <br /><h1 style={{ marginBottom: "20px", textAlign: "center", color: "#333" }}>Carrito de Compras</h1><br />
            <Row>
                {/* Sección de los productos del carrito */}
                <Col md={8}>
                    <ListGroup variant="flush">
                        {cartItems.length === 0 ? (
                            <p>No hay productos en el carrito.</p>  // Mensaje si no hay productos en el carrito
                        ) : (
                            cartItems.map((item) => (
                                <ListGroup.Item key={item.product_id}>
                                    <Row>
                                        <Col md={2}>
                                            <img src={item.product_image} alt={item.product_name} className="img-fluid" />
                                        </Col>
                                        <Col md={6}>
                                            <h5>{item.product_name}</h5>
                                            <p>{item.product_description}</p>
                                            <p><strong>Categoría:</strong> {item.product_category}</p>
                                        </Col>
                                        <Col md={2} className="d-flex flex-column align-items-center">
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleRemoveFromCart(item.product_id)}
                                                    style={{
                                                        color: "black",
                                                        backgroundColor: "#f0f0f0", // Color de fondo
                                                        border: "1px solid #ccc", // Borde del botón
                                                        padding: "5px 10px", // Espaciado interno
                                                        borderRadius: "5px", // Bordes redondeados
                                                        fontSize: "16px", // Tamaño de fuente
                                                        cursor: "pointer", // Cambiar el cursor al pasar por encima
                                                        transition: "background-color 0.3s ease", // Efecto al pasar el cursor
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = "#e0e0e0"} // Efecto hover
                                                    onMouseOut={(e) => e.target.style.backgroundColor = "#f0f0f0"} // Restablecer al salir
                                                >
                                                    -
                                                </Button>

                                                <p style={{ margin: "0 10px", fontSize: "16px", color: "#333", textAlign: "center" }}>
                                                    {item.quantity}
                                                </p>

                                                <Button
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() => handleAddToCart(item.product_id)}
                                                    style={{
                                                        color: "black",
                                                        backgroundColor: "#f0f0f0",
                                                        border: "1px solid #ccc",
                                                        padding: "5px 10px",
                                                        borderRadius: "5px",
                                                        fontSize: "16px",
                                                        cursor: "pointer",
                                                        transition: "background-color 0.3s ease",
                                                    }}
                                                    onMouseOver={(e) => e.target.style.backgroundColor = "#e0e0e0"}
                                                    onMouseOut={(e) => e.target.style.backgroundColor = "#f0f0f0"}
                                                >
                                                    +
                                                </Button>

                                            </div>
                                            <p><strong>{(item.product_price * item.quantity).toFixed(2)} €</strong></p>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))
                        )}
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
                                            <strong>{calculateSubtotal()}</strong>
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
                                onClick={() => handleCreateOrder()}
                            >
                                Pasar a pago
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};


export default ShoppingCart;
