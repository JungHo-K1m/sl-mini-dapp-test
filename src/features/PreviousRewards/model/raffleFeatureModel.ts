// src/features/PreviousRewards/model/raffleFeatureModel.ts
import { create } from 'zustand';
import { fetchRaffleRangeRankingAPI, RaffleRangeRankingData } from '@/entities/PreviousRewards/api/raffleApi';

interface RaffleFeatureState {
  dialogRaffleRankings: RaffleRangeRankingData[];
  isLoadingRaffleRange: boolean;
  raffleRangeError: string | null;
  loadRaffleRangeRanking: (start: number, end: number) => Promise<void>;
}

export const useRaffleFeatureStore = create<RaffleFeatureState>((set) => ({
  dialogRaffleRankings: [],
  isLoadingRaffleRange: false,
  raffleRangeError: null,
  loadRaffleRangeRanking: async (start, end) => {
    set({ isLoadingRaffleRange: true, raffleRangeError: null });
    try {
      const data = await fetchRaffleRangeRankingAPI(start, end);
      set({
        dialogRaffleRankings: data,
        isLoadingRaffleRange: false,
        raffleRangeError: null,
      });
    } catch (error: any) {
      set({
        isLoadingRaffleRange: false,
        raffleRangeError: error.message || 'Failed to load raffle range data',
      });
    }
  },
}));
