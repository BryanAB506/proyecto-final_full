import { getProductos } from '../services/GetProductos';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from "react-bootstrap";

function Dest() {
  const [productos, setProductos] = useState([]);

  // Función para cargar productos y filtrar por categoría "hoodie"
  async function datosProductos() {
    try {
      const datos = await getProductos();
      const productosHoodie = datos.filter(producto => producto.nombre_categoria.toLowerCase() === "hoodie");
      setProductos(productosHoodie);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    }
  }

  useEffect(() => {
    datosProductos();
  }, []);

  return (
    <Row xs={2} md={3} id="cartas">
      {productos.map((producto) => (
        <Col key={producto.id} className="d-flex justify-content-center mb-4">
          <Card style={{ width: '21rem', height: 'auto' }}>
            <Card.Img variant="top" src={producto.imagen_product || 'src/assets/img/default.jpg'} />
            <Card.Body>
              <Card.Title>{producto.nombre}</Card.Title>
              <Card.Text>
                <strong>Descripción:</strong> {producto.descripcion_producto}
              </Card.Text>
              <Card.Text>
                <strong>Precio:</strong> ₡{producto.precio}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Dest;
