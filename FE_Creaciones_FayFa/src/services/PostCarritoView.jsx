async function postViewCarrito(data) {
    try {
    //   const viewCarritoData = { 
    //     quantity, 
    //     price, 
    //     Productos_id, 
    //     cart_id 
    //   };
  
    //   console.log('Datos enviados:', viewCarritoData); 
  
      const response = await fetch("http://127.0.0.1:8000/api/CartItem/", {
        method: 'POST',
        headers: {
  
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al agregar al carrito");
      }
  
      // Retorna la respuesta si todo salió bien
      return await response.json();
  
    } catch (error) {
      console.error('Error al agregar productos al carrito:', error);
      throw error; // Lanza el error para que pueda ser manejado en la llamada
    }
  }
  
  export default postViewCarrito;
  