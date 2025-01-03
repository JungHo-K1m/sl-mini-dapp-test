import api from '@/shared/api/axiosInstance';

// 친구초대 보상 페이지
export const getFriendsReward = async (): Promise<any> => {
  const response = await api.get('/friends/reward');
  
  if (response.data.code === 'OK') {
    console.log("수입이 좀 있나? ", response.data.data);
    return response.data.data;
  } else {
    console.error('Unexpected response:', response);
    throw new Error(response.data.message || 'Failed to fetch pet information');
  }
};


export default getFriendsReward;
