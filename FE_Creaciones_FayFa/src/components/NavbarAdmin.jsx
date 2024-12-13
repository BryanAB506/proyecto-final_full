import React from "react";
import { Navbar, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ handleLogout }) => {
  const navigate = useNavigate();

  return (
    <Navbar  variant="dark" expand="lg" style={{ backgroundColor: "#dddddd" }}>
      <Container>
        <Navbar.Brand href="#" style={{ color: "black" }}>Panel de Administrador</Navbar.Brand>
        <div className="d-flex justify-content-center mt-4 mb-4 w-100">
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
            onClick={() => navigate("/usuarios")}
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
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
