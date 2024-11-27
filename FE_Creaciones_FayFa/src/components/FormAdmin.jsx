import React  from "react";
import "../styles/AdminPage.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PostCategorias from '../services/PostCategorias'

export default function FormAdminC() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // cerrar sesión
    navigate('/'); // Redirige a login
  };


  const [nombre_categoria, setnombre_categoria] = useState('')
  const [descripcion, setdescripcion] = useState('')

  const cargarCategorias = (e) => {
      setnombre_categoria(e.target.value);
  }

  const cargarDescripcion = (e) => {
      setdescripcion(e.target.value);
  }

  const cargarCategory = async (e) => {
      e.preventDefault();

      try {
          await PostCategorias(nombre_categoria, descripcion)
          Swal.fire("Se ha ingresado las categorias!");

      } catch (error) {
          console.log(error);
          
      }

    }



  

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
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>




        {/* Formulario para agregar categoría */}
        <Col md={8}>
          <h4 className="text-center">Agregar categoría</h4>
          <Form onSubmit={cargarCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la categoría</Form.Label>
              <Form.Control type="text" value={nombre_categoria} onChange={cargarCategorias} placeholder="Ingrese nombre de la categoría" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control as="textarea" value={descripcion} onChange={cargarDescripcion} rows={3} placeholder="Ingrese descripción" />
            </Form.Group>
            <div className="text-center">
              <Button
                variant="primary"
                type="submit"
                style={{
                  backgroundColor: "#212529",
                  borderColor: "#FF5733",
                  margin: "10px",
                }}
              >
                Agregar nueva categoría
              </Button>
            </div>
          </Form>
        </Col>

        <br />
        <div className="linea"></div>
        <br />






        {/* Formulario para agregar producto */}
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
              <Button
                variant="success"
                type="submit"
                style={{
                  backgroundColor: "#212529",
                  borderColor: "#FF5733",
                  margin: "10px",
                }}
              >
                Agregar nuevo producto
              </Button>
            </div>
          </Form>
        </Col>
      </Container>
      <br />
      <br />
      <div className="linea"></div>
    </div>
  );
}
