export const fetchCartData = async () => {
  try {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
      throw new Error("No se encontró el token de autenticación.");
    }

    const response = await fetch(`http://localhost:8000/api/view-cart/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("No autorizado. Por favor inicia sesión nuevamente.");
      }
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el carrito:", error.message);
    return { cart_items: [] }; // Retorna un carrito vacío por defecto en caso de error
  }
};
