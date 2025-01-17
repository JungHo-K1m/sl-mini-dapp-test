// providers/SoundProvider.tsx
import React, { createContext, useContext } from 'react';
import { useAudioManager } from '../hooks/useAudioManager';

// 플레이 효과음을 실행하기 위한 함수 시그니처
interface SoundContextProps {
  playSfx: (src: string) => void;
}

// Context 기본값
const SoundContext = createContext<SoundContextProps>({
  playSfx: () => {},
});

// 실제 Provider
interface SoundProviderProps {
  bgmSrc: string; // BGM 파일 경로
  children: React.ReactNode;
}

export function SoundProvider({ bgmSrc, children }: SoundProviderProps) {
  // 오디오 매니저 훅 사용
  const { playSfx } = useAudioManager(bgmSrc);

  return (
    <SoundContext.Provider value={{ playSfx }}>
      {children}
    </SoundContext.Provider>
  );
}

// 간편하게 useSound() 훅으로 접근 가능하도록
export function useSound() {
  return useContext(SoundContext);
}
