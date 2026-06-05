import axiosInstance from './api.instance';

export const productApi = {
  getProducts: async (params?: Record<string, any>) => {
    try {
      const response = await axiosInstance.get('/products', {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (id: string, params?: Record<string, any>) => {
    try {
      const response: any = await axiosInstance.get<any[]>(`/products/${id}`, {
        params,
      });

      return response;
    } catch (error) {
      throw error;
    }
  },

  addProduct: async (data: {
    title: string;
    price: number;
    description: string;
    image: string;
    category: string;
  }) => {
    try {
      const response = await axiosInstance.post('/products', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (
    id: string,
    data: {
      title?: string;
      price?: number;
      description?: string;
      image?: string;
      category?: string;
    },
  ) => {
    try {
      const response = await axiosInstance.put(`/products/${id}`, data);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default productApi;
