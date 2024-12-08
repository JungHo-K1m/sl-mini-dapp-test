// src/features/DiceEvent/api/refillDiceApi.ts

import api from '@/shared/api/axiosInstance';

/**
 * 주사위 리필 API 호출 함수
 * @returns 서버로부터 받은 주사위 리필 데이터
 * @throws 에러 발생 시 에러 메시지 반환
 */
export const refillDiceAPI = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Access token not found. Please log in again.');
    }

    const response = await api.get('/home/refill-dice', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    console.log('refillDiceAPI response:', response); // 디버깅을 위한 로그 추가

    // 서버의 응답 구조에 맞게 반환
    return response.data.data;
  } catch (error: any) {
    console.error('refillDiceAPI 에러:', error);
    throw error;
  }
};
