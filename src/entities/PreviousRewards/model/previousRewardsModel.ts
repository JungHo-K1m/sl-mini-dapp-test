// src/entities/PreviousRewards/model/previousRewardsModel.ts

import create from 'zustand';
import { fetchInitialRankingAPI, InitialDataResponse } from '../api/previousRewardsApi';
import { PlayerData } from '@/features/PreviousRewards/types/PlayerData';

interface PreviousRewardsEntityState {
  myRanking: PlayerData[] | null;
  topRankings: PlayerData[];
  isLoadingInitial: boolean;
  errorInitial: string | null;
  loadInitialRanking: () => Promise<void>;
}

export const usePreviousRewardsEntityStore = create<PreviousRewardsEntityState>((set) => ({
  myRanking: null,
  topRankings: [],
  isLoadingInitial: false,
  errorInitial: null,
  loadInitialRanking: async () => {
    set({ isLoadingInitial: true, errorInitial: null });
    try {
      const { myRanking, rankings } = await fetchInitialRankingAPI();
      // myRanking은 서버에서 itsMe가 true로 설정되어 있다고 가정
      set({
        myRanking: myRanking,
        topRankings: rankings,
        isLoadingInitial: false,
        errorInitial: null,
      });
    } catch (error: any) {
      set({
        isLoadingInitial: false,
        errorInitial: error.message || 'Failed to load initial data',
      });
    }
  },
}));
