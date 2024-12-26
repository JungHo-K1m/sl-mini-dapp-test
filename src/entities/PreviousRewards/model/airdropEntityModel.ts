// src/entities/PreviousRewards/model/airdropEntityModel.ts

import create from 'zustand';
import { fetchAirdropAPI, AirdropWinner, AirdropMyReward } from '@/entities/PreviousRewards/api/airdropApi';

interface AirdropEntityState {
  winners: AirdropWinner[];          // 당첨된 16인
  myReward: AirdropMyReward | null;  // 나의 보상 (rank가 없을 수도 있음)
  isLoadingAirdrop: boolean;
  errorAirdrop: string | null;
  hasLoadedAirdrop: boolean;         // 데이터를 이미 불러왔는지 여부
  loadAirdrop: () => Promise<void>;
}

export const useAirdropEntityStore = create<AirdropEntityState>((set) => ({
  winners: [],
  myReward: null,
  isLoadingAirdrop: false,
  errorAirdrop: null,
  hasLoadedAirdrop: false,
  loadAirdrop: async () => {
    set({ isLoadingAirdrop: true, errorAirdrop: null });
    try {
      const data = await fetchAirdropAPI();
      if (data) {
        set({
          winners: data.winners,
          myReward: data.myReward,
          isLoadingAirdrop: false,
          errorAirdrop: null,
          hasLoadedAirdrop: true,
        });
      } else {
        // data가 null이면, 지난 달 에어드롭이 없었던 경우
        set({
          winners: [],
          myReward: null,
          isLoadingAirdrop: false,
          errorAirdrop: null,
          hasLoadedAirdrop: true,
        });
      }
    } catch (error: any) {
      set({
        isLoadingAirdrop: false,
        errorAirdrop: error.message || 'Failed to load airdrop data',
        hasLoadedAirdrop: true,
      });
    }
  },
}));
