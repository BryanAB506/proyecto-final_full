async function PostCategorias(nombre_categoria, descripcion) {
    try {
        //los atributos que contiene 
        const CategData = { 
            nombre_categoria,
            descripcion,
         
        };
        //se le da el endpoit se lo que va autilizar
        const response = await fetch("http://127.0.0.1:8000/api/categorias/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(CategData)
        });
  
        //crea una respuesta para saber que pasa y lo retorna
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error al incresar la categoria");
        }


        return await response.json();
  
        
    } catch (error) {
        console.error('Error con las categorias:', error);
        throw error;
    }
  }
  
  export default PostCategorias
  
  
  