// src/entities/PreviousRewards/api/previousRewardsApi.ts

import api from '@/shared/api/axiosInstance';
import { PlayerData } from '@/features/PreviousRewards/types/PlayerData';

export interface InitialDataResponse {
  myRanking: PlayerData[];
  rankings: PlayerData[];
}

// 초기 랭킹 정보(1~20, myRanking) 로드
export const fetchInitialRankingAPI = async (): Promise<InitialDataResponse> => {
  const response = await api.get("/leader/ranking/initial");
  return response.data.data as InitialDataResponse;
};

export interface RangeRankingData {
  userId: string;
  rank: number;
  slRewards: number;
  usdcRewards: number;
  nftType: string | null; // GOLD/SILVER/BRONZE/null
  selectedRewardType?: string | null; // USDC/SL/NULL
  itsMe?: boolean; // 추가된 필드
}

// 범위별 랭킹 조회 API
export const fetchRangeRankingAPI = async (rangeStart: number, rangeEnd: number): Promise<RangeRankingData[]> => {
  const response = await api.post("/leader/ranking/range", { rangeStart, rangeEnd });
  return response.data.data as RangeRankingData[];
};
