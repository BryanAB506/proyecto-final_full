import React from "react";
import "../styles/AdminPage.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";

export default function FormAdminC() {
    return (
        <div>
            <Container className="d-flex flex-column align-items-center">
                {/* Título */}
                <h2 className="text-center mt-4">Administrador</h2>

                {/* Botones arriba */}
                <div className="d-flex justify-content-center mt-4 mb-4">
                    <Button
                        variant="dark"
                        style={{
                            backgroundColor: "#212529",
                            borderColor: "#FF5733",
                            margin: "10px",
                        }}
                    >
                        Ver pedidos de usuarios
                    </Button>
                    <Button
                        variant="dark"
                        style={{
                            backgroundColor: "#212529",
                            borderColor: "#FF5733",
                            margin: "10px",
                        }}
                    >
                        Ver usuarios
                    </Button>
                </div>

                {/* Formulario abajo */}
                <Col md={8}>
                    <h4 className="text-center">Agregar producto</h4>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Texto</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese texto" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Texto</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese texto" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Texto</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese texto" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Texto</Form.Label>
                            <Form.Control type="text" placeholder="Ingrese texto" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control as="textarea" rows={3} placeholder="Ingrese descripción" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Seleccione una imagen</Form.Label>
                            <Form.Control type="file" />
                        </Form.Group>
                        <div className="text-center">
                            <Button variant="success" type="submit">
                                Agregar
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Container>
            <br /><br />
            <div className="linea"></div>
        </div>
    );
}
