import React, { useEffect, useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { obtenerPedidos, eliminarPedido } from "../services/PedidosAdminservices";

const ListaPedidos = () => {
    const [pedidosData, setPedidosData] = useState([]);
    const navigate = useNavigate();

    // Función para cargar las órdenes desde la API
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const data = await obtenerPedidos();
                if (data) {
                    setPedidosData(data);  // Almacena los datos obtenidos en el estado
                }
            } catch (error) {
                console.error("Error al cargar las órdenes:", error);
            }
        };

        fetchPedidos();
    }, []);

    // Función para eliminar un pedido
    const handleEliminarPedido = async (pedidoId) => {
        try {
            const result = await eliminarPedido(pedidoId);
            // Si la eliminación es exitosa, actualizamos la lista de pedidos
            if (result.message) {
                setPedidosData((prevPedidos) =>
                    prevPedidos.filter((pedido) => pedido.id !== pedidoId)
                );
                alert("Pedido eliminado exitosamente.");
            } else {
                alert("Hubo un error al eliminar el pedido.");
            }
        } catch (error) {
            alert("Ocurrió un error al eliminar el pedido.");
        }
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
                {pedidosData.map((pedido, index) => (
                    <Accordion.Item eventKey={index.toString()} key={pedido.id}>
                        <Accordion.Header>
                            ID Pedido: {pedido.id} | Cliente: {pedido.usuario_nombre} | Fecha del Pedido: {new Date(pedido.fecha_orden).toLocaleDateString()} | Estado: {pedido.estado}
                        </Accordion.Header>
                        <Accordion.Body>
                            <h5>Detalles del Pedido</h5>
                            <p><strong>Correo del Usuario:</strong> {pedido.email}</p>
                            <p><strong>Productos:</strong></p>
                            {pedido.productos.length > 0 ? (
                                pedido.productos.map((producto, idx) => (
                                    <Card key={idx} className="mb-3">
                                        <Card.Body>
                                            <Card.Title>{producto.nombre}</Card.Title>
                                            <Card.Text>
                                                <strong>Descripción:</strong> {producto.descripcion} <br />
                                                <strong>Precio:</strong> ${producto.precio} <br />
                                                <strong>Categoría:</strong> {producto.categoria} <br />
                                                <strong>Cantidad:</strong> {producto.cantidad}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                ))
                            ) : (
                                <p>No hay productos en este pedido.</p>
                            )}
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
                ))}
            </Accordion>
        </div>
    );
};

export default ListaPedidos;
