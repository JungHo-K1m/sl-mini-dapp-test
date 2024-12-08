import { create } from 'zustand';
import { fetchInitialRankingAPI, InitialDataResponse } from '../api/previousRewardsApi';

interface PreviousRewardsEntityState {
  myRanking: InitialDataResponse['myRanking'] | null;
  topRankings: InitialDataResponse['rankings'];
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
      set({
        myRanking,
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
