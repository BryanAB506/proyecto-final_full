async function postDireccion(DireccionData) {
    try {
    //   const DireccionData = { 
    //     direccion,
    //     codigo_postal,
    //     Usuarios_id,
    //     Canton,
    //     Distrito, 
    //     provincia 
    // };
  
      const response = await fetch("http://127.0.0.1:8000/api/Direcciones_envio/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(DireccionData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al registrar la direccion");
      }
  
      // Retorna la respuesta si todo salió bien
      return await response.json();
  
    } catch (error) {
      console.error('Error con la direccion:', error);
      throw error; // Lanza el error para que pueda ser manejado en la llamada
    }
  }
  
  export default postDireccion;
  