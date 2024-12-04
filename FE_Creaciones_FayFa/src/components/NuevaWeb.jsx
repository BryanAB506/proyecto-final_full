import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import '../styles/home.css';

function NewWeb() {
  return (
    <Container className="py-5 contSobresalir">
      <Row className="align-items-center">
        {/* Columna para el texto */}
        <Col md={6} className="sobresalir px-2 py-2">
          <h1 id="titulo1" className="mb-4">
            Que nos hace sobresalir
          </h1>
          <p id="texto2" className="textnw">
            La ropa que eliges habla de ti antes de que digas una palabra. Nos destacamos porque ofrecemos más que prendas: ofrecemos estilo, confianza y una forma de expresarte sin límites. Cada pieza que diseñamos está pensada para resaltar lo mejor de ti, combinando calidad, tendencias y detalles únicos. Nuestra misión es que te sientas auténtico y seguro, porque no se trata solo de vestirse, sino de sobresalir en cualquier ocasión. ¡Con nosotros, tu estilo es tu mejor carta de presentación!
          </p>
        </Col>

        {/* Columna para la imagen */}
        <Col md={6} className="text-center">
          <Image
            src="src/assets/img/nuevaWEB.png"
            alt="Nueva Web"
            fluid
            className="web"
            width={"auto"}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default NewWeb;
