// src/features/DiceEvent/store/useGageStore.ts
import { create } from 'zustand';

interface GaugeStore {
  gaugeValue: number;
  setGaugeValue: (updater: (prevValue: number) => number) => void;
}

const useGaugeStore = create<GaugeStore>((set) => ({
  gaugeValue: 0.5,
  setGaugeValue: (updater) => set((state) => ({
    gaugeValue: updater(state.gaugeValue),
  })),
}));

export default useGaugeStore;
