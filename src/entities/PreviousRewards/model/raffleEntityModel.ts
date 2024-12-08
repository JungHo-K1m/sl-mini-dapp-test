// src/entities/PreviousRewards/model/raffleEntityModel.ts

import { create } from 'zustand';
import { fetchInitialRaffleAPI, RaffleInitialDataResponse } from '../api/raffleApi';
import { PlayerData } from '@/features/PreviousRewards/types/PlayerData';

interface RaffleEntityState {
  myRankings: PlayerData[] | null;
  topRankings: PlayerData[];
  isLoadingInitialRaffle: boolean;
  errorInitialRaffle: string | null;
  loadInitialRaffle: () => Promise<void>;
}

export const useRaffleEntityStore = create<RaffleEntityState>((set) => ({
  myRankings: null,
  topRankings: [],
  isLoadingInitialRaffle: false,
  errorInitialRaffle: null,
  loadInitialRaffle: async () => {
    set({ isLoadingInitialRaffle: true, errorInitialRaffle: null });
    try {
      const { myRankings, rankings } = await fetchInitialRaffleAPI();
      // myRankings은 서버에서 itsMe가 true로 설정되어 있다고 가정
      set({
        myRankings: myRankings,
        topRankings: rankings,
        isLoadingInitialRaffle: false,
        errorInitialRaffle: null,
      });
    } catch (error: any) {
      set({
        isLoadingInitialRaffle: false,
        errorInitialRaffle: error.message || 'Failed to load initial raffle data',
      });
    }
  },
}));
