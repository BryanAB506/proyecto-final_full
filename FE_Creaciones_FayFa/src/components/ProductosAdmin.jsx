import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import '../styles/AdminPage.css';
import FayFaContext from '../Context/FayFaContext';
import { eliminarProductoApi } from '../services/DeleteProductos';

function ProductosAdm() {
    const { productos, editarProducto, fetchProductos} = useContext(FayFaContext);

    const [showModal, setShowModal] = useState(false); // Controlar la visibilidad del modal
    const [productoEditado, setProductoEditado] = useState(null); // Almacenar el producto a editar
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion_producto: '',
        precio: '',
        stock: '',
        Categorias: '',  // Agregado para incluir la categoría
        imagen_product: '', // Agregado para incluir la URL de la imagen
    });

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (producto) => {
        setProductoEditado(producto); // Establecer el producto a editar
        setFormData({
            nombre: producto.nombre,
            descripcion_producto: producto.descripcion_producto,
            precio: producto.precio,
            stock: producto.stock,
            Categorias: producto.Categorias,  // Establecer la categoría seleccionada
            imagen_product: producto.imagen_product, // Establecer la URL de la imagen
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Revisar si los valores no son arrays antes de enviarlos
        const data = {
            nombre: formData.nombre ? formData.nombre[0] : formData.nombre, // Verifica si es un array
            descripcion_producto: formData.descripcion_producto ? formData.descripcion_producto[0] : formData.descripcion_producto,
            precio: formData.precio ? parseFloat(formData.precio) : 0,
            stock: formData.stock ? parseInt(formData.stock) : 0,
            Categorias: formData.Categorias ? formData.Categorias : 0,  // Solo el ID de la categoría
            imagen_product: formData.imagen_product, // La URL de la imagen
        };
    
       
    
        try {
            await editarProducto(productoEditado.id, data);
            handleCloseModal(); // Cerrar el modal después de editar
        } catch (error) {
            console.error('Error al editar el producto:', error);
        }
    };
    
    const eliminarProducto = async (id) => {
        const confirmar = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
        if (!confirmar) return;
    
        try {
         
          const success = await eliminarProductoApi(id);
          fetchProductos()
                    
          if (success) {
            alert("Producto eliminado correctamente.");
          } else {
            alert("Hubo un error al intentar eliminar el producto.");
          }
        } catch (error) {
          alert("Error eliminando el producto.");
        }
      };


    return (
        <div>
            <div className="tituloOurTeam">
                <h2>PRODUCTOS</h2>
            </div><br />
            <Container fluid>
                <Col md={9}>
                    <Row>
                        {productos.map((producto) => (
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
                                            <strong>Categoría:</strong> {producto.Categorias}
                                        </Card.Text>

                                        <div className="d-flex justify-content-between">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                style={{ backgroundColor: "#212529" }}
                                                onClick={() => handleShowModal(producto)} // Abrir el modal para editar
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
                </Col>
            </Container>

            {/* Modal para editar producto */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
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

                        {/* Campo para seleccionar categoría */}
                        <Form.Group controlId="formCategoria">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="ID de categoría"
                                value={formData.Categorias}
                                onChange={(e) => setFormData({ ...formData, Categorias: e.target.value })}
                            />
                        </Form.Group>

                        {/* Campo para la URL de la imagen */}
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
