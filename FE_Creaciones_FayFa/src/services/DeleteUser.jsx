export const deleteUser = async (userId) => {
    const token = sessionStorage.getItem("access_token");

    if (!token) {
        throw new Error("Token de autenticación no disponible.");
    }

    try {
        const response = await fetch(`http://127.0.0.1:8000/api/users/${userId}/`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        // Verifica si la respuesta es exitosa
        if (!response.ok) {
            const errorText = await response.text(); // Captura el mensaje del servidor
            console.error("Error en el servidor:", errorText);
            throw new Error("Error al eliminar el usuario");
        }

        // Si el servidor devuelve un 204 (sin contenido), no intentes parsear JSON
        if (response.status === 204) {
            return null; // Devuelve `null` explícitamente para indicar éxito sin contenido
        }

        // Si la respuesta no es vacía, intenta parsear el JSON
        return await response.json();
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        throw error;
    }
};

