export const obtenerDireccionesEnvio = async () => {
    try {
        const response = await fetch("http://127.0.0.1:8000/api/Direcciones_envio/");
        if (!response.ok) {
            throw new Error("Error al obtener las direcciones de envío");
        }
        return await response.json();
    } catch (error) {
        console.error("Error al obtener las direcciones de envío:", error);
        return null;
    }
};
