import api from '@/shared/api/axiosInstance';

// SL 잔고 확인
export const getBalance = async (): Promise<any> => {
  const response = await api.get('/diagnosis/sl/balance');
  
  if (response.data.code === 'OK') {
    console.log("얼마고: ", response.data);
    return response.data;
  } else {
    console.error('Unexpected response:', response);
    throw new Error(response.data.message || 'Failed to fetch pet information');
  }
};


export default getBalance;
