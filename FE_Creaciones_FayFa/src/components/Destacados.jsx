import { getProductos } from '../services/GetProductos';
import React, { useEffect, useState, } from 'react';
import { Row, Col, Card } from "react-bootstrap";

function Dest() {

  const [productos, setProductos] = useState([])


  async function datosProductos() {
    const datos = await getProductos()
    setProductos(datos)
  }
  useEffect(() => {
    datosProductos()
  }, [])


  return (
    <Row xs={2} md={3} id='cartas'>
      {Array.from({ length: 6 }).map((_, idx) => (
        <Col key={idx} className="d-flex justify-content-center">
          <Card style={{ width: '21rem', height: 'auto' }}>
            <Card.Img variant="top" src="src\assets\img\vestido.jpg" />
            <Card.Body>
              <Card.Title>Card title</Card.Title>
              <Card.Text>
                This is a longer card with supporting text below as a natural
                lead-in to additional content.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
}

export default Dest;
