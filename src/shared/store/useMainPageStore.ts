import { create } from 'zustand';

interface MainPageState {
  selectedMenu: 'x-ray' | 'ai-analysis' | 'records' | null;
  setSelectedMenu: (menu: 'x-ray' | 'ai-analysis' | 'records') => void;
}

const useMainPageStore = create<MainPageState>((set) => ({
  selectedMenu: 'x-ray',
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));

export default useMainPageStore;