import React, { useState } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

function CustomNavbar() {
  // Estado local para la cantidad de productos en el carrito
  const [cartCount, setCartCount] = useState(2); // Reemplaza con la lógica

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3">
      <Container>
        {/* Logo y Nombre de la Empresa */}
        <Navbar.Brand href="#" className="d-flex align-items-center">
          <img
            src="src\\assets\\img\\logoS.jpg" 
            alt="Logo"
            className="rounded-circle"
            style={{ width: "80px", height: "80px", marginRight: "10px" }}
          />
          <span style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
            Creaciones FayFa
          </span>
        </Navbar.Brand>

        {/* Toggle para dispositivos móviles */}
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          {/* Links principales */}
          <Nav className="mx-auto" style={{ fontSize: "1.2rem" }}>
            <Nav.Link href="/home" className="mx-3">
              Inicio
            </Nav.Link>
            <Nav.Link href="/productos" className="mx-3">
              Productos
            </Nav.Link>
            <Nav.Link href="/contact" className="mx-3">
              Contacto
            </Nav.Link>
            <Nav.Link href="/sobrenosotros" className="mx-3">
              Sobre Nosotros
            </Nav.Link>
          </Nav>

          {/* Perfil, carrito de compras y registro */}
          <Nav style={{ fontSize: "1.2rem" }} className="align-items-center">
            <Dropdown align="end">
              <Dropdown.Toggle
                id="dropdown-basic"
                as="div" 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  cursor: "pointer", 
                  color: "white" 
                }}
              >
                <i
                  className="bi bi-person-circle"
                  style={{ marginRight: "8px", fontSize: "1.5rem", color: "gray" }}
                ></i>
                <span style={{ marginRight: "8px", color: "gray" }}></span>
              </Dropdown.Toggle>

              <Dropdown.Menu>
                {/* ---------------------------Información del usuario---------------------------- */}
                <Dropdown.Header className="text-center">
                  <div style={{ fontWeight: "bold" }}>Nombre del Usuario</div>
                  <div style={{ fontSize: "0.85rem" }}>
                    usuario@gmail.com
                  </div>
                </Dropdown.Header>
                <Dropdown.Divider />
                {/* --------------------------------Accesos directos----------------------------- */}
                <Dropdown.Item href="/pedidos">Pedidos</Dropdown.Item>
                {/* <Dropdown.Item href="/carritodecompras">
                  Carrito de Compras
                </Dropdown.Item> */}
                <Dropdown.Item href="/logout" className="text-danger">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Carrito con contador */}
            <Nav.Link href="/carritodecompras" className="d-flex align-items-center position-relative">
              <i
                className="bi bi-cart"
                style={{ marginRight: "8px", fontSize: "1.5rem" }}
              ></i>
              
              {/* ------------------------------cuenta de carrito-------------------------------- */}
              {cartCount > 0 && (
                <span
                  className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  style={{ fontSize: "0.8rem" }}
                >
                  {cartCount}
                  <span className="visually-hidden">productos en el carrito</span>
                </span>
              )}
            </Nav.Link>

            {/* <Nav.Link href="/register" className="d-flex align-items-center">
              <i
                className="bi bi-pencil-square"
                style={{ marginRight: "8px", fontSize: "1.5rem" }}
              ></i>
              Registro
            </Nav.Link> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
