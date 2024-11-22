import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

function ImgsSN() {
  return (
    <Container className="imgsSobreN text-center mt-4 p-4">
      <Row className="justify-content-center">
        <Col xs={12} md={6}>
          <Image src="src/assets/img/mod1.jpeg" alt="Imagen 1" width={300} fluid />
        </Col>
        <Col xs={12} md={6}>
          <Image src="src/assets/img/mod2.jpeg" alt="Imagen 2" width={300} fluid />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col>
          <h1 className="fw-bold">Todo lo hacemos pensando en nuestros clientes</h1>
          <p className="mt-3">
            Toda las prendas las hacemos personalizadas pensando en la mayor comodidad de nuestros clientes y sacar el mayor provecho en las prendas.
          </p>
        </Col>
      </Row>
    </Container>
  );
}

export default ImgsSN;
