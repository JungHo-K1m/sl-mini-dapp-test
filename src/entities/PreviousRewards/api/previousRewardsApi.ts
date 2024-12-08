import api from '@/shared/api/axiosInstance';

export interface InitialDataResponse {
  myRanking: Array<{
    userId: string;
    rank: number;
    slRewards: number;
    usdtRewards: number;
    nftType: string | null;
    selectedRewardType: string | null;
  }>;
  rankings: Array<{
    userId: string;
    rank: number;
    slRewards: number;
    usdtRewards: number;
    nftType: string | null;
    itsMe?: boolean;
    selectedRewardType: string | null;
  }>;
}

// 초기 랭킹 정보(1~20, myRanking) 로드
export const fetchInitialRankingAPI = async (): Promise<InitialDataResponse> => {
  const response = await api.get("/leader/ranking/initial");
  return response.data.data as InitialDataResponse;
};
