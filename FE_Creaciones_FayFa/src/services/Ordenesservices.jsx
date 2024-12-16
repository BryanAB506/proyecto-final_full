// Servicio para obtener los productos del carrito
export const fetchCartItemsA = async () => {
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
        return data; // Devuelve toda la respuesta
    } catch (error) {
        console.error("Error al cargar los productos del carrito:", error);
        throw error;
    }
};


export const createOrder = async (cartData) => {
    try {
        const token = sessionStorage.getItem("access_token"); // Asegúrate de usar el token correcto
        const response = await fetch("http://127.0.0.1:8000/api/crear-orden/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ carrito_id: cartData.cart_id }),
        });
        if (!response.ok) throw new Error(await response.text());
        return await response.json();
    } catch (error) {
        console.error("Error al crear la orden:", error.message);
        throw error;
    }
};

//limpiar el carrito
export const clearCart = async () => {
    try {
        const token = sessionStorage.getItem("access_token");
        const response = await fetch("http://127.0.0.1:8000/api/cartClear/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        if (!response.ok) {
            throw new Error("Error al vaciar el carrito.");
        }
    } catch (error) {
        console.error("Error en clearCart:", error.message);
    }
};
