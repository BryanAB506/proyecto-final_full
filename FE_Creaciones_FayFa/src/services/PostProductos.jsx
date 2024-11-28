async function postProductos(data) {
    try {
     
    
  
        const response = await fetch("http://127.0.0.1:8000/api/productos/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
  
     
        return await response.json();
  
        
    } catch (error) {
        console.error('Error posting user:', error);
        throw error;
    }
  }
  
  export default postProductos
  
  
  