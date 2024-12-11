// services/PedidosAdminservices.js
export const obtenerPedidos = async () => {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/adminOrdenes/');
        if (!response.ok) {
            throw new Error('Error al obtener los pedidos');
        }
        return await response.json();  // Retorna los datos como JSON
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
        throw error;  // Lanzamos el error para manejarlo en el componente si es necesario
    }
};

export const eliminarPedido = async (pedidoId) => {
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/adminOrdenes/${pedidoId}/eliminar/`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el pedido');
        }
        return await response.json();  // Puede retornar un mensaje de éxito
    } catch (error) {
        console.error("Error al eliminar el pedido:", error);
        throw error;
    }
};
