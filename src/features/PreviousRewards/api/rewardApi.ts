// src/features/PreviousRewards/api/rewardApi.ts

import api from '@/shared/api/axiosInstance';
import { PlayerData } from '../types/PlayerData';

interface ApiResponseData {
  userId: string;
  rank: number;
  slRewards: number;
  usdtRewards: number;
  nftType: string | null;
  selectedRewardType: string | null | undefined;
}

interface SelectRewardRequest {
  round: number;
  rank: number;
  selectRewardType: "USDT" | "SL";
}

/**
 * 랭킹 보상 선택 API
 * @param round 라운드 번호
 * @param rank 유저 랭크
 * @param selectRewardType 'USDT' 또는 'SL'
 */
export async function selectRankingReward(round: number, rank: number, selectRewardType: "USDT" | "SL"): Promise<PlayerData> {
  const response = await api.post('/leader/ranking/select', {
    round,
    rank,
    selectRewardType
  });
  const data: ApiResponseData = response.data.data;

  return {
    userId: data.userId,
    rank: data.rank,
    slRewards: data.slRewards,
    usdtRewards: data.usdtRewards,
    nftType: data.nftType,
    selectedRewardType: data.selectedRewardType ?? null // undefined이면 null 처리
  };
}

/**
 * 래플 보상 선택 API
 * @param round 라운드 번호
 * @param rank 유저 랭크
 * @param selectRewardType 'USDT' 또는 'SL'
 */
export async function selectRaffleReward(round: number, rank: number, selectRewardType: "USDT" | "SL"): Promise<PlayerData> {
  const response = await api.post('/leader/raffle/select', {
    round,
    rank,
    selectRewardType
  });
  const data: ApiResponseData = response.data.data;

  return {
    userId: data.userId,
    rank: data.rank,
    slRewards: data.slRewards,
    usdtRewards: data.usdtRewards,
    nftType: data.nftType,
    selectedRewardType: data.selectedRewardType ?? null
  };
}
