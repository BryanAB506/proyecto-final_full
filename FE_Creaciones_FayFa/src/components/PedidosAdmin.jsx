import React, { useEffect, useState } from "react";
import { Accordion, Card, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { obtenerPedidos, eliminarPedido } from "../services/PedidosAdminservices";
import { obtenerDireccionesEnvio } from "../services/GetDireccion";

const ListaPedidos = () => {
    const [pedidosData, setPedidosData] = useState([]);
    const [direccionesEnvio, setDireccionesEnvio] = useState([]);
    const [pagosData, setPagosData] = useState([]);
    const [showModal, setShowModal] = useState(false); // Estado para controlar el modal
    const [comprobanteUrl, setComprobanteUrl] = useState(""); // URL del comprobante actual
    const navigate = useNavigate();

    // Fetch de pedidos, direcciones y pagos
    useEffect(() => {
        const fetchData = async () => {
            try {
                const pedidos = await obtenerPedidos();
                const direcciones = await obtenerDireccionesEnvio();
                const responsePagos = await fetch("http://127.0.0.1:8000/api/pagos/");
                const pagos = await responsePagos.json();

                if (pedidos) setPedidosData(pedidos);
                if (direcciones) setDireccionesEnvio(direcciones);
                if (pagos) setPagosData(pagos);
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            }
        };

        fetchData();
    }, []);

    const obtenerDireccionUsuario = (email) => {
        if (!email) {
            return "Dirección no disponible";
        }
        const direccion = direccionesEnvio.find((dir) => dir.email_usuario === email);
        return direccion
            ? `${direccion.direccion}, ${direccion.Distrito}, ${direccion.Canton}, ${direccion.provincia}, C.P. ${direccion.codigo_postal}`
            : "Dirección no disponible";
    };

    const obtenerPagoPedido = (pedidoId) => {
        const pago = pagosData.find((pago) => pago.Ordenes === pedidoId);
        return pago
            ? {
                  metodo: pago.metodo_pago,
                  comprobante: pago.comprobante_pago,
              }
            : null;
    };

    const handleEliminarPedido = async (pedidoId) => {
        try {
            const result = await eliminarPedido(pedidoId);
            if (result.message) {
                setPedidosData((prevPedidos) =>
                    prevPedidos.filter((pedido) => pedido.id !== pedidoId)
                );
                Swal.fire({
                    title: "Éxito",
                    text: "Pedido eliminado exitosamente.",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "Hubo un error al eliminar el pedido.",
                    icon: "error",
                    confirmButtonText: "Aceptar",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al eliminar el pedido.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    const cambiarEstadoPedido = async (pedidoId, nuevoEstado) => {
        const token = sessionStorage.getItem("access_token");
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/actualizar-estado/${pedidoId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el estado del pedido");
            }

            setPedidosData((prevPedidos) =>
                prevPedidos.map((pedido) =>
                    pedido.id === pedidoId ? { ...pedido, estado: nuevoEstado } : pedido
                )
            );
            Swal.fire({
                title: "Éxito",
                text: "Estado del pedido actualizado exitosamente.",
                icon: "success",
                confirmButtonText: "Aceptar",
            });
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un error al cambiar el estado del pedido.",
                icon: "error",
                confirmButtonText: "Aceptar",
            });
        }
    };

    const abrirModalComprobante = (url) => {
        setComprobanteUrl(url);
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setComprobanteUrl("");
    };

    return (
        <div>
            <h2 className="my-4 text-center">Lista de Pedidos</h2>
            <Button
                variant="dark"
                style={{
                    backgroundColor: "#212529",
                    borderColor: "#FF5733",
                    margin: "10px",
                }}
                onClick={() => navigate("/admin")}
            >
                Volver a administrador
            </Button>

            <Accordion>
                {pedidosData.map((pedido, index) => {
                    const emailUsuario = pedido.email;
                    const pago = obtenerPagoPedido(pedido.id);

                    return (
                        <Accordion.Item eventKey={index.toString()} key={pedido.id}>
                            <Accordion.Header>
                                ID Pedido: {pedido.id} | Cliente: {pedido.usuario_nombre}{" "}
                                {pedido.usuario_apellido} | Fecha del Pedido:{" "}
                                {new Date(pedido.fecha_orden).toLocaleDateString()} | Estado:{" "}
                                {pedido.estado}
                            </Accordion.Header>

                            <Accordion.Body>
                                <h5>Detalles del Pedido</h5>
                                <p>
                                    <strong>Correo del Usuario:</strong> {pedido.email}
                                </p>
                                <p>
                                    <strong>Dirección de Envío:</strong>{" "}
                                    {obtenerDireccionUsuario(emailUsuario)}
                                </p>
                                <h5>Productos:</h5>
                                {pedido.productos.length > 0 ? (
                                    pedido.productos.map((producto, idx) => (
                                        <Card key={idx} className="mb-3">
                                            <Card.Body>
                                                <Card.Title>{producto.nombre}</Card.Title>
                                                <Card.Text>
                                                    <strong>Descripción:</strong>{" "}
                                                    {producto.descripcion} <br />
                                                    <strong>Precio:</strong> ${producto.precio}{" "}
                                                    <br />
                                                    <strong>Categoría:</strong>{" "}
                                                    {producto.categoria} <br />
                                                    <strong>Cantidad:</strong> {producto.cantidad}
                                                </Card.Text>
                                            </Card.Body>
                                        </Card>
                                    ))
                                ) : (
                                    <p>No hay productos en este pedido.</p>
                                )}

                                <h5>Datos del Pago</h5>
                                {pago ? (
                                    <div>
                                        <p>
                                            <strong>Método de Pago:</strong> {pago.metodo}
                                        </p>
                                        {pago.comprobante && pago.comprobante !== "sin comprobante" ? (
                                            <p>
                                                <strong>Comprobante:</strong>{" "}
                                                <Button
                                                    variant="link"
                                                    onClick={() =>
                                                        abrirModalComprobante(pago.comprobante)
                                                    }
                                                >
                                                    Ver comprobante
                                                </Button>
                                            </p>
                                        ) : (
                                            <p>No hay comprobante disponible para este pago.</p>
                                        )}
                                    </div>
                                ) : (
                                    <p>No hay información de pago para este pedido.</p>
                                )}

                                <div style={{ marginTop: "20px" }}>
                                    <label htmlFor={`estado-select-${pedido.id}`}>
                                        <strong>Cambiar Estado:</strong>
                                    </label>
                                    <select
                                        id={`estado-select-${pedido.id}`}
                                        value={pedido.estado}
                                        onChange={(e) =>
                                            cambiarEstadoPedido(pedido.id, e.target.value)
                                        }
                                        style={{ marginLeft: "10px", padding: "5px" }}
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="procesando">Procesando</option>
                                        <option value="enviado">Enviado</option>
                                        <option value="entregado">Entregado</option>
                                    </select>
                                </div>

                                <Button
                                    variant="danger"
                                    onClick={() => handleEliminarPedido(pedido.id)}
                                    style={{
                                        backgroundColor: "#212529",
                                        borderColor: "#FF5733",
                                        margin: "10px",
                                    }}
                                >
                                    Eliminar Pedido
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    );
                })}
            </Accordion>

            {/* Modal para mostrar el comprobante */}
            <Modal show={showModal} onHide={cerrarModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Comprobante de Pago</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {comprobanteUrl ? (
                        <img
                            src={comprobanteUrl}
                            alt="Comprobante de Pago"
                            style={{ width: "100%" }}
                        />
                    ) : (
                        <p>No hay comprobante disponible.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cerrarModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ListaPedidos;
