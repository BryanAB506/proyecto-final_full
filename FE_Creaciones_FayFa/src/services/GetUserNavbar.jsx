export const fetchUserData = async () => {
    const token = sessionStorage.getItem("access_token");
  
    if (!token) {
      throw new Error("No token found");
    }
  
    try {
      const response = await fetch("http://localhost:8000/api/users/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error("Error al obtener la información del usuario");
      }
  
      const data = await response.json();
  
      return data; // Devuelve la información del usuario logueado
    } catch (error) {
      console.error("Error al obtener la información del usuario:", error);
      throw error;
    }
  };
  