import { decode } from 'jwt-js-decode';

const GetClienteId = () => {
    const token = sessionStorage.getItem('access_token');
    console.log('Token codificado',token);
    
    if (token) {
      const tokenCliente = decode(token);
      console.log("Token decodificado:", tokenCliente);
      return tokenCliente.payload.user_id;
    }
    return null;
  };

export default GetClienteId;