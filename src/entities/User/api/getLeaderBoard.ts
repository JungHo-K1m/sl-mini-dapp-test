import api from '@/shared/api/axiosInstance';

// 사용자의 랭킹 및 보유 재화, 월별 보상 정보 가져오는 함수
export const getLeaderBoard = async (): Promise<any> => {
  const response = await api.get('/leader/rank-and-monthly');

  if (response.data.code === 'OK') {
    return response.data.data;
  } else {
    console.error('Unexpected response:', response);
    throw new Error(response.data.message || 'Failed to fetch ranking information');
  }
};


export default getLeaderBoard;
