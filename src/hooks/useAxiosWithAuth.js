import { useAuth } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';

const useAxiosWithAuth = () => {
  const { auth, setAuth } = useAuth();

  const addAuthInterceptor = () => {
    axiosInstance.interceptors.request.use(
      (config) => {
        const token = auth.token; // Get token from context
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response && error.response.status === 401 && auth.token) {
          try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
              const refreshResponse = await axiosInstance.post(
                '/api/token/refresh/',
                { refresh: refreshToken }
              );
              const newToken = refreshResponse.data.access;
              setAuth({ token: newToken, user: jwtDecode(newToken) });

              // Retry the original request
              error.config.headers['Authorization'] = `Bearer ${newToken}`;
              return axiosInstance(error.config);
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            // Handle logout or redirect to login
          }
        }
        return Promise.reject(error);
      }
    );
  };

  return { addAuthInterceptor };
};

export default useAxiosWithAuth;
