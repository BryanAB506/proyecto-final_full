import React from "react";
import "../styles/AdminPage.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FormAdminC() {

    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(); // Simula cerrar sesión
        navigate('/loginprueba'); // Redirige a Home
      };
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
                        onClick={() => navigate("/pedidosadmin")}
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
                    <Button
                        variant="dark"
                        style={{
                            backgroundColor: "#212529",
                            borderColor: "#FF5733",
                            margin: "10px",
                        }}
                        onClick={handleLogout}>
                        cerrar sesion
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
                            <Button variant="success" type="submit"
                            style={{
                                backgroundColor: "#212529",
                                borderColor: "#FF5733",
                                margin: "10px",
                            }}>
                                Agregar nuevo producto
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
