async function getUsers() {
    try {
        // Realiza la petición al endpoint de Django
        const response = await fetch('http://127.0.0.1:8000/api/users/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Si hay un error en la respuesta, lanza una excepción
        if (!response.ok) {
            throw new Error('Error fetching users');
        }

        // Convierte la respuesta a JSON
        const users = await response.json();
        return users; // Retorna los usuarios obtenidos
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Relanza el error para manejarlo en el componente que lo llame
    }
}

export default getUsers;
