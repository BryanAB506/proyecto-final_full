import React, { useContext, useState, useEffect } from "react";
import "../styles/AdminPage.css";
import { Table, Form, Button, Container, Col, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import PostCategorias from "../services/PostCategorias";
import getCategorias from "../services/GetCategorias";
import postProductos from "../services/PostProductos";
import { UploadFile } from "../firebase/Config";
import FayFaContext from "../Context/FayFaContext";
import { deleteCategoria, updateCategoria } from "../services/DeletePutCategorias";

export default function FormAdminC() {
  const { logout, setNuevoProducto } = useContext(FayFaContext);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/"); // Redirige a login
  };

  // Estados para categorías
  const [nombre_categoria, setnombre_categoria] = useState("");
  const [descripcion, setdescripcion] = useState("");
  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");

  // Estados para productos
  const [nombre, setnombre] = useState("");
  const [descripcion_producto, setdescripcion_producto] = useState("");
  const [precio, setprecio] = useState("");
  const [stock, setstock] = useState("");
  const [imagen_product, setimagen_product] = useState("");

  // Cargar categorías desde la API
  const obtenerCategoria = async () => {
    try {
      const categoriasF = await getCategorias();
      setCategorias(categoriasF); // Actualiza el estado con las categorías
    } catch (error) {
      console.error({ message: error });
    }
  };

  useEffect(() => {
    obtenerCategoria();
  }, []);

  // Manejar cambios en los formularios
  const cargarCategorias = (e) => setnombre_categoria(e.target.value);
  const cargarDescripcion = (e) => setdescripcion(e.target.value);
  const cargarNombre = (e) => setnombre(e.target.value);
  const cargarDescripcion_producto = (e) => setdescripcion_producto(e.target.value);
  const cargarPrecio = (e) => setprecio(e.target.value);
  const cargarStock = (e) => setstock(e.target.value);
  const handleCategoriaChange = (e) => setSelectedCategoria(e.target.value);

  // Subir imágenes
  const CargarImagen = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const resultado = await UploadFile(file);
      setimagen_product(resultado);
    }
  };

  // Agregar una categoría
  const cargarCategory = async (e) => {
    e.preventDefault();

    try {
      await PostCategorias(nombre_categoria, descripcion);
      Swal.fire("Se ha ingresado la categoría!");
      obtenerCategoria(); // Refresca la lista de categorías

      // Limpiar formulario
      setnombre_categoria("");
      setdescripcion("");
    } catch (error) {
      console.error(error);
    }
  };

  // Agregar un producto
  const cargarProductos = async (e) => {
    e.preventDefault();

    if (
      !nombre.trim() ||
      !descripcion_producto.trim() ||
      !precio.trim() ||
      !stock.trim() ||
      !selectedCategoria.trim() ||
      !imagen_product
    ) {
      Swal.fire(
        "Error",
        "Todos los campos son obligatorios y no pueden contener solo espacios.",
        "error"
      );
      return;
    }

    try {
      const productoAgregado = await postProductos(
        nombre,
        descripcion_producto,
        precio,
        stock,
        selectedCategoria,
        imagen_product
      );
      setNuevoProducto(productoAgregado);
      Swal.fire("Producto agregado con éxito.");

      // Limpiar formulario
      setnombre("");
      setdescripcion_producto("");
      setprecio("");
      setstock("");
      setSelectedCategoria("");
      setimagen_product("");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      Swal.fire("Hubo un error al agregar el producto.");
    }
  };

  // Eliminar una categoría
  const handleDeleteCategoria = async (id) => {
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
        await deleteCategoria(id);
        setCategorias(categorias.filter((c) => c.id !== id));
        Swal.fire("¡Eliminado!", "La categoría ha sido eliminada.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
      }
    }
  };

  // Editar una categoría
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  const handleEditCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria); // Guarda la categoría seleccionada
    setShowEditModal(true); // Abre el modal
  };

  const saveCategoriaEditada = async () => {
    try {
      await updateCategoria(categoriaSeleccionada.id, {
        nombre_categoria: categoriaSeleccionada.nombre_categoria,
        descripcion: categoriaSeleccionada.descripcion,
      });
      Swal.fire("¡Actualizado!", "La categoría ha sido actualizada.", "success");
      obtenerCategoria(); // Recarga la lista de categorías
      setShowEditModal(false); // Cierra el modal
    } catch (error) {
      Swal.fire("Error", "No se pudo actualizar la categoría.", "error");
    }
  };

  return (
    <div>
      <Container className="d-flex flex-column align-items-center">
        <h2 className="text-center mt-4">Administrador</h2>

        <Col md={8}>
          <h4 className="text-center">Agregar categoría</h4>
          <Form onSubmit={cargarCategory}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la categoría</Form.Label>
              <Form.Control
                type="text"
                value={nombre_categoria}
                onChange={cargarCategorias}
                placeholder="Ingrese nombre de la categoría"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                value={descripcion}
                onChange={cargarDescripcion}
                rows={3}
                placeholder="Ingrese descripción"
              />
            </Form.Group>
            <div className="text-center">
              <Button variant="primary" type="submit">
                Agregar nueva categoría
              </Button>
            </div>
          </Form>
        </Col>

        <Container>
          <Table striped bordered hover responsive className="my-4">
            <thead className="table-dark">
              <tr>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nombre_categoria}</td>
                  <td>{categoria.descripcion}</td>
                  <td>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleEditCategoria(categoria)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      style={{margin: "10px"}}
                      onClick={() => handleDeleteCategoria(categoria.id)}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>

        <Col md={8}>
          <h4 className="text-center">Agregar producto</h4>
          <Form onSubmit={cargarProductos}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={nombre}
                onChange={cargarNombre}
                placeholder="Ingrese nombre del producto"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                value={descripcion_producto}
                onChange={cargarDescripcion_producto}
                placeholder="Ingrese descripción"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Precio</Form.Label>
              <Form.Control
                type="text"
                value={precio}
                onChange={cargarPrecio}
                placeholder="Ingrese precio"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Stock</Form.Label>
              <Form.Control
                type="text"
                value={stock}
                onChange={cargarStock}
                placeholder="Ingrese stock"
              />
            </Form.Group>
            <Form.Label>Categorías</Form.Label>
            <Form.Select value={selectedCategoria} onChange={handleCategoriaChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </Form.Select>
            <Form.Group className="mb-3">
              <Form.Label>Imagen del producto</Form.Label>
              <Form.Control type="file" onChange={CargarImagen} />
            </Form.Group>
            <div className="text-center">
              <Button variant="success" type="submit">
                Agregar nuevo producto
              </Button>
            </div>
          </Form>
        </Col>
      </Container>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Categoría</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la categoría</Form.Label>
              <Form.Control
                type="text"
                value={categoriaSeleccionada?.nombre_categoria || ""}
                onChange={(e) =>
                  setCategoriaSeleccionada({
                    ...categoriaSeleccionada,
                    nombre_categoria: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                value={categoriaSeleccionada?.descripcion || ""}
                onChange={(e) =>
                  setCategoriaSeleccionada({
                    ...categoriaSeleccionada,
                    descripcion: e.target.value,
                  })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={saveCategoriaEditada}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
