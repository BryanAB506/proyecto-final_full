async function posComprobantePago(metodo_pago, comprobante_pago, Ordenes_id) {
    try {
        const payload = {
            metodo_pago,
            comprobante_pago, // Aquí envías directamente la URL
            Ordenes_id,
        };

        const response = await fetch("http://127.0.0.1:8000/api/pagos/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Error en el servidor");
        }

        return await response.json();
    } catch (error) {
        console.error("Error posting comprobante de pago:", error);
        throw error;
    }
}

export default posComprobantePago;
