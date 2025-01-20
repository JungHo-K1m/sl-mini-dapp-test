// SoundProvider.tsx
import React, { createContext, useContext } from 'react';
import { useAudioManager } from '../hooks/useAudioManager';

interface SoundContextProps {
  // loop 옵션을 받을 수 있도록
  playSfx: (src: string, options?: { loop?: boolean }) => void;
  // loop 사운드를 중지할 수 있는 stopSfx
  stopSfx: (src: string) => void;
}

const SoundContext = createContext<SoundContextProps>({
  playSfx: () => {},
  stopSfx: () => {},
});

interface SoundProviderProps {
  bgmSrc: string;
  children: React.ReactNode;
}

export function SoundProvider({ bgmSrc, children }: SoundProviderProps) {
  const { playSfx, stopSfx } = useAudioManager(bgmSrc);

  return (
    <SoundContext.Provider value={{ playSfx, stopSfx }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
