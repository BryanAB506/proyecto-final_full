import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { fetchCartData } from "../services/GetContadorCarrito";
import { fetchUserData } from "../services/GetUserNavbar";
import { useNavigate } from 'react-router-dom';

function CustomNavbar() {
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState(null);  // Para almacenar los datos del usuario

  const navigate = useNavigate();

  const salir = () => {
    // Redirigir a la página de login
    navigate('/');
  };

  // Obtener la información del carrito
  const getCartData = async () => {
    try {
      const data = await fetchCartData();
      setCartCount(data.cart_items.length);
    } catch (error) {
      console.error("Error al obtener el carrito:", error);
    }
  };

  // Obtener la información del usuario logueado
  const getUserData = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) {
        console.log("No token found");
        return; // Si no hay token, no hacemos la solicitud
      }

      const userData = await fetchUserData();  // Llamada para obtener el usuario
      setUser(userData);  // Guardamos los datos del usuario logueado
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
    }
  };

  useEffect(() => {
    getCartData();

    // Actualizar los datos del carrito cada 500 ms
    const intervalId = setInterval(() => {
      getCartData();
    }, 500);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Solo se llama a getUserData si hay un token en sessionStorage
    if (sessionStorage.getItem("access_token")) {
      getUserData();
    }
  }, []); // Esto se ejecutará una vez cuando el componente se cargue

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="py-3" style={{ borderBottom: '5px solid #D4AF37' }}>
      <Container>
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

        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
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

          <Nav style={{ fontSize: "1.2rem" }} className="d-flex align-items-center">
            {/* Contenedor de perfil y carrito */}
            <div style={{ display: "flex", alignItems: "center", marginRight: "10px" }}>
              {/* Perfil */}
              <Dropdown align="start">
                <Dropdown.Toggle
                  id="dropdown-basic"
                  as="div"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    color: "white",
                  }}
                >
                  <i
                    className="bi bi-person-circle"
                    style={{ marginRight: "8px", fontSize: "1.5rem", color: "gray" }}
                  ></i>
                  <span style={{ fontSize: "1rem", color: "white" }}>
                    {user
                      ? `${user.first_name} ${user.last_name}`
                      : sessionStorage.getItem("access_token")
                        ? "Cargando..."
                        : "Iniciar sesión"}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header className="text-center">
                    <div style={{ fontWeight: "bold" }}>
                      {user ? `${user.first_name} ${user.last_name}` : "Cargando..."}
                    </div>
                    <div style={{ fontSize: "0.85rem" }}>
                      {user ? user.email : "Cargando..."}
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item href="/perfil">Cuenta</Dropdown.Item>
                  <Dropdown.Item href="/">Iniciar sesión</Dropdown.Item>
                  <Dropdown.Item className="text-danger" onClick={salir}>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

              {/* Carrito */}
              <Nav.Link
                href="/carritodecompras"
                className="d-flex align-items-center position-relative"
              >
                <i
                  className="bi bi-cart"
                  style={{ marginRight: "8px", fontSize: "1.5rem" }}
                ></i>

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
            </div>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CustomNavbar;
