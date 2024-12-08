//src\features\PreviousRewards\model\previousRewardsModel.ts

import { create } from 'zustand';
import { fetchRangeRankingAPI, RangeRankingData } from '../api/previousRewardsApi';

interface PreviousRewardsFeatureState {
  dialogRankings: RangeRankingData[];
  isLoadingRange: boolean;
  rangeError: string | null;
  loadRangeRanking: (start: number, end: number) => Promise<void>;
}

export const usePreviousRewardsFeatureStore = create<PreviousRewardsFeatureState>((set) => ({
  dialogRankings: [],
  isLoadingRange: false,
  rangeError: null,
  loadRangeRanking: async (start, end) => {
    set({ isLoadingRange: true, rangeError: null });
    try {
      const data = await fetchRangeRankingAPI(start, end);
      set({
        dialogRankings: data,
        isLoadingRange: false,
        rangeError: null,
      });
    } catch (error: any) {
      set({
        isLoadingRange: false,
        rangeError: error.message || 'Failed to load range data',
      });
    }
  },
}));
