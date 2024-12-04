async function postProductos(nombre, descripcion_producto, precio, stock, selectedCategoria, imagen_product) {
    try {
        const productData = {
            nombre,
            descripcion_producto,
            precio: parseFloat(precio), // Convertir a número decimal
            stock: parseInt(stock, 10), // Convertir a número entero
            Categorias: parseInt(selectedCategoria, 10), // Convertir a entero
            imagen_product
        };
    
        console.log(productData); // Inspecciona los datos enviados
        const response = await fetch("http://127.0.0.1:8000/api/productos/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(productData)
        });
  
     
        return await response.json();
  
        
    } catch (error) {
        console.error('Error posting productos:', error);
        throw error;
    }
  }
  
  export default postProductos
  
  
  