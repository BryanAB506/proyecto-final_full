// Obtener el token desde sessionStorage
const getToken = () => sessionStorage.getItem("access_token");

// Función para eliminar un producto
export const eliminarProductoApi = async (id) => {
    try {
        const token = getToken();
        const response = await fetch(`http://127.0.0.1:8000/api/productos/${id}/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Agrega el token al header
            },
        });
        return response.ok;
    } catch (error) {
        console.error("Error eliminando el producto:", error);
        throw error;
    }
};

export const editarProductoApi = async (id, formData) => {
    try {
        const token = getToken();
        const response = await fetch(`http://127.0.0.1:8000/api/productos/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(formData),  // Asegúrate de que 'formData' tenga el formato correcto
        });

        if (!response.ok) {
            const errorData = await response.json();  // Obtener el cuerpo de la respuesta de error
            console.error('Error al editar el producto:', errorData);
            throw new Error(errorData.message || 'Error al actualizar el producto');
        }

        return await response.json();
    } catch (error) {
        console.error('Error al editar el producto:', error);
        throw error;
    }
};
