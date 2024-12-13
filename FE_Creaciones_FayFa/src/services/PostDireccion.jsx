async function postDireccion( direccion, codigo_postal, Usuarios, Canton, Distrito, provincia ) {
    try {
      const DireccionData = { 
        direccion:direccion,
        codigo_postal:codigo_postal,
        Usuarios:Usuarios,
        Canton:Canton, 
        Distrito:Distrito, 
        provincia:provincia 
      };
      
      console.log("Datos enviados al backend:", DireccionData);
      
      const response = await fetch("http://127.0.0.1:8000/api/Direcciones_envio/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(DireccionData)
      });


      console.log(response);
      
  
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
  