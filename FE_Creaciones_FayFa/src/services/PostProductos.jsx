async function postProductos(data) {
    try {
     
    
  
        const response = await fetch("http://localhost:3001/articulos", {
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
  
  
  