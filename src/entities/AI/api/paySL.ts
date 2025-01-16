import api from '@/shared/api/axiosInstance';

// SL 차감
export const slPayment = async (): Promise<any> => {
  const response = await api.get('/diagnosis/sl/pay');
  
  if (response.data.code === 'OK') {
    console.log("차감: ", response.data);
    return response.data;
  } else {
    console.error('Unexpected response:', response);
    throw new Error(response.data.message || 'Failed to fetch pet information');
  }
};


export default slPayment;
