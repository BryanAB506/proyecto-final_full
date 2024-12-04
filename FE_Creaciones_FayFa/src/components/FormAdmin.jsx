import React from "react";
import "../styles/AdminPage.css";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useAuth } from "../Context/AuthContext";
import { Await, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import PostCategorias from '../services/PostCategorias';
import getCategorias from "../services/GetCategorias";
import postProductos from "../services/PostProductos";
import Swal from 'sweetalert2'
import {UploadFile} from '../firebase/Config'


export default function FormAdminC() {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      console.error({message: error})
    }
  }

  useEffect(() => {
    obtenerCategoria();
  }, []);


  const agregarProducto = (e) => {
    e.preventDefault();
    Swal.fire(`Producto agregado a la categoría ${selectedCategoria}`);
  };



  const [nombre, setnombre] = useState ('')
  const [descripcion_producto, setdescripcion_producto] = useState ('')
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
    try {
      await postProductos(nombre, descripcion_producto, precio, stock, selectedCategoria, imagen_product);

        Swal.fire("Producto agregado con éxito.");
    } catch (error) {
        console.error("Error al agregar el producto:", error);
        Swal.fire("Hubo un error al agregar el producto.");
    }
};




const [imagen_product, setimagen_product]= useState("")
   //aplicaas el hooks
const CargarImagen= async(e)=>{
      const file = e.target.files[0]
      setimagen_product(file)
      if (file) {
        const resultado= await UploadFile(file);
        setimagen_product(resultado)
      }

    } // la funcion cargarImagen





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
              <Form.Control type="file"  onChange={CargarImagen} />
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
