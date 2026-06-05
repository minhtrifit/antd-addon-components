import axiosInstance from './api.instance';
import { LoginPayload } from '@/types';

export const authApi = {
  login: async (data: LoginPayload) => {
    try {
      const response = await axiosInstance.post('/auth/login', data);

      return response;
    } catch (error) {
      throw error;
    }
  },

  getProfile: async (token: string) => {
    try {
      const response = await axiosInstance.get(`/users/${2}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default authApi;
