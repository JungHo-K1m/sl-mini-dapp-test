// stores/useSoundStore.ts
import { create } from 'zustand';

interface SoundStore {
  // 볼륨 (0 ~ 1)
  bgmVolume: number;
  sfxVolume: number;
  masterVolume: number;

  // 음소거 여부
  bgmMuted: boolean;
  sfxMuted: boolean;
  masterMuted: boolean;

  // 액션(업데이트 함수들)
  setBgmVolume: (volume: number) => void;
  setSfxVolume: (volume: number) => void;
  setMasterVolume: (volume: number) => void;

  toggleBgmMute: () => void;
  toggleSfxMute: () => void;
  toggleMasterMute: () => void;
}

export const useSoundStore = create<SoundStore>((set) => ({
  // 초기값 설정
  bgmVolume: 0.5,
  sfxVolume: 0.5,
  masterVolume: 0.5,

  bgmMuted: false,
  sfxMuted: false,
  masterMuted: false,

  // 볼륨 설정
  setBgmVolume: (volume) => set({ bgmVolume: volume }),
  setSfxVolume: (volume) => set({ sfxVolume: volume }),
  setMasterVolume: (volume) => set({ masterVolume: volume }),

  // 음소거 토글
  toggleBgmMute: () => set((state) => ({ bgmMuted: !state.bgmMuted })),
  toggleSfxMute: () => set((state) => ({ sfxMuted: !state.sfxMuted })),
  toggleMasterMute: () => set((state) => ({ masterMuted: !state.masterMuted })),
}));
