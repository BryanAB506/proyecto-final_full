async function postAdmin(username, first_name, last_name, email, password, is_staff) {
    try {
      const userData = { 
        username,
        first_name,
        last_name,
        email,
        password, 
        is_staff, 
      };
  
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al registrar");
      }
  
      // Retorna la respuesta si todo salió bien
      return await response.json();
  
    } catch (error) {
      console.error('Error posting user:', error);
      throw error; // Lanza el error para que pueda ser manejado en la llamada
    }
  }
  
  export default postAdmin;
  