// cartServices.js

// Servicio para obtener los productos del carrito
export const fetchCartItems = async () => {
    try {
        const response = await fetch("http://localhost:8000/api/view-cart/");
        if (!response.ok) {
            throw new Error('Error al cargar el carrito');
        }
        const data = await response.json();
        return data.carrito || [];
    } catch (error) {
        console.error("Error al cargar los productos del carrito:", error);
        throw error;
    }
};

// Servicio para actualizar la cantidad de un producto
export const updateCartItem = async (id, cantidad) => {
    const response = await fetch(`http://127.0.0.1:8000/api/update-cart/${id}/${cantidad}/`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
};




// Servicio para eliminar un producto del carrito
export const removeCartItem = async (id) => {
    try {
        const response = await fetch(`/api/remove-from-cart/${id}/`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto');
        }
    } catch (error) {
        console.error("Error al eliminar el producto del carrito:", error);
        throw error;
    }
};
