// Importamos la función 'decode' desde la librería 'jwt-js-decode'.
import { decode } from 'jwt-js-decode';

// Definimos la función 'GetClienteId', que se encarga de obtener el ID del cliente a partir de un token JWT almacenado en sessionStorage.
const GetClienteId = () => {
    // Recuperamos el token 'access_token' almacenado en sessionStorage.
    const token = sessionStorage.getItem('access_token');
    
    // Verificamos si el token existe en sessionStorage.
    if (token) {
      // Si el token existe, lo decodificamos utilizando la función 'decode'.
      const tokenCliente = decode(token);

      // Retornamos el 'user_id' que se encuentra en la sección 'payload' del token decodificado.
      return tokenCliente.payload.user_id;
    }
    
    // Si el token no existe, devolvemos 'null' como valor por defecto.
    return null;
};

// Exportamos la función 'GetClienteId' para que pueda ser utilizada en otros archivos.
export default GetClienteId;
