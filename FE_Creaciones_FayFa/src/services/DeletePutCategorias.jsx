export const deleteCategoria = async (id) => {
    try {
      const token = sessionStorage.getItem("access_token"); // Obtén el token desde sessionStorage
      if (!token) {
        throw new Error("Token de acceso no encontrado.");
      }
  
      const response = await fetch(`http://127.0.0.1:8000/api/categorias/${id}/`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });
  
      if (!response.ok) {
        throw new Error("No se pudo eliminar la categoría.");
      }
      return true; // Retorna un éxito para confirmar
    } catch (error) {
      console.error("Error al eliminar la categoría:", error);
      throw error; // Reenvía el error para manejarlo en la UI
    }
  };
  
export  const updateCategoria = async (id, data) => {
    try {
      const token = sessionStorage.getItem("access_token"); // Obtén el token desde sessionStorage
      if (!token) {
        throw new Error("Token de acceso no encontrado.");
      }
  
      const response = await fetch(`http://127.0.0.1:8000/api/categorias/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Incluye el token en el encabezado
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error("No se pudo actualizar la categoría.");
      }
  
      return await response.json(); // Retorna los datos actualizados
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      throw error; // Reenvía el error para manejarlo en la UI
    }
  };
  