// hooks/useAudioManager.ts
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useSoundStore } from '../store/useSoundStore';

/**
 * BGM을 자동으로 로드/재생하고,
 * zustand 상태 변화(볼륨, 뮤트)에 따라 Howler 인스턴스를 업데이트해준다.
 * 또한 효과음 재생을 위한 playSfx 함수를 제공한다.
 */
export function useAudioManager(bgmSrc: string) {
  const bgmRef = useRef<Howl | null>(null);

  // zustand에서 가져올 상태들
  const {
    bgmVolume,
    sfxVolume,
    masterVolume,
    bgmMuted,
    sfxMuted,
    masterMuted,
  } = useSoundStore();

  // 1) BGM Howl 인스턴스 생성 & 재생
  useEffect(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Howl({
        src: [bgmSrc],
        loop: true,
        // html5: true => 모바일 환경 등에서 필요하면 사용
        // volume은 초기값으로 0 세팅 후, 아래 useEffect에서 업데이트
        volume: 0,
      });
      bgmRef.current.play();
    }

    // 컴포넌트 언마운트시 정리
    return () => {
      bgmRef.current?.stop();
      bgmRef.current?.unload();
      bgmRef.current = null;
    };
  }, [bgmSrc]);

  // 2) zustand 상태 변화 => BGM 볼륨/뮤트 업데이트
  useEffect(() => {
    if (bgmRef.current) {
      // 최종 볼륨 = (마스터뮤트 or BGM뮤트)이면 0, 아니면 (bgmVolume * masterVolume)
      const finalVolume = (masterMuted || bgmMuted)
        ? 0
        : bgmVolume * masterVolume;

      bgmRef.current.volume(finalVolume);
    }
  }, [bgmVolume, bgmMuted, masterVolume, masterMuted]);

  // 3) SFX 재생 함수
  function playSfx(sfxSrc: string) {
    // 마스터/효과음이 모두 뮤트 상태면 볼륨 0
    const finalVolume = (masterMuted || sfxMuted)
      ? 0
      : sfxVolume * masterVolume;

    // 재생 시점에 새 Howl 인스턴스를 만들어서 재생
    const sfx = new Howl({
      src: [sfxSrc],
      volume: finalVolume,
    });
    sfx.play();
  }

  return {
    playSfx,
  };
}
