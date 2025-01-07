import React, { useState, useEffect } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap"; 
import getOrden from "../services/GetPago";
import Swal from "sweetalert2"; 
import FayFaContext from "../Context/FayFaContext"; 
import '../styles/pagos.css'; 
import GetClienteId from "./decodificarToken"; 
import postDireccion from "../services/PostDireccion";
import { useNavigate } from 'react-router-dom'; 


const PaymentPage = () => {
    // Obtiene el ID del usuario utilizando `GetClienteId`.
    const user_id = GetClienteId();
    console.log(user_id); // Imprime el ID del usuario en la consola para depuración.
    const navigate = useNavigate(); 

    // Estado para almacenar los datos del formulario.
    const [formState, setFormState] = useState({
        deliveryMethod: "", // Método de entrega: "local" o "delivery".
        paymentMethod: "", // Método de pago .
        addressDetails: { // Detalles de la dirección para el método de entrega "delivery".
            direccion: "",
            provincia: "",
            canton: "",
            distrito: "",
            codigo_postal: "",
        },
        paymentProof: null, // Comprobante de pago .
        userId: user_id || "", // Asigna el ID del usuario al formulario.
    });

    // Función para manejar cambios en campos de formulario simples.
    const handleInputChange = (key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    // Función para manejar cambios en los campos de la dirección.
    const handleAddressChange = (key, value) => {
        setFormState((prevState) => ({
            ...prevState,
            addressDetails: {
                ...prevState.addressDetails,
                [key]: value,
            },
        }));
    };

    // Maneja el envío del formulario.
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita la recarga de la página al enviar el formulario.

        // Validación para el método de envío "delivery".
        if (formState.deliveryMethod === "delivery") {
            const { direccion, provincia, canton, distrito, codigo_postal } = formState.addressDetails;

            // Asegúrate de que todos los campos de la dirección estén completos.
            if (!direccion || !provincia || !canton || !distrito || !codigo_postal) {
                Swal.fire("Por favor, complete todos los campos de dirección."); // Muestra una alerta si faltan campos.
                return;
            }

            // Verifica que el ID del usuario esté disponible.
            const Usuarios = user_id;
            if (!Usuarios) {
                Swal.fire("No se encontró el ID del usuario. Por favor, inténtelo de nuevo.");
                return;
            }
            console.log(Usuarios);

            // Guarda la dirección en la base de datos.
            try {
                await postDireccion(
                    direccion,
                    codigo_postal,
                    Usuarios,
                    canton,
                    distrito,
                    provincia
                );
                Swal.fire("Dirección guardada con éxito!"); // Muestra una alerta de éxito.
            } catch (error) {
                console.error("Error guardando dirección:", error); // Imprime el error en la consola.
                Swal.fire("Hubo un problema guardando la dirección."); // Muestra una alerta de error.
                return;
            }
        }

        // Redirige a la siguiente página si se seleccionó un método de entrega.
        if (formState.deliveryMethod === "delivery" || formState.deliveryMethod === "local") {
            navigate('/Segundopaso');
        }
    };

    // Estado para almacenar los productos de la orden.
    const [productos, setProductos] = useState([]);

    // Hook para cargar los productos al montar el componente.
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                console.log("Llamando a getOrden...");
                const data = await getOrden(); // Llama al servicio para obtener los datos de la orden.
                console.log("Datos recibidos:", data);
                setProductos(data); // Almacena los datos en el estado.
            } catch (error) {
                console.error('Error al obtener las órdenes:', error); // Imprime el error si ocurre.
            }
        };
        fetchProductos(); // Ejecuta la función.
    }, []); // Se ejecuta solo una vez al montar el componente.

    return (
        <Container className="payment-container">
            <h2 className="my-4">Página de Pago</h2>

            {/* Resumen de la Orden */}
            {productos?.length > 0 ? (
                productos.map((producto) => (
                    <Col key={producto.id} md={4} className="mb-4">
                        <h4>Resumen de la Orden</h4>
                        <Card className="p-3 border rounded">
                            <Card.Text>
                                <strong>Usuario:</strong> {producto.usuario_nombre || "N/A"}
                            </Card.Text>
                            <Card.Text>
                                <strong>Fecha de la Orden:</strong> {new Date(producto.fecha_orden).toLocaleDateString() || "N/A"}
                            </Card.Text>
                            <Card.Text>
                                <strong>Estado:</strong> {producto?.estado || "Pendiente"}
                            </Card.Text>
                            <Card.Text>
                                <strong>Total:</strong> {`₡${producto?.total || "0.00"}`}
                            </Card.Text>
                        </Card>
                    </Col>
                ))
            ) : (
                <p>No hay órdenes disponibles.</p> // Mensaje si no hay órdenes.
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
                        {/* Campos de dirección */}
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
                            {/* Campos de Provincia, Cantón, Distrito y Código Postal */}
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

export default PaymentPage; // Exporta el componente para su uso en otros archivos.
