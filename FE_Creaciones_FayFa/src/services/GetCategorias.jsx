async function getCategorias() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/categorias/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching users');
        }

        const Categorias = await response.json();
            
        return Categorias;



    } catch (error) {
        console.error('Error fetching categorias:', error);
        throw error;
    }
}

export default getCategorias ;