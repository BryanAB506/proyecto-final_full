// OrdenService.js
const getOrden = async () => {
  try {
    const token = sessionStorage.getItem("access_token");
    const response = await fetch('http://127.0.0.1:8000/api/Ordenes/', {
      headers: {
        'Authorization': `Bearer ${ token }`,
        'Content-Type': 'application/json',
      },


})



if (!response.ok) {
  throw new Error('Error al obtener las órdenes');
}
const data = await response.json();
return data;
  } catch (error) {
  console.error(error);
  return null;
}
};

export default getOrden 
