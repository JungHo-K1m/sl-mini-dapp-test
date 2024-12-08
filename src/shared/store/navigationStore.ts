// src/app/store/navigationStore.ts
import { create } from 'zustand';

interface NavigationState {
  selected: string;
  setSelected: (path: string) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  selected: '/dice-event',
  setSelected: (path) => set({ selected: path }),
}));
