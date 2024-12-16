// src/entities/RewardPage/model/rewardModel.ts

import create from 'zustand';
import { fetchLeaderHomeAPI } from '../api/rewardsAPI';
import {
  LeaderHomeData,
  RankingAward,
  DrawAward,
  AirDropAward,
} from '../types';

// 리워드 상태 인터페이스
interface RewardState {
  // 리워드 데이터
  rankingAwards: RankingAward[];
  drawAwards: DrawAward[];
  airDropAwards: AirDropAward[] | null;
  rank: {
    rank: number;
    star: number;
    ticket: number;
    slToken: number;
    diceRefilledAt: string | null;
  };

  // 로딩 및 에러 상태
  isLoadingHome: boolean;
  errorHome: string | null;

  // 액션
  fetchLeaderHome: () => Promise<void>;
}

export const useRewardStore = create<RewardState>((set, get) => ({
  // 초기 상태
  rankingAwards: [],
  drawAwards: [],
  airDropAwards: null,
  rank: {
    rank: 0,
    star: 0,
    ticket: 0,
    slToken: 0,
    diceRefilledAt: null,
  },

  isLoadingHome: false,
  errorHome: null,

  // 액션 구현
  fetchLeaderHome: async () => {
    set({ isLoadingHome: true, errorHome: null });
    try {
      const data: LeaderHomeData = await fetchLeaderHomeAPI();

      console.log('Fetched LeaderHomeData:', data);
      set({
        rankingAwards: data.rankingAwards,
        drawAwards: data.drawAwards,
        airDropAwards: data.airDropAwards,
        rank: data.rank,
        isLoadingHome: false,
        errorHome: null,
      });
    } catch (error: any) {
      set({ isLoadingHome: false, errorHome: error.message || 'Failed to fetch leader home data' });
    }
  },
}));
