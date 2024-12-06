export async function getProductos() {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/productos/");
        if (!response.ok) {
            throw new Error(`Error al obtener productos: ${response.statusText}`);
        }
        return await response.json(); // Devuelve los datos de productos
    } catch (error) {
        console.error('Error en el servicio de productos:', error);
        throw error; // Propaga el error para manejarlo en el componente
    }
}