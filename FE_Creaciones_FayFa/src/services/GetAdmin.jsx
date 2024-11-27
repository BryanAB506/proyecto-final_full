async function getAdmin() {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error fetching users');
        }

        const admin = await response.json();





        return admin;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export default getAdmin ;