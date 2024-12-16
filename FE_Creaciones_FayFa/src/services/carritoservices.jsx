// Servicio para obtener los productos del carrito
export const fetchCartItems = async () => {
    try {
        const token = sessionStorage.getItem("access_token"); // Usa el token de sesión
        const response = await fetch("http://localhost:8000/api/view-cart/", {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error("Error al cargar el carrito");
        }

        const data = await response.json();
        return data.cart_items || [];
    } catch (error) {
        console.error("Error al cargar los productos del carrito:", error);
        throw error;
    }
};


//añadir producto id/cantidad
export const addToCart = async (productId, quantity, section = 'default_section') => {
    try {
        const token = sessionStorage.getItem("access_token"); // Obtener access_token
        if (!token) {
            throw new Error("No se encontró el token de acceso.");
        }

        const response = await fetch(`http://localhost:8000/api/add_to_cart/${productId}/${quantity}/`, {
            method: 'GET', // Tu view usa el método GET
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error al añadir producto al carrito");
        }
    } catch (error) {
        console.error("Error al añadir producto al carrito:", error.message);
        throw error;
    }
};


//eliminar prodcuto id/cantidad
export const removeFromCart = async (productId, quantity, section = 'default_section') => {
    try {
        const token = sessionStorage.getItem("access_token"); // Obtener access_token
        if (!token) {
            throw new Error("No se encontró el token de acceso.");
        }

        const response = await fetch(`http://localhost:8000/api/remove_from_cart/${productId}/${quantity}/`, {
            method: 'POST', // Tu view usa el método POST
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Producto eliminado del carrito", data);
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error al eliminar producto del carrito");
        }
    } catch (error) {
        console.error("Error al eliminar producto del carrito:", error.message);
        throw error;
    }
};
