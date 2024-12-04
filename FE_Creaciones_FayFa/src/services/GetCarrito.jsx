
export const getCarItems = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/CarritoDeCompras/'); // URL de tu API que devuelve los productos del carrito
        if (!response.ok) {
            throw new Error("Error al obtener los productos del carrito");
        }
        const data = await response.json();
        return data; // Aquí recibimos los datos del carrito, que esperamos que tengan la estructura del modelo en Django
    } catch (error) {
        console.error("Error al cargar los productos del carrito:", error);
        throw error;
    }
};
