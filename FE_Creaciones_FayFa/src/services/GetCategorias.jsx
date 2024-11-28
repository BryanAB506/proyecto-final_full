async function getCategorias() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/categorias/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`Error fetching categories: ${response.statusText}`);
        }

        const categorias = await response.json(); // Use consistent casing
        return categorias;
    } catch (error) {
        console.error('Error fetching categorias:', error);
        throw error; // Re-throw the error for the caller to handle
    }
}

export default getCategorias;
