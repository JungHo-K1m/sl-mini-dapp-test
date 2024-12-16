import api from '@/shared/api/axiosInstance';
import { LeaderTabData, LeaderboardPage } from '../types';

/**
 * /leader/tab API 호출 함수
 * @returns 서버로부터 받은 리더보드 데이터 (상위 10명)
 * @throws 에러 발생 시 에러 메시지 반환
 */
export const fetchLeaderTabAPI = async (): Promise<LeaderTabData> => {
  try {
    const response = await api.get('/leader/tab', {
      // 필요한 헤더나 파라미터가 있다면 추가
      // 예: headers: { Authorization: `Bearer ${accessToken}` }
    });

    if (response.data.code !== 'OK') {
      throw new Error(response.data.message || 'Failed to fetch leader tab data');
    }

    return response.data.data;
  } catch (error: any) {
    console.error('fetchLeaderTabAPI 에러:', error);
    throw error;
  }
};

/**
 * /leader/{pageNum} API 호출 함수
 * @param pageNum 페이지 번호 (1부터 시작)
 * @returns 서버로부터 받은 리더보드 페이지 데이터
 * @throws 에러 발생 시 에러 메시지 반환
 */
export const fetchLeaderboardPageAPI = async (pageNum: number): Promise<LeaderboardPage> => {
  try {
    const response = await api.get(`/leader/${pageNum}`, {
      // 필요한 헤더나 파라미터가 있다면 추가
      // 예: headers: { Authorization: `Bearer ${accessToken}` }
    });

    // 응답 구조에 따라 에러 처리
    if (response.data.code && response.data.code !== 'OK') {
      throw new Error(response.data.message || 'Failed to fetch leaderboard page data');
    }

    return response.data;
  } catch (error: any) {
    console.error('fetchLeaderboardPageAPI 에러:', error);
    throw error;
  }
};
