// src/entities/user/api/userApi.ts
import api from '@/shared/api/axiosInstance';

export const fetchHomeData = async () => {
  try {
    const response = await api.get('/home');
    console.log("/home 응답: ", response.data);
    return response.data;
  } catch (error: any) {
    console.error('fetchHomeData 에러:', error);
    throw error;
  }
};
