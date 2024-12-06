import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import postDireccion from "../services/PostDireccion";
import '../styles/PaymentPage.css'
import Swal from "sweetalert2";

const PaymentPage = ({ orderData }) => {
    const [formState, setFormState] = useState({
        deliveryMethod: "",
        paymentMethod: "",
        addressDetails: {
            direccion: "",
            ciudad: "",
            estado: "",
            codigo_Postal: "",
        },
        paymentProof: null,
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

    const handleProofUpload = (file) => {
        if (!file) {
            alert("Por favor, seleccione un archivo.");
            return;
        }

        const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
        if (!allowedTypes.includes(file.type)) {
            alert("Tipo de archivo no permitido. Solo se aceptan JPG, PNG o PDF.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            alert("El archivo excede el tamaño máximo de 5 MB.");
            return;
        }

        setFormState((prevState) => ({
            ...prevState,
            paymentProof: file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (formState.deliveryMethod === "delivery") {
            const { direccion, ciudad, estado, codigo_Postal } = formState.addressDetails;
            if (!direccion || !ciudad || !estado || !codigo_Postal) {
                alert("Por favor, complete todos los campos de dirección.");
                return;
            }
        }

        if ((formState.paymentMethod === "sinpe" || formState.paymentMethod === "transfer") && !formState.paymentProof) {
            alert("Por favor, suba un comprobante de pago.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("deliveryMethod", formState.deliveryMethod);
            formData.append("paymentMethod", formState.paymentMethod);

            if (formState.paymentProof) {
                formData.append("paymentProof", formState.paymentProof);
            }

            Object.keys(formState.addressDetails).forEach((key) => {
                formData.append(key, formState.addressDetails[key]);
            });

          
        } catch (error) {
       
        }
    };


    const [direccion, setDireccion] = useState("")
    const [codigo_postal, setCodigo_Postal] = useState("")
    const [Usuarios_id, setUsuarios] = useState("")
    const [provincia, setProvincia] = useState("")
    const [Canton, setCanton] = useState("")
    const [Distrito, setDistrito] = useState("")



    const cargaDireccion = (e) => {
        setDireccion(e.target.value);
    };

    const cargaCodigo_postal = (e) => {
        setCodigo_Postal(e.target.value);
    };

    const cargaUsuarios = (e) => {
        setUsuarios(e.target.value);
    };

    const cargaProvincia = (e) => {
        setProvincia(e.target.value);
    };

    const cargaCanton = (e) => {
        setCanton(e.target.value);
    };

    const cargaDistrito = (e) => {
        setDistrito(e.target.value);
    };
    


    const cargarEnvio = async (e) => {
        e.preventDefault();
        try {
          await postDireccion(direccion, codigo_postal, Usuarios_id, Canton, Distrito, provincia)
    
          Swal.fire("Compra completada con éxito!");
          if (!response.ok) {
            throw new Error("Error al completar la compra.");
        }
        } catch (error) {
            console.error("Error en el envío:", error);
            Swal.fire("Hubo un problema al procesar la compra. Por favor, inténtelo de nuevo.");
        }
      }

    return (
        <Container className="payment-container">
            <h2 className="my-4">Página de Pago</h2>

            {/* Resumen de la Orden */}
            <div className="mb-4">
                <h4>Resumen de la Orden</h4>
                <div className="p-3 border rounded">
                    <p>
                        <strong value={Usuarios_id} onChange={cargaUsuarios}>Usuario:</strong> {orderData?.Usuarios || "N/A"}
                    </p>
                    <p>
                        <strong>Fecha de la Orden:</strong>{" "}
                        {new Date(orderData?.fecha_orden).toLocaleDateString() || "N/A"}
                    </p>
                    <p>
                        <strong>Estado:</strong> {orderData?.estado || "Pendiente"}
                    </p>
                    <p>
                        <strong>Total:</strong> {`₡${orderData?.total || "0.00"}`}
                    </p>
                </div>
            </div>

            {/* Formulario */}
            <Form onSubmit={carga}>
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
                                value= {formState.addressDetails.direccion}
                                placeholder="Ingrese su dirección"
                                onChange={cargaDireccion}
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
                                        onChange={cargaProvincia}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Canton</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.Canton}
                                        placeholder="Ingrese su canton"
                                        onChange={cargaCanton}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Distrito</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.Distrito}
                                        placeholder="Ingrese su distrito"
                                        onChange={cargaDistrito}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.codigo_Postal}
                                        placeholder="Ingrese su código postal"
                                        onChange={cargaCodigo_postal}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                )}

                <h4 className="mt-4">Paso 2: Método de Pago</h4>
                <Form.Check
                    type="radio"
                    id="payLocal"
                    label="Pagar en el local"
                    value="local"
                    name="paymentMethod"
                    checked={formState.paymentMethod === "local"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                />
                <Form.Check
                    type="radio"
                    id="sinpe"
                    label="Pagar por Sinpe Móvil (Realizar el Sinpe Móvil al número 81818181)"
                    value="sinpe"
                    name="paymentMethod"
                    checked={formState.paymentMethod === "sinpe"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                />
                <Form.Check
                    type="radio"
                    id="bankTransfer"
                    label="Pagar por transferencia bancaria (Cuentas: 11223-2-3-3455)"
                    value="transfer"
                    name="paymentMethod"
                    checked={formState.paymentMethod === "transfer"}
                    onChange={(e) => handleInputChange("paymentMethod", e.target.value)}
                />
                {(formState.paymentMethod === "sinpe" ||
                    formState.paymentMethod === "transfer") && (
                        <div className="mt-3">
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Subir comprobante de pago</Form.Label>
                                <Form.Control
                                    type="file"
                                    onChange={(e) => handleProofUpload(e.target.files[0])}
                                />
                            </Form.Group>
                        </div>
                    )}

                <Button
                    type="submit"
                    variant="primary"
                    className="mt-4"
                    style={{ backgroundColor: "#212529", borderColor: "#FF5733", margin: "10px" }}
                >
                    Completar Compra
                </Button>
            </Form>
        </Container>
    );
};

export default PaymentPage;
