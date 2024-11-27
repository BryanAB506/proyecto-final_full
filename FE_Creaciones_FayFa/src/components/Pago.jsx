import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Table } from "react-bootstrap";

const PaymentPage = ({ orderData }) => {
    const [formState, setFormState] = useState({
        deliveryMethod: "",
        paymentMethod: "",
        addressDetails: {
            direccion: "",
            ciudad: "",
            estado: "",
            codigoPostal: "",
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
        setFormState((prevState) => ({
            ...prevState,
            paymentProof: file,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("deliveryMethod", formState.deliveryMethod);
        formData.append("paymentMethod", formState.paymentMethod);

        if (formState.paymentProof) {
            formData.append("paymentProof", formState.paymentProof);
        }

        Object.keys(formState.addressDetails).forEach((key) => {
            formData.append(key, formState.addressDetails[key]);
        });

        console.log("Datos enviados:", formState);
        alert("Compra completada con éxito!");
    };

    return (
        <Container style={{
            maxWidth: "900px", // Reduce el ancho máximo del container
            margin: "20px auto", // Centra horizontalmente
            padding: "20px",  // Añade espacio interno
            backgroundColor: "#f8f9fa", // Fondo opcional para contraste
            borderRadius: "10px", // Bordes redondeados opcionales
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" // Sombra para dar profundidad
        }}>
            <h2 className="my-4">Página de Pago</h2>

            {/* Resumen de la Orden */}
            <div className="mb-4">
                <h4>Resumen de la Orden</h4>
                <div className="p-3 border rounded">
                    <p>
                        <strong>Usuario:</strong> {orderData?.Usuarios || "N/A"}
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

            {/* Paso 1: Método de Envío */}
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
                                name="direccion"
                                value={formState.addressDetails.direccion}
                                placeholder="Ingrese su dirección"
                                onChange={(e) =>
                                    handleAddressChange("direccion", e.target.value)
                                }
                            />
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="ciudad"
                                        value={formState.addressDetails.ciudad}
                                        placeholder="Ingrese su ciudad"
                                        onChange={(e) =>
                                            handleAddressChange("ciudad", e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="estado"
                                        value={formState.addressDetails.estado}
                                        placeholder="Ingrese su estado"
                                        onChange={(e) =>
                                            handleAddressChange("estado", e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="codigoPostal"
                                        value={formState.addressDetails.codigoPostal}
                                        placeholder="Ingrese su código postal"
                                        onChange={(e) =>
                                            handleAddressChange("codigoPostal", e.target.value)
                                        }
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </div>
                )}

                {/* Paso 2: Método de Pago */}
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

                {/* Botón de completar compra */}
                <Button
                    type="submit"
                    variant="primary"
                    className="mt-4"
                    style={{
                        backgroundColor: "#212529",
                        borderColor: "#FF5733",
                        margin: "10px",
                    }}
                >
                    Completar Compra
                </Button>
            </Form>
        </Container>
    );
};

export default PaymentPage;
