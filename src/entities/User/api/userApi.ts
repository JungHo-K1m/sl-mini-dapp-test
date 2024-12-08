// src/entities/user/api/userApi.ts
import api from '@/shared/api/axiosInstance';

export const fetchHomeData = async () => {
  try {
    const response = await api.get('/home');
    return response.data.data;
  } catch (error: any) {
    console.error('fetchHomeData 에러:', error);
    throw error;
  }
};
