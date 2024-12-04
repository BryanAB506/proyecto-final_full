import React, { useEffect, useState } from "react";
import getUsers from "../services/GetUsers";
import { Table, Container, Form, Row, Col } from "react-bootstrap";

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(""); 

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

  return (
    <Container>
      <h2 className="my-4">Usuarios</h2>

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
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Usuarios;
