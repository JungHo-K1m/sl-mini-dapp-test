// src/entities/Mission/model/missionModel.ts

import create from 'zustand';
import api from '@/shared/api/axiosInstance';

export interface Mission {
  id: number;
  name: string;
  description: string | null;
  diceReward: number;
  starReward: number;
  redirectUrl: string | null;
  type: 'ONETIME' | 'DAILY';
  isCleared: boolean;
}

interface MissionState {
  missions: Mission[];
  loading: boolean;
  error: string | null;
  fetchMissions: () => Promise<void>;
  clearMission: (id: number) => Promise<void>;
}

export const useMissionStore = create<MissionState>((set) => ({
  missions: [],
  loading: false,
  error: null,

  fetchMissions: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/missions');
      if (response.data.code === 'OK') {
        console.log(response);
        set({ missions: response.data.data, loading: false });
      } else {
        set({ error: response.data.message, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch missions.', loading: false });
    }
  },

  clearMission: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/onetime/mission', { id });
      if (response.data.code === 'OK') {
        set({ missions: response.data.data, loading: false });
      } else {
        set({ error: response.data.message, loading: false });
      }
    } catch (error: any) {
      set({ error: error.message || 'Failed to clear mission.', loading: false });
    }
  },
}));
