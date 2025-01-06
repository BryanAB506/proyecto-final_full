import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import getCategorias from '../services/GetCategorias';
import { getProductos } from '../services/GetProductos';
import FayFaContext from "../Context/FayFaContext";
import '../styles/Productos.css'; // Asegúrate de importar el CSS
import { addToCart } from '../services/carritoservices';
import Swal from 'sweetalert2'

function Productos() {
    const [categorias, setCategorias] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [busqueda, setBusqueda] = useState("");

    // Función para obtener categorías
    async function cargarCategorias() {
        try {
            const datos = await getCategorias();
            setCategorias(datos); // Supone que el servicio devuelve un array de objetos con `nombre_categoria` y `descripcion`
        } catch (error) {
            console.error('Error al cargar categorías:', error);
        }
    }

    // useEffect para cargar categorías al montar el componente
    useEffect(() => {
        cargarCategorias();
    }, []);

    const { productos, setNuevoProducto } = useContext(FayFaContext);

    // useEffect para cargar los productos al montar el componente
    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const data = await getProductos();
                setNuevoProducto(data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };
        fetchProductos();
    }, []);

    const [loading, setLoading] = useState(false);

    const agregarAlCarrito = async (producto) => {
        setLoading(true); // Mostrar "Agregando..." en el botón
        try {
            const response = await addToCart(producto.id, 1, 'default_section'); // Llamar a la API con cantidad = 1
            console.log('Producto añadido al carrito:', response);
            Swal.fire(`${producto.nombre} fue añadido al carrito.`);
        } catch (error) {
            console.error(error.message);
            alert('Hubo un problema al añadir el producto al carrito.');
        } finally {
            setLoading(false); // Ocultar "Agregando..." en el botón
        }
    }

    // Manejo del campo de búsqueda
    const handleBusquedaChange = (event) => {
        setBusqueda(event.target.value);
    };

    // Manejo del filtro de categoría
    const handleCategoriaSeleccionada = (categoria) => {
        setCategoriaSeleccionada(categoria);
    };

    // Filtrar productos según la búsqueda y la categoría seleccionada
    const productosFiltrados = productos.filter((producto) => {
        const coincideBusqueda = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
        const coincideCategoria = categoriaSeleccionada ? producto.nombre_categoria === categoriaSeleccionada : true;
        return coincideBusqueda && coincideCategoria;
    });

    return (
        <div>
            <div className='tituloOurTeam'>
                <h2>PRODUCTOS</h2>
            </div><br />
            <Form className="my-3 w-50 mx-auto">
                <Form.Control
                    type="text"
                    placeholder="Buscar producto..."
                    value={busqueda}
                    onChange={handleBusquedaChange}
                />
            </Form>
            <Container fluid>
                <Row>
                    {/* Sidebar para filtros */}
                    <Col
                        md={3} className="p-3" style={{
                            backgroundColor: "rgb(226 226 226)", // Fondo oscuro
                            color: "rgb(0, 0, 0)",          // Texto claro
                            borderRadius: "5px",       // Bordes redondeados opcionales
                        }}
                    >
                        <h5>Filtros</h5>
                        <div>
                            <h6>Categorías</h6>
                            <ul className="category-list">
                                <li 
                                    onClick={() => handleCategoriaSeleccionada("")} 
                                    className={`category-item ${categoriaSeleccionada === "" ? 'category-item-all' : ''}`}
                                >
                                    Todas
                                </li>
                                {categorias.map((categoria) => (
                                    <li
                                        key={categoria.id}
                                        onClick={() => handleCategoriaSeleccionada(categoria.nombre_categoria)}
                                        className={`category-item ${categoriaSeleccionada === categoria.nombre_categoria ? 'selected' : ''}`}
                                    >
                                        {categoria.nombre_categoria}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Col>

                    {/* Main content */}
                    <Col md={9}>
                        <Row>
                            {productosFiltrados.map((producto) => (
                                <Col key={producto.id} md={4} className="mb-4">
                                    <Card>
                                        <Card.Img
                                            variant="top"
                                            src={producto.imagen_product || 'src/assets/img/default.jpg'}
                                        />
                                        <Card.Body>
                                            <Card.Title>{producto.nombre}</Card.Title>
                                            <Card.Text>
                                                <strong>Categoría:</strong> {producto.nombre_categoria}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Estilo:</strong> {producto.descripcion_producto}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Precio:</strong> ₡{producto.precio}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    disabled={loading}
                                                    style={{ backgroundColor: '#212529' }}
                                                    onClick={() => agregarAlCarrito(producto)}
                                                >
                                                    {loading ? 'Agregando...' : 'Agregar al carrito'}
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Productos;
