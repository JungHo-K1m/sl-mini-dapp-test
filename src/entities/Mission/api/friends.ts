import api from '@/shared/api/axiosInstance';

// 친구초대 미션 페이지
export const getFriends = async (): Promise<any> => {
  const response = await api.get('/friends');

  if (response.data.code === 'OK') {
    return response.data.data;
  } else {
    console.error('Unexpected response:', response);
    throw new Error(response.data.message || 'Failed to fetch pet information');
  }
};


export default getFriends;
