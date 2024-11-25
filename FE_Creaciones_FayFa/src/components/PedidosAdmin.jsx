import React from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// Datos de ejemplo
const pedidosData = [
    {
        id: 481,
        nombre: "Brayan Aragon Batres",
        correo: "aragon2020@gmail.com",
        fechaPedido: "2024-11-25",
        estadoPedido: "En proceso",
        productos: [
            {
                nombre: "Nike Sportswear Club Fleece",
                descripcion: "swear deportivo mujer, naranja",
                precio: "48,99 €",
                categoria: "Light Army/Kaki",
            },
            {
                nombre: "Nike Tech",
                descripcion: "swear deportivo bien feo",
                precio: "48,99 €",
                categoria: "sueter",
            },
        ],
    },
];

const ListaPedidos = () => {
    const navigate = useNavigate(); // Hook para la navegación

    return (
        <div>
            {/* Título de los pedidos */}
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
                            IDpedido: {pedido.id} | Nombre: {pedido.nombre} | Correo: {pedido.correo} | Fecha del Pedido: {pedido.fechaPedido} | Estado del Pedido: {pedido.estadoPedido}
                        </Accordion.Header>
                        <Accordion.Body>
                            <h5>Detalles del pedido</h5>
                            <p><strong>Fecha del Pedido:</strong> {pedido.fechaPedido}</p>
                            <p><strong>Productos:</strong></p>
                            {pedido.productos.map((producto, idx) => (
                                <Card key={idx} className="mb-3">
                                    <Card.Body>
                                        <Card.Title>{producto.nombre}</Card.Title>
                                        <Card.Text>
                                            <strong>Descripcion:</strong> {producto.descripcion} <br />
                                            <strong>Precio:</strong> {producto.precio} <br />
                                            <strong>Categoria:</strong> {producto.categoria}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            ))}
                        </Accordion.Body>
                    </Accordion.Item>
                ))}
            </Accordion>
        </div>
    );
};

export default ListaPedidos;
