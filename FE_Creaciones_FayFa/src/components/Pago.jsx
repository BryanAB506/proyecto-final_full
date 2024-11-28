import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import '../styles/PaymentPage.css'

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
            const { direccion, ciudad, estado, codigoPostal } = formState.addressDetails;
            if (!direccion || !ciudad || !estado || !codigoPostal) {
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

            // Simulación de envío (reemplazar con URL real del backend)
            const response = await fetch("/api/upload-comprobante", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Error al completar la compra.");
            }

            const data = await response.json();
            console.log("Datos enviados correctamente:", data);
            alert("Compra completada con éxito!");
        } catch (error) {
            console.error("Error en el envío:", error);
            alert("Hubo un problema al procesar la compra. Por favor, inténtelo de nuevo.");
        }
    };

    return (
        <Container className="payment-container">
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
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.ciudad}
                                        placeholder="Ingrese su ciudad"
                                        onChange={(e) => handleAddressChange("ciudad", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Estado</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.estado}
                                        placeholder="Ingrese su estado"
                                        onChange={(e) => handleAddressChange("estado", e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="mb-3">
                                    <Form.Label>Código Postal</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={formState.addressDetails.codigoPostal}
                                        placeholder="Ingrese su código postal"
                                        onChange={(e) => handleAddressChange("codigoPostal", e.target.value)}
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
