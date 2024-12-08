// src/features/DiceEvent/api/anywhereApi.ts

import api from '@/shared/api/axiosInstance'; // 수정된 부분

interface AnywhereRequest {
  moveTo: number;
}

interface AnywhereResponseData {
  rank: number;
  star: number;
  ticket: number;
  dice: number;
  slToken: number;
  diceResult: number;
  tileSequence: number;
}

interface AnywhereResponse {
  code: string;
  message: string;
  data: AnywhereResponseData;
}

export const anywhereAPI = async (moveTo: number): Promise<AnywhereResponseData> => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    throw new Error('Access token not found. Please log in.');
  }

  try {
    const response = await api.post<AnywhereResponse>(
      '/anywhere', // 엔드포인트 경로가 올바른지 확인하세요.
      { moveTo },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.code === 'OK') {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Failed to move to the selected tile.');
    }
  } catch (error: any) {
    console.error('Error in anywhereAPI:', error);
    throw new Error(error.response?.data?.message || 'An error occurred while moving.');
  }
};
