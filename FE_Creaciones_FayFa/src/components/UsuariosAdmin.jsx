import React from "react";
import { Accordion, Card } from "react-bootstrap";

// Datos de ejemplo
const pedidosData = [
  {
    id: 84513401,
    nombre: "brayan aragon batres",
    correo: "aragon2020@gmail.com",
    productos: [
      {
        nombre: "Nike Sportswear Club Fleece",
        precioOriginal: "69,99 €",
        precioDescuento: "48,99 €",
        talla: "S (EU 36–38)",
        color: "Light Army/Kaki",
      },
      {
        nombre: "Nike Tech",
        precioOriginal: "119,99 €",
        precioDescuento: "119,99 €",
        talla: "XL",
        color: "Game Royal/Negro",
      },
    ],
  },
];

const ListaPedidos = () => {
  return (
    <div>
      {/* Título de los pedidos */}
      <h2 className="my-4 text-center">Lista de Pedidos</h2>
      
      <Accordion>
        {pedidosData.map((pedido, index) => (
          <Accordion.Item eventKey={index.toString()} key={pedido.id}>
            <Accordion.Header>
              IDpedido: {pedido.id} | Nombre: {pedido.nombre} | Correo: {pedido.correo}
            </Accordion.Header>
            <Accordion.Body>
              <h5>Detalles del pedido</h5>
              {pedido.productos.map((producto, idx) => (
                <Card key={idx} className="mb-3">
                  <Card.Body>
                    <Card.Title>{producto.nombre}</Card.Title>
                    <Card.Text>
                      <strong>Precio Original:</strong> {producto.precioOriginal} <br />
                      <strong>Precio Descuento:</strong> {producto.precioDescuento} <br />
                      <strong>Talla:</strong> {producto.talla} <br />
                      <strong>Color:</strong> {producto.color}
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
