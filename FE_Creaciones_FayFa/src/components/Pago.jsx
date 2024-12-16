import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import getOrden from "../services/GetPago";
import Swal from "sweetalert2";
import FayFaContext from "../Context/FayFaContext";
import '../styles/pagos.css'
import GetClienteId from "./decodificarToken";
import postDireccion from "../services/PostDireccion";
import { useNavigate } from 'react-router-dom'




const PaymentPage = () => {

    const user_id = GetClienteId()
    console.log(user_id)
    const navigate = useNavigate ();


    const [formState, setFormState] = useState({
        deliveryMethod: "",
        paymentMethod: "",
        addressDetails: {
            direccion: "",
            provincia: "",
            canton: "",
            distrito: "",
            codigo_postal: "",
        },
        paymentProof: null,
        userId: user_id || "", // Asumiendo que incluye el ID del usuario
    });

    const handleInputChange = (key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    const handleAddressChange = (key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            addressDetails: {
                ...prevState.addressDetails,
                [key]: value,
            },
        }));
    };

  

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formState.deliveryMethod === "delivery") {
            const { direccion, provincia, canton, distrito, codigo_postal } = formState.addressDetails;

            if (!direccion || !provincia || !canton || !distrito || !codigo_postal) {
                Swal.fire("Por favor, complete todos los campos de dirección.");
                return;
            }

            // Asegurarnos de que `Usuarios_id` esté disponible
            const Usuarios = user_id;

            if (!Usuarios) {
                Swal.fire("No se encontró el ID del usuario. Por favor, inténtelo de nuevo.");
                return;
            }
            console.log(Usuarios);

            // Guardar dirección en la base de datos
            try {
                await postDireccion(
                    direccion,
                    codigo_postal,
                    Usuarios,
                    canton,
                    distrito,
                    provincia
                );
                Swal.fire("Dirección guardada con éxito!");

                navigate('/Segundopaso')
            } catch (error) {
                console.error("Error guardando dirección:", error);
                Swal.fire("Hubo un problema guardando la dirección.");
                return;
            }
        }
       
    };



    const [productos, setProductos] = useState([]);
    // useEffect para cargar los productos al montar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                console.log("Llamando a getOrden...");
                const data = await getOrden();
                console.log("Datos recibidos:", data);
                setProductos(data);
            } catch (error) {
                console.error('Error al obtener las órdenes:', error);
            }
        };
        fetchProductos();
    }, []);





    return (
        <Container className="payment-container">
            <h2 className="my-4">Página de Pago</h2>

            {/* Resumen de la Orden */}
            {productos?.length > 0 ? (
                productos.map((producto) => (
                    <Col key={producto.id} md={4} className="mb-4">
                        <h4>Resumen de la Orden</h4>
                        <Card className="p-3 border rounded">
                            {/* Mostrar el nombre del usuario */}
                            <Card.Text>
                                <strong>Usuario:</strong> {producto.usuario_nombre || "N/A"}
                            </Card.Text>

                            {/* Mostrar la fecha de la orden */}
                            <Card.Text>
                                <strong>Fecha de la Orden:</strong> {new Date(producto.fecha_orden).toLocaleDateString() || "N/A"}
                            </Card.Text>

                            {/* Mostrar el estado de la orden */}
                            <Card.Text>
                                <strong>Estado:</strong> {producto?.estado || "Pendiente"}
                            </Card.Text>

                            {/* Mostrar el total */}
                            <Card.Text>
                                <strong>Total:</strong> {`₡${producto?.total || "0.00"}`}
                            </Card.Text>
                        </Card>
                    </Col>

                ))
            ) : (
                <p>No hay órdenes disponibles.</p>
            )}


            {/* Formulario */}
            <Form onSubmit={handleSubmit}>
                <h4>Paso 1: Método de Envío</h4>
                <Form.Check
                    type="radio"
                    id="localPickup"
                    label="Retiro en el local"
                    value="local"
                    name="deliveryMethod"
                    checked={formState.deliveryMethod === "local"}
                    onChange={(e) => handleInputChange("deliveryMethod", e.target.value)}
                />
                <Form.Check
                    type="radio"
                    id="delivery"
                    label="Envío"
                    value="delivery"
                    name="deliveryMethod"
                    checked={formState.deliveryMethod === "delivery"}
                    onChange={(e) => handleInputChange("deliveryMethod", e.target.value)}
                />
                {formState.deliveryMethod === "delivery" && (
                    <div className="mt-3">
                        <h5>Detalles de Dirección</h5>
                        <Form.Group className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                value={formState.addressDetails.direccion}
                                placeholder="Ingrese su dirección"
                                onChange={(e) => handleAddressChange("direccion", e.target.value)}
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Provincia</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.provincia}
                                        placeholder="Ingrese su provincia"
                                        onChange={(e) => handleAddressChange("provincia", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Cantón</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.canton}
                                        placeholder="Ingrese su cantón"
                                        onChange={(e) => handleAddressChange("canton", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Distrito</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.distrito}
                                        placeholder="Ingrese su distrito"
                                        onChange={(e) => handleAddressChange("distrito", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.codigo_postal}
                                        placeholder="Ingrese su código postal"
                                        onChange={(e) => handleAddressChange("codigo_postal", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                )}

                
                <Button id="botonCompra" type="submit" variant="primary" className="mt-4">
                    Completar Compra
                </Button>
            </Form>
        </Container>
    );
};

export default PaymentPage;
