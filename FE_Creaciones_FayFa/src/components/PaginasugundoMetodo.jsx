import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Col, Card } from "react-bootstrap";
import FayFaContext from "../Context/FayFaContext"; 
import posComprobantePago from "../services/PostComprovantePagos";
import { UploadFile } from '../firebase/Config'; 
import getOrden from "../services/GetPago"; 
import Swal from 'sweetalert2'; 
import { useNavigate } from "react-router-dom";
import '../styles/Segundopaso.css'; 

// Componente principal de la página
export default function PaginaSegundoMetodo() {
    // Hooks de estado
    const [metodo_pago, setMetodo_pago] = useState(""); // Estado para almacenar el método de pago seleccionado
    const [Ordenes, setOrdenes_id] = useState(""); // Estado para almacenar el ID de la orden seleccionada
    const [comprobante_pago, setComprobante_pago] = useState('sin comprobante'); // Estado para almacenar el comprobante de pago

    const { logout, setNuevoProducto } = useContext(FayFaContext); // Uso del contexto global
    const navigate = useNavigate(); // Hook para redirigir a otra página

    // Función para actualizar el método de pago seleccionado
    const cargarMetodo = (e) => {
        const selectedMethod = e.target.value;
        setMetodo_pago(selectedMethod);
    };

    console.log('ESTO CONTIENE METODO DE PAGO', metodo_pago);

    // Función para manejar la carga de un archivo y su subida a Firebase
    const CargarImagen = async (e) => {
        const file = e.target.files[0]; // Obtener el archivo seleccionado
        setComprobante_pago(file); // Actualizar el estado local con el archivo
        if (file) {
            const resultado = await UploadFile(file); // Subir el archivo a Firebase
            setComprobante_pago(resultado); // Guardar la URL del archivo subido
        }
    };

    // Función para manejar el envío del formulario
    const cargarComprobantes_pago = async (e) => {
        e.preventDefault();

        // Validación: comprobar que todos los campos necesarios estén completos
        if (!metodo_pago || (metodo_pago === "sinpe" && !comprobante_pago)) {
            Swal.fire("Error", "Por favor complete todos los campos.", "error");
            return;
        }

        try {
            console.log('Datos a enviar:', {
                ordenId: Ordenes,
                metodo_pago,
                comprobante_pago
            });

            // Llamar al servicio para enviar los datos del comprobante
            await posComprobantePago(Ordenes, metodo_pago, comprobante_pago);

            // Mostrar mensaje de éxito y redirigir a la página de productos
            Swal.fire("Comprobante leído con éxito.").then(() => {
                navigate("/productos");
            });
        } catch (error) {
            console.error("Error al agregar el comprobante:", error);
            Swal.fire("Hubo un error al agregar el comprobante", "", "error");
        }
    };

    // Hook de estado para almacenar las órdenes
    const [productos, setProductos] = useState([]);

    // useEffect para cargar las órdenes al montar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                console.log("Llamando a getOrden...");
                const data = await getOrden(); // Llamar al servicio para obtener las órdenes
                console.log("Datos recibidos:", data);
                setProductos(data); // Guardar las órdenes en el estado

                // Establecer el ID de la primera orden (si hay varias)
                if (data.length > 0) {
                    setOrdenes_id(data[0].id);
                }
            } catch (error) {
                console.error('Error al obtener las órdenes:', error);
            }
        };
        fetchProductos(); // Ejecutar la función
    }, []);

    console.log('SET ORDEN AL HOOK', Ordenes);
    console.log('COMPROBANTE', comprobante_pago);

    // Renderizado del componente
    return (
        <Container>
            {/* Resumen de la Orden */}
            {productos?.length > 0 ? (
                productos.map((producto) => (
                    <Col key={producto.id} md={4} className="mb-4">
                        <h4>Resumen de la Orden</h4>
                        <Card className="p-3 border rounded">
                            <Card.Text>
                                <strong>Numero de Pedido:</strong> {Ordenes || "N/A"}
                            </Card.Text>
                            <Card.Text>
                                <strong>Usuario:</strong> {producto.usuario_nombre || "N/A"}
                            </Card.Text>
                            <Card.Text>
                                <strong>Total:</strong> {`₡${producto?.total || "0.00"}`}
                            </Card.Text>
                        </Card>
                    </Col>
                ))
            ) : (
                <p>No hay órdenes disponibles.</p>
            )}

            <h4 className="mt-4">Paso 2: Método de Pago</h4>
            <Form onSubmit={cargarComprobantes_pago}>
                {/* Selección del método de pago */}
                <Form.Check
                    type="radio"
                    id="payLocal"
                    label="Pagar en el local"
                    value="local"
                    name="paymentMethod"
                    checked={metodo_pago === "local"}
                    onChange={cargarMetodo}
                />
                <Form.Check
                    type="radio"
                    id="sinpe"
                    label="Pagar por Sinpe Móvil"
                    value="sinpe"
                    name="paymentMethod"
                    checked={metodo_pago === "sinpe"}
                    onChange={cargarMetodo}
                />

                {/* Subida de comprobante de pago (solo para Sinpe) */}
                {metodo_pago === 'sinpe' && (
                    <div className="mt-3">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Subir comprobante de pago</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={CargarImagen}
                                required={metodo_pago === "sinpe"}
                            />
                        </Form.Group>
                    </div>
                )}

                {/* Botón para enviar el formulario */}
                <Button
                    type="submit"
                    variant="primary"
                    className="mt-3"
                    id="botonEnvio"
                >
                    Enviar
                </Button>
            </Form>
        </Container>
    );
}
