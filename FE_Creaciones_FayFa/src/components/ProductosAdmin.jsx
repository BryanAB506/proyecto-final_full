import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import '../styles/AdminPage.css';
import FayFaContext from '../Context/FayFaContext';
import { eliminarProductoApi, editarProductoApi } from '../services/DeleteProductos';

function ProductosAdm() {
    const { productos, fetchProductos } = useContext(FayFaContext);

    const [showModal, setShowModal] = useState(false);
    const [productoEditado, setProductoEditado] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion_producto: '',
        precio: '',
        stock: '',
        Categorias: '',
        imagen_product: '',
    });

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (producto) => {
        setProductoEditado(producto);
        setFormData({
            nombre: producto.nombre,
            descripcion_producto: producto.descripcion_producto,
            precio: producto.precio,
            stock: producto.stock,
            Categorias: producto.Categorias,
            imagen_product: producto.imagen_product,
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            nombre: formData.nombre,
            descripcion_producto: formData.descripcion_producto,
            precio: parseFloat(formData.precio) || 0,
            stock: parseInt(formData.stock) || 0,
            Categorias: formData.Categorias,
            imagen_product: formData.imagen_product,
        };

        try {
            const success = await editarProductoApi(productoEditado.id, data);
            if (success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto editado correctamente',
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchProductos();
                handleCloseModal();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error al intentar editar el producto',
                });
            }
        } catch (error) {
            console.error('Error al editar el producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error al editar el producto',
            });
        }
    };

    const eliminarProducto = async (id) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: '¡Esta acción no se puede deshacer!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        });

        if (!isConfirmed) return;

        try {
            const success = await eliminarProductoApi(id);
            if (success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Producto eliminado correctamente',
                    showConfirmButton: false,
                    timer: 1500,
                });
                fetchProductos();
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Hubo un error al intentar eliminar el producto',
                });
            }
        } catch (error) {
            console.error('Error eliminando el producto:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error eliminando el producto',
            });
        }
    };

    // Filtrar productos destacados y no destacados
    const productosDestacados = productos.filter(producto => producto.nombre_categoria === 'destacados');
    const productosRestantes = productos.filter(producto => producto.nombre_categoria !== 'destacados');

    return (
        <div>
            <div className="tituloOurTeam">
                <h2>PRODUCTOS</h2>
            </div><br />

            {/* Sección de productos destacados */}
            {productosDestacados.length > 0 && (
                <div>
                    <h3>Destacados</h3>
                    <Container fluid>
                        <Row>
                            {productosDestacados.map((producto) => (
                                <Col key={producto.id} md={4} className="mb-4">
                                    <Card>
                                        <Card.Img variant="top" src={producto.imagen_product || "src/assets/img/default.jpg"} />
                                        <Card.Body>
                                            <Card.Title>{producto.nombre}</Card.Title>
                                            <Card.Text>
                                                <strong>Descripción:</strong> {producto.descripcion_producto}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Precio:</strong> ₡{producto.precio}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Stock:</strong> {producto.stock}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Categoría:</strong> {producto.nombre_categoria}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    style={{ backgroundColor: "#212529" }}
                                                    onClick={() => handleShowModal(producto)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    style={{ backgroundColor: "#212529" }}
                                                    onClick={() => eliminarProducto(producto.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </div>
            )}

            {/* Sección de productos restantes */}
            {productosRestantes.length > 0 && (
                <div>
                    <h3>Otros Productos</h3>
                    <Container fluid>
                        <Row>
                            {productosRestantes.map((producto) => (
                                <Col key={producto.id} md={4} className="mb-4">
                                    <Card>
                                        <Card.Img variant="top" src={producto.imagen_product || "src/assets/img/default.jpg"} />
                                        <Card.Body>
                                            <Card.Title>{producto.nombre}</Card.Title>
                                            <Card.Text>
                                                <strong>Descripción:</strong> {producto.descripcion_producto}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Precio:</strong> ₡{producto.precio}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Stock:</strong> {producto.stock}
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Categoría:</strong> {producto.nombre_categoria}
                                            </Card.Text>
                                            <div className="d-flex justify-content-between">
                                                <Button
                                                    variant="primary"
                                                    size="sm"
                                                    style={{ backgroundColor: "#212529" }}
                                                    onClick={() => handleShowModal(producto)}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    style={{ backgroundColor: "#212529" }}
                                                    onClick={() => eliminarProducto(producto.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Container>
                </div>
            )}

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        {/* Mostrar imagen actual */}
                        {formData.imagen_product && (
                            <div className="mb-3">
                                <Form.Label>Imagen Actual</Form.Label>
                                <img
                                    src={formData.imagen_product}
                                    alt="Imagen del producto"
                                    style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        <Form.Group controlId="formNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del producto"
                                value={formData.nombre}
                                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formDescripcion">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Descripción del producto"
                                value={formData.descripcion_producto}
                                onChange={(e) => setFormData({ ...formData, descripcion_producto: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPrecio">
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Precio del producto"
                                value={formData.precio}
                                onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formStock">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Cantidad en stock"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCategoria">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="ID de categoría"
                                value={formData.Categorias}
                                onChange={(e) => setFormData({ ...formData, Categorias: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="formImagen">
                            <Form.Label>Imagen</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="URL de la imagen"
                                value={formData.imagen_product}
                                onChange={(e) => setFormData({ ...formData, imagen_product: e.target.value })}
                            />
                        </Form.Group>
                        <div className="d-flex justify-content-between">
                            <Button variant="secondary" onClick={handleCloseModal}>
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Guardar Cambios
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </div>
    );
}

export default ProductosAdm;
