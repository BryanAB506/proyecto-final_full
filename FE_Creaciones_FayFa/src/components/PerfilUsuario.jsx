import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import { fetchUserData } from "../services/GetUserNavbar";
import { obtenerDireccionesEnvio } from "../services/GetDireccion";
import Swal from "sweetalert2";

export const UsuarioPerfil = () => {
    const [user, setUser] = useState(null);
    const [showUserModal, setShowUserModal] = useState(false);
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
    });
    const [direcciones, setDirecciones] = useState([]); // Estado para las direcciones del usuario
    const [selectedAddress, setSelectedAddress] = useState(""); // Dirección seleccionada para editar
    const [addressData, setAddressData] = useState({
        id: "",
        provincia: "",
        Canton: "",
        Distrito: "",
        direccion: "",
        codigo_postal: "",
    });

    // Obtener la información del usuario logueado
    const getUserData = async () => {
        try {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                console.log("No token found");
                return;
            }

            const userData = await fetchUserData();

            setUser(userData);
            setFormData({
                username: userData.username,
                email: userData.email,
                first_name: userData.first_name,
                last_name: userData.last_name,
            });

            // Cargar las direcciones después de obtener el usuario
            getDirecciones(userData.id_usuario); // Usar id_usuario aquí
        } catch (error) {
            console.error("Error al obtener la información del usuario:", error);
            Swal.fire({
                title: "Error",
                text: "No se pudo cargar la información del usuario.",
                icon: "error",
            });
        }
    };

    const getDirecciones = async (userId) => {
        try {
            if (!userId) {
                console.error("Error: El ID del usuario está indefinido.");
                return;
            }

            const data = await obtenerDireccionesEnvio();
            if (data) {
                // Filtrar direcciones por el ID del usuario
                const userDirecciones = data.filter((direccion) => direccion.Usuarios === userId);
                setDirecciones(userDirecciones);

                // Si hay direcciones, establecer la primera como predeterminada
                if (userDirecciones.length > 0) {
                    const { id, provincia, Canton, Distrito, direccion, codigo_postal } = userDirecciones[0];
                    setSelectedAddress(`${provincia}, ${Canton}, ${Distrito}, ${direccion} - ${codigo_postal}`);
                    setAddressData({
                        id,
                        provincia,
                        Canton,
                        Distrito,
                        direccion,
                        codigo_postal,
                    });
                } else {
                    setSelectedAddress("No se encontraron direcciones.");
                }
            } else {
                console.error("Error: No se recibieron datos del endpoint.");
            }
        } catch (error) {
            console.error("Error al obtener las direcciones:", error);
        }
    };

    useEffect(() => {
        getUserData();
    }, []);

    const handleShowUserModal = () => setShowUserModal(true);
    const handleCloseUserModal = () => setShowUserModal(false);

    const handleShowAddressModal = () => setShowAddressModal(true);
    const handleCloseAddressModal = () => setShowAddressModal(false);

    const handleUserInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleAddressEdit = (direccion) => {
        setAddressData({
            id: direccion.id, // Asegúrate de que este campo esté presente
            provincia: direccion.provincia || "",
            Canton: direccion.Canton || "",
            Distrito: direccion.Distrito || "",
            direccion: direccion.direccion || "",
            codigo_postal: direccion.codigo_postal || "",
        });
        setShowAddressModal(true);
    };

    const handleAddressInputChange = (e) => {
        const { name, value } = e.target;
        setAddressData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSaveAddressChanges = async () => {
        try {
            const token = sessionStorage.getItem("access_token");
            if (!token) {
                Swal.fire({
                    title: "Error",
                    text: "No se encontró el token de acceso.",
                    icon: "error",
                });
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/Direcciones_envio/${addressData.id}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    provincia: addressData.provincia, // Usar addressData
                    Canton: addressData.Canton,
                    Distrito: addressData.Distrito,
                    direccion: addressData.direccion,
                    codigo_postal: addressData.codigo_postal,
                }),
            });

            if (response.ok) {
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Tu dirección ha sido actualizada correctamente.",
                    icon: "success",
                });
                handleCloseAddressModal();
                getDirecciones(user.id_usuario); // Recargar direcciones
            } else {
                const errorData = await response.json();
                Swal.fire({
                    title: "Error",
                    text: `No se pudo actualizar la dirección. Detalles: ${errorData.detail || "Error desconocido"}`,
                    icon: "error",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un problema al guardar la dirección.",
                icon: "error",
            });
        }
    };

    if (!user) {
        return <p>Cargando datos del usuario...</p>;
    }

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h3>Información del Usuario</h3>
                    <p><strong>Nombre de usuario:</strong> {user.username}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Nombre:</strong> {user.first_name}</p>
                    <p><strong>Apellido:</strong> {user.last_name}</p>
                    {direcciones.length > 0 && (
                        <p><strong>Dirección:</strong> {selectedAddress || "No definida"}</p>
                    )}
                    <div className="d-flex flex-wrap mt-3">
                        <Button
                            variant="primary"
                            className="me-2 mb-2"
                            style={{ backgroundColor: "#212529", borderColor: "#FF5733" }}
                            onClick={handleShowUserModal}
                        >
                            Editar Datos
                        </Button>
                        <Button
                            variant="secondary"
                            className="mb-2"
                            style={{ backgroundColor: "#212529", borderColor: "#FF5733" }}
                            onClick={() => handleAddressEdit(direcciones[0])} // Editar la primera dirección
                        >
                            Editar Dirección
                        </Button>
                    </div>
                </Col>
            </Row>

            {/* Modal para editar datos del usuario */}
            <Modal show={showUserModal} onHide={handleCloseUserModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Datos</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formUsername" className="mb-3">
                            <Form.Label>Nombre de usuario:</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleUserInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail" className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleUserInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formFirstName" className="mb-3">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleUserInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formLastName" className="mb-3">
                            <Form.Label>Apellido</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleUserInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleCloseUserModal}
                        style={{ backgroundColor: "#212529", borderColor: "#FF5733" }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        style={{ backgroundColor: "#212529", borderColor: "#FF5733" }}
                    >
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal para editar dirección */}
            <Modal show={showAddressModal} onHide={handleCloseAddressModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Dirección</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formProvincia" className="mb-3">
                            <Form.Label>Provincia</Form.Label>
                            <Form.Control
                                type="text"
                                name="provincia"
                                value={addressData.provincia}
                                onChange={handleAddressInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCanton" className="mb-3">
                            <Form.Label>Cantón</Form.Label>
                            <Form.Control
                                type="text"
                                name="Canton"
                                value={addressData.Canton}
                                onChange={handleAddressInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDistrito" className="mb-3">
                            <Form.Label>Distrito</Form.Label>
                            <Form.Control
                                type="text"
                                name="Distrito"
                                value={addressData.Distrito}
                                onChange={handleAddressInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDireccion" className="mb-3">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                name="direccion"
                                value={addressData.direccion}
                                onChange={handleAddressInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCodigoPostal" className="mb-3">
                            <Form.Label>Código Postal</Form.Label>
                            <Form.Control
                                type="text"
                                name="codigo_postal"
                                value={addressData.codigo_postal}
                                onChange={handleAddressInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={handleCloseAddressModal}
                        style={{ backgroundColor: "#212529", borderColor: "#FF5733" }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSaveAddressChanges}
                        style={{ backgroundColor: "#212529", borderColor: "#FF5733" }}
                    >
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};
