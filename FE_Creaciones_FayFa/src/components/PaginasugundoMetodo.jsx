import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Container, Col, Card } from "react-bootstrap";
import FayFaContext from "../Context/FayFaContext";
import posComprobantePago from "../services/PostComprovantePagos";
import { UploadFile } from '../firebase/Config'
import getOrden from "../services/GetPago";
import Swal from 'sweetalert2';  // Importación de SweetAlert
import '../styles/Segundopaso.css';

export default function PaginaSegundoMetodo() {
    // const [paymentMethod, setPaymentMethod] = useState("");
    const [metodo_pago, setMetodo_pago] = useState("");
    const [Ordenes, setOrdenes_id] = useState("");
    const [comprobante_pago, setComprobante_pago] = useState(null);

    const { logout, setNuevoProducto } = useContext(FayFaContext);

    const cargarMetodo = (e) => {
        const selectedMethod = e.target.value;
        setMetodo_pago(selectedMethod);
        // setPaymentMethod(selectedMethod); // Esto asegura que el estado `paymentMethod` se actualiza correctamente
    };

    console.log('ESTO CONTIENE METODO DE PAGO', metodo_pago);
    


    //aplicaas el hooks
    const CargarImagen = async (e) => {
        const file = e.target.files[0];
        setComprobante_pago(file);
        if (file) {
            const resultado = await UploadFile(file);
            setComprobante_pago(resultado);
        }
    };

    // Función que se ejecuta cuando se envía el formulario
    const cargarComprobantes_pago = async (e) => {
        e.preventDefault();

        // // Validacion
        // if (!metodo_pago || !comprobante_pago) {
        //     Swal.fire("Error", "Por favor complete todos los campos.", "error");
        //     return;
        // }

        try {
            // Aquí enviarías la solicitud POST a tu backend
            // const formData = new FormData();
            // formData.append("metodo_pago", metodo_pago);
            // formData.append("comprobante_pago", comprobante_pago);
            // formData.append("Ordenes", Ordenes);

            // console.log('FORMDATA',formData);
            

            // Dependiendo del método de pago seleccionado, aplicar lógica específica
            if (metodo_pago === "local") {
                setMetodo_pago("retiro en local");
                setComprobante_pago('Retira en el local')
            } else if (metodo_pago === "sinpe") {
                setMetodo_pago("sinpe móvil");
            }

            console.log('Datos a enviar:', {
                ordenId: Ordenes,
                metodo_pago,
                comprobante_pago
            });

            await posComprobantePago(Ordenes, metodo_pago, comprobante_pago);
            
            // Mostrar mensaje de éxito
            Swal.fire("Comprobante leído con éxito.");
        } catch (error) {
            console.error("Error al agregar el comprobante:", error);
            Swal.fire("Hubo un error al agregar el comprobante", "", "error");
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

                console.log('ORDENES A DEVOLVER', data);
                
                // Aquí obtenemos el ID de la primera orden (si tienes varias)
                if (data.length > 0) {
                    setOrdenes_id(data[0].id);  // Establecemos el ID de la primera orden
                }
            } catch (error) {
                console.error('Error al obtener las órdenes:', error);
            }
        };
        fetchProductos();
    }, []);

    console.log('SET ORDEN AL HOOK', Ordenes);
    console.log('COMPROBANTE', comprobante_pago);




    return (
        <Container>
            {/* Resumen de la Orden */}
            {productos?.length > 0 ? (
                productos.map((producto) => (
                    <Col key={producto.id} md={4} className="mb-4">
                        <h4>Resumen de la Orden</h4>
                        <Card className="p-3 border rounded">
                            <Card.Text>
                                <strong>Numero de Pedido:</strong> {Ordenes || "N/A"}  {/* Aquí mostramos el id de la orden */}
                            </Card.Text>
                            {/* Mostrar el nombre del usuario */}
                            <Card.Text>
                                <strong>Usuario:</strong> {producto.usuario_nombre || "N/A"}
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


            <h4 className="mt-4">Paso 2: Método de Pago</h4>
            <Form onSubmit={cargarComprobantes_pago}>
                {/* Métodos de pago */}
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

                {/* Comprobante de pago */}
                {metodo_pago === 'sinpe' && (
                    <div className="mt-3">
                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Subir comprobante de pago</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={CargarImagen}
                                required
                            />
                        </Form.Group>
                    </div>
                )}

                {/* Botón de envío */}
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
