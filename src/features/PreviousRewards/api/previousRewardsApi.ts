import api from '@/shared/api/axiosInstance';

export interface RangeRankingData {
  userId: string;
  rank: number;
  slRewards: number;
  usdtRewards: number;
  nftType: string | null; // GOLD/SILVER/BRONZE/null
  selectedRewardType?: string | null; // USDT/SL/NULL
}

// 범위별 랭킹 조회 API
export const fetchRangeRankingAPI = async (rangeStart: number, rangeEnd: number): Promise<RangeRankingData[]> => {
  const response = await api.post("/leader/ranking/range", { rangeStart, rangeEnd });
  return response.data.data as RangeRankingData[];
};
