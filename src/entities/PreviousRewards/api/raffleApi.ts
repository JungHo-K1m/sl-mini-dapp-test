// src/entities/PreviousRewards/api/raffleApi.ts

import api from '@/shared/api/axiosInstance';
import { PlayerData } from '@/features/PreviousRewards/types/PlayerData';

export interface RaffleInitialDataResponse {
  myRankings: PlayerData[];
  rankings: PlayerData[];
}

// 래플 초기 데이터 조회 API
export const fetchInitialRaffleAPI = async (): Promise<RaffleInitialDataResponse> => {
  const response = await api.get("/leader/raffle/initial");
  console.log("raffle = ", response);
  return response.data.data as RaffleInitialDataResponse;
};

export interface RaffleRangeRankingData {
  userId: string;
  rank: number;
  slRewards: number;
  usdtRewards: number;
  nftType: string | null;
  selectedRewardType?: string | null;
  itsMe?: boolean; // 추가된 필드
}

// 래플 범위별 랭킹 조회 API
export const fetchRaffleRangeRankingAPI = async (rangeStart: number, rangeEnd: number): Promise<RaffleRangeRankingData[]> => {
  const response = await api.post("/leader/raffle/range", { rangeStart, rangeEnd });
  return response.data.data as RaffleRangeRankingData[];
};
