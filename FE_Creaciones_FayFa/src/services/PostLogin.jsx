async function postLogin(username, password) {
    try {
        const userData = { 
            username,
            password
        };

        const response = await fetch("http://127.0.0.1:8000/api/token/", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        // Verificar si el estado HTTP es exitoso (200-299)
        if (!response.ok) {
            const errorData = await response.json(); // Obtener el mensaje de error del backend
            throw new Error(errorData.detail || 'Error de autenticación');
        }

        // Parsear y devolver los datos si la respuesta es exitosa
        return await response.json();
    } catch (error) {
        console.error('Error en la autenticación:', error.message);
        throw error; // Re-lanzar el error
    }
}

export default postLogin;
