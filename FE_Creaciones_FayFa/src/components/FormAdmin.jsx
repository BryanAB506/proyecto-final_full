import React, { useContext } from "react";
import "../styles/AdminPage.css";
import { Table, Form, Button, Container, Row, Col, Modal } from "react-bootstrap";
// import { useAuth } from "../Context/AuthContext";
import { Await, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PostCategorias from '../services/PostCategorias';
import getCategorias from "../services/GetCategorias";
import postProductos from "../services/PostProductos";
import Swal from 'sweetalert2'
import { UploadFile } from '../firebase/Config'
import FayFaContext from "../Context/FayFaContext";
import { deleteCategoria, updateCategoria } from "../services/DeletePutCategorias";


export default function FormAdminC() {
  const { logout, setNuevoProducto } = useContext(FayFaContext);
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleLogout = () => {
    logout(); // cerrar sesión
    navigate('/'); // Redirige a login
  };


  const [nombre_categoria, setnombre_categoria] = useState('')
  const [descripcion, setdescripcion] = useState('')


  const [categorias, setCategorias] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState("");

  const handleCategoriaChange = (e) => {
    setSelectedCategoria(e.target.value);
  };

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
      obtenerCategoria();// refresca 

    } catch (error) {
      console.log(error);

    }

  }

  const obtenerCategoria = async () => {
    try {
      const categoriasF = await getCategorias();
      setCategorias(categoriasF)//actuaciza el estado
    } catch (error) {
      console.error({ message: error })
    }
  }

  useEffect(() => {
    obtenerCategoria();
  }, []);


  const agregarProducto = (e) => {
    e.preventDefault();
    Swal.fire(`Producto agregado a la categoría ${selectedCategoria}`);
  };



  const [nombre, setnombre] = useState('')
  const [descripcion_producto, setdescripcion_producto] = useState('')
  const [precio, setprecio] = useState('')
  const [stock, setstock] = useState('')


  const cargarNombre = (e) => {
    setnombre(e.target.value);
  }

  const cargarDescripcion_producto = (e) => {
    setdescripcion_producto(e.target.value);
  }

  const cargarPrecio = (e) => {
    setprecio(e.target.value);
  }


  const cargarStok = (e) => {
    setstock(e.target.value);
  }

  const cargarProductos = async (e) => {
    e.preventDefault();

    // Validar que los campos no estén vacíos o contengan solo espacios
    //trim(): Este método elimina los espacios en blanco al inicio y al final de una cadena. Si la cadena está vacía o solo contiene espacios, devolverá una cadena vacía.
    if (
      !nombre.trim() ||
      !descripcion_producto.trim() ||
      !precio.trim() ||
      !stock.trim() ||
      !selectedCategoria.trim() ||
      !imagen_product
    ) {
      Swal.fire("Error", "Todos los campos son obligatorios y no pueden contener solo espacios.", "error");
      return;
    }



    try {
      const productoAgregado = await postProductos(nombre, descripcion_producto, precio, stock, selectedCategoria, imagen_product);
      setNuevoProducto(productoAgregado)

      Swal.fire("Producto agregado con éxito.");
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      Swal.fire("Hubo un error al agregar el producto.");
    }
  };




  const [imagen_product, setimagen_product] = useState("")
  //aplicaas el hooks
  const CargarImagen = async (e) => {
    const file = e.target.files[0]
    setimagen_product(file)
    if (file) {
      const resultado = await UploadFile(file);
      setimagen_product(resultado)
    }

  } // la funcion cargarImagen


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
        await deleteCategoria(id); // Llama a la función de eliminación
        setCategorias(categorias.filter((c) => c.id !== id)); // Actualiza el estado local
        Swal.fire("¡Eliminado!", "La categoría ha sido eliminada.", "success");
      } catch (error) {
        Swal.fire("Error", "No se pudo eliminar la categoría.", "error");
      }
    }
  };


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
        {/* Título */}
        <h2 className="text-center mt-4">Administrador</h2><br /><br />



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

        <Container>
          {/* --------------tabla categorias------------------*/}
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
                      style={{
                        backgroundColor: "#212529",
                        borderColor: "#FF5733",
                        margin: "10px",
                      }}
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleEditCategoria(categoria)}
                    >
                      Editar
                    </Button>
                    <Button
                      style={{
                        backgroundColor: "#212529",
                        borderColor: "#FF5733",
                        margin: "5px",
                      }}
                      variant="danger"
                      size="sm"
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


        <br />
        <div className="linea"></div>
        <br />






        {/* Formulario para agregar producto */}
        <Col md={8}>
          <h4 className="text-center">Agregar producto</h4>
          <Form onSubmit={cargarProductos}>
            <Form.Group className="mb-3">
              <Form.Label>nombre</Form.Label>
              <Form.Control type="text" value={nombre} onChange={cargarNombre} placeholder="Ingrese texto" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>descripcion_producto</Form.Label>
              <Form.Control type="text" value={descripcion_producto} onChange={cargarDescripcion_producto} placeholder="Ingrese texto" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>precio</Form.Label>
              <Form.Control type="text" value={precio} onChange={cargarPrecio} placeholder="Ingrese texto" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>stock</Form.Label>
              <Form.Control type="text" value={stock} onChange={cargarStok} placeholder="Ingrese texto" />
            </Form.Group>
            <Form.Label>categorias</Form.Label>
            <Form.Select value={selectedCategoria} onChange={handleCategoriaChange}>
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre_categoria}
                </option>
              ))}
            </Form.Select>
            <Form.Group className="mb-3">
              <Form.Label>imagen de productos</Form.Label>
              <Form.Control type="file" onChange={CargarImagen} />
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
          <Button variant="secondary" style={{
            backgroundColor: "#212529",
            borderColor: "#FF5733",
            margin: "10px",
          }} onClick={() => setShowEditModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" style={{
            backgroundColor: "#212529",
            borderColor: "#FF5733",
            margin: "10px",
          }} onClick={saveCategoriaEditada}>
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Modal>

    </div>


  );


}
