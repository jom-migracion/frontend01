import assertEnv from '@/config/env';
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ApiService } from './ApiService';
import ResponseAssert from '@/models/interfaces/backend/ResponseAssert';
import { useAuthStore } from '@/store/auth.store';
import { CODE_ERROR_ASSERT } from '@/common/constants/codeErrorBackend';
import i18next from 'i18next';


const API_BASE_URL = assertEnv.VITE_BASE_URL;


export const RestClient = axios.create({
  baseURL: API_BASE_URL,
  // timeout: 10000, //  10 segundos de timeout
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

let isReloginInProgress = false;
let reloginPromise: Promise<void> | null = null;

// Helper que siempre obtiene el estado más reciente
const getCurrentAuth = () => {
  const { user, userToken, login } = useAuthStore.getState();
  return {
    token: userToken,
    user: user,
    login,
  };
};

RestClient.interceptors.request.use((config: any) => {
  if (typeof window === 'undefined') return config;
  const { token, user } = getCurrentAuth();
  config.headers = {
    ...config.headers,
  };

  if (token && user) {
    config.headers['Authorization'] = `Bearer ${token}`;
    config.headers['user'] = user;
  }

  return config;
});

RestClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isReloginInProgress) {
        isReloginInProgress = true;
        reloginPromise = handleReLogin()
          .then(() => {
            isReloginInProgress = false;
          })
          .catch((error) => {
            isReloginInProgress = false;
            useAuthStore.getState().logout();
            throw error;
          })
          .finally(() => {
            isReloginInProgress = false;
          });
      }

      if (reloginPromise) {
        await reloginPromise;
      }

      originalRequest._retry = true;

      const { user: newUser, token: newToken } = getCurrentAuth();
      if (originalRequest.headers && newToken && newUser) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['user'] = newUser;
      }

      return RestClient(originalRequest);
    }

    const errorKey = CODE_ERROR_ASSERT[error.code as keyof typeof CODE_ERROR_ASSERT];
    const translatedMessage = errorKey ? i18next.t(errorKey) : error.message;

    return Promise.reject({
      original: error,
      /* message: CODE_ERROR_ASSERT[error.code as keyof typeof CODE_ERROR_ASSERT] || error.message, */
      message: translatedMessage,
      code: error.code,
      response: error.response,
    });
  }
);
  
  export const handleReLogin = async (): Promise<void> => {
  try {
    const { token, login } = getCurrentAuth();
    if (!token) {
      console.warn('No hay token disponible para renovar.');
      const response = await ApiService.post<ResponseAssert<{ jwtToken: string, photo: string }>>('/Login', {
        platform: 'local',
        token: '',
        userName: assertEnv.VITE_BACKEND_USER,
        password: assertEnv.VITE_BACKEND_PASSWORD,
      });
      const jwtToken = response?.data?.jwtToken;
      if (jwtToken) {
        login(jwtToken, response?.data?.photo);
      }
    } else {
      const response = await ApiService.post<ResponseAssert<{ jwtToken: string, photo: string }>>('/RenewToken', `${token}`);
      const jwtToken = response?.data?.jwtToken;
      if (jwtToken) {
        login(jwtToken, response?.data?.photo);
      } else {
        console.warn('No se pudo renovar el token');
        throw new Error('Fallo renovación de token.');
      }
    }
  } catch (error) {
    console.error('Error en la renovación de token:', error);
    throw error;
  }
};
