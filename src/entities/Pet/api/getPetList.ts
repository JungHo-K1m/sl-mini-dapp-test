import api from '@/shared/api/axiosInstance';

// 반려동물 목록 가져오기 함수
export const getPetList = async (): Promise<any> => {
  const response = await api.get('/mypets');
  
  if (response.data.code === 'OK') {
    return response.data.data;
  } else {
    console.error('Unexpected response:', response);
    throw new Error(response.data.message || 'Failed to fetch pet information');
  }
};


export default getPetList;
