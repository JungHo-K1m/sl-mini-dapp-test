// src/entities/RewardPage/api/rewardsAPI.ts

import api from '@/shared/api/axiosInstance';
import { LeaderHomeData, LeaderboardPage } from '../types';

/**
 * /leader/home API 호출 함수
 * @returns 서버로부터 받은 리워드 및 리더보드 데이터
 * @throws 에러 발생 시 에러 메시지 반환
 */
export const fetchLeaderHomeAPI = async (): Promise<LeaderHomeData> => {
  try {
    const response = await api.get('/leader/home');
    if (response.data.code !== 'OK') {
      throw new Error(response.data.message || 'Failed to fetch leader home data');
    }
    return response.data.data;
  } catch (error: any) {
    console.error('fetchLeaderHomeAPI 에러:', error);
    throw error;
  }
};

/**
 * /leader/{pageNum} API 호출 함수
 * @param pageNum 페이지 번호
 * @returns 서버로부터 받은 리더보드 페이지 데이터
 * @throws 에러 발생 시 에러 메시지 반환
 */
export const fetchLeaderboardPageAPI = async (pageNum: number): Promise<LeaderboardPage> => {
  try {
    const response = await api.get(`/leader/${pageNum}`);
    return response.data;
  } catch (error: any) {
    console.error('fetchLeaderboardPageAPI 에러:', error);
    throw error;
  }
};
