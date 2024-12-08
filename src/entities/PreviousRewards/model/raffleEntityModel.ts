import { create } from 'zustand';
import { fetchInitialRaffleAPI, RaffleInitialDataResponse } from '../api/raffleApi';
import { PlayerData } from '@/features/PreviousRewards/types/PlayerData';

interface RaffleEntityState {
  myRankings: PlayerData[] | null;
  topRankings: PlayerData[];
  isLoadingInitialRaffle: boolean;
  errorInitialRaffle: string | null;
  hasLoadedInitialRaffle: boolean; // 추가된 플래그
  loadInitialRaffle: () => Promise<void>;
}

export const useRaffleEntityStore = create<RaffleEntityState>((set) => ({
  myRankings: null,
  topRankings: [],
  isLoadingInitialRaffle: false,
  errorInitialRaffle: null,
  hasLoadedInitialRaffle: false, // 초기값 설정
  loadInitialRaffle: async () => {
    set({ isLoadingInitialRaffle: true, errorInitialRaffle: null });
    try {
      const { myRankings, rankings } = await fetchInitialRaffleAPI();
      set({
        myRankings: myRankings,
        topRankings: rankings,
        isLoadingInitialRaffle: false,
        errorInitialRaffle: null,
        hasLoadedInitialRaffle: true, // 로딩 완료 플래그 설정
      });
    } catch (error: any) {
      set({
        isLoadingInitialRaffle: false,
        errorInitialRaffle: error.message || 'Failed to load initial raffle data',
        hasLoadedInitialRaffle: true, // 에러 발생 시에도 플래그 설정
      });
    }
  },
}));
