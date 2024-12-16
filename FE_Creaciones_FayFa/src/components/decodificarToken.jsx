import { decode } from 'jwt-js-decode';

const GetClienteId = () => {
    const token = sessionStorage.getItem('access_token');
    
    if (token) {
      const tokenCliente = decode(token);
      return tokenCliente.payload.user_id;
    }
    return null;
  };

export default GetClienteId;