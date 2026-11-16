import assertEnv from '@/config/env';
import { useSnackbar } from '@/context/SnackbarContext';
import { useGet, usePost } from '@/hooks/api';
import { useAuthContext } from '@/modules/_auth/context';

interface Token {
  jwtToken: string;
}

export default function ExampleClient() {
  const showSnackbar = useSnackbar();
  const { login } = useAuthContext();

  const {
    data: listingRent,
    isLoading,
    refetch,
  } = useGet('listingRentById', '/ListingRent/621', {}, false);
  const { mutate: loginHost } = usePost('/Login');
  const handleFetchPost = async () => {
    const { data } = await refetch(); // esperar resultado

    const { resultError, statusCode } = data || {};

    if (statusCode === '200') {
      showSnackbar('Success listingRent', 'success');
    } else {
      showSnackbar(resultError?.message || 'Error desconocido', 'error');
    }
  };

  const handleLogin = () => {
    loginHost(
      {
        platform: 'local',
        token: '',
        userName: 'gary.vera.1976@gmail.com',
        password: assertEnv.VITE_BACKEND_PASSWORD,
      },
      {
        onSuccess: (responseLogin) => {
          const { data } = responseLogin;
          const dataResponse = data as Token;
          if (dataResponse.jwtToken) {
            login(dataResponse.jwtToken);
            showSnackbar('Inicio de sesión exitoso', 'success');
          } else {
            showSnackbar('Error: No se recibió el token', 'error');
          }
        },
        onError: (error) => {
          showSnackbar(error?.message || 'Error al iniciar sesión', 'error');
        },
      }
    );
  };

  return (
    <div>
      <div>
        <h4>LOGIN</h4>
        <button onClick={handleLogin}>Login</button>
        <hr />
      </div>
      <div>
        <h4>GET</h4>
        <button onClick={handleFetchPost} disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Cargar listingRent'}
        </button>
        {listingRent && (
          <>
            <br />
            {JSON.stringify(listingRent)}
          </>
        )}
      </div>
    </div>
  );
}
