import React, { useEffect, useState } from "react";
import getUsers from "../services/GetUsers";
import { deleteUser } from "../services/DeleteUser";
import { Table, Container, Form, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Filtrar usuarios por nombre (first_name)
  const filteredUsers = users.filter((user) =>
    user.first_name.toLowerCase().includes(search.toLowerCase())
  );

  //eliminar usuario
  const handleDelete = async (userId) => {
    const result = await Swal.fire({
      title: "¿Estás seguro?",
      text: "¡No podrás revertir esta acción!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    });

    if (result.isConfirmed) {
      try {
        // Llamar a la función para eliminar el usuario
        await deleteUser(userId);

        // Actualizar el estado eliminando al usuario
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));

        // Mostrar un mensaje de éxito
        Swal.fire("¡Eliminado!", "El usuario ha sido eliminado.", "success");
      } catch (error) {
        // Si hay un error, mostrar un mensaje de error
        console.error("Error al eliminar el usuario:", error);
        Swal.fire("Error", "No se pudo eliminar el usuario.", "error");
      }
    }
  };



  return (
    <Container>
      <h2 className="my-4">Usuarios</h2>
      <Button
        variant="dark"
        style={{
          backgroundColor: "#212529",
          borderColor: "#FF5733",
          margin: "10px",
        }}
        onClick={() => {
          try {
            navigate("/admin");
          } catch (error) {
            console.error("Error navigating:", error);
          }
        }}
      >
        Volver a administrador
      </Button>

      {/* Barra de búsqueda */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Staff</th>
            <th>Date Joined</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.first_name}</td>
              <td>{user.last_name}</td>
              <td>{user.is_staff ? "Yes" : "No"}</td>
              <td>{new Date(user.date_joined).toLocaleDateString()}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(user.id)}
                  style={{
                    backgroundColor: "#212529",
                    borderColor: "#FF5733",
                    margin: "1px",
                  }}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Usuarios;
