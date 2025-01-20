// hooks/useAudioManager.ts
import { useEffect, useRef } from 'react';
import { Howl } from 'howler';
import { useSoundStore } from '../store/useSoundStore';

/**
 * BGM 자동 로드/재생 + zustand(볼륨/뮤트) 연동.
 * - 효과음(SFX)에 대해 loop 옵션과 stopSfx를 제공.
 * - loop=false인 경우, 기존처럼 1회성 재생 후 끝.
 * - loop=true인 경우, Map에 Howl을 저장하여 stopSfx로 정지 가능.
 */
export function useAudioManager(bgmSrc: string) {
  const bgmRef = useRef<Howl | null>(null);

  // 루프 SFX를 관리할 Map (src -> Howl)
  const loopSfxMapRef = useRef<Map<string, Howl>>(new Map());

  // zustand에서 가져올 볼륨/뮤트 정보
  const {
    bgmVolume, sfxVolume, masterVolume,
    bgmMuted, sfxMuted, masterMuted,
  } = useSoundStore();

  // ========== 1) BGM: Howl 인스턴스 생성 및 재생 ==========
  useEffect(() => {
    if (!bgmRef.current) {
      bgmRef.current = new Howl({
        src: [bgmSrc],
        loop: true,
        volume: 0, // 초기 볼륨 0, 아래 useEffect에서 업데이트
      });
      bgmRef.current.play();
    }

    return () => {
      bgmRef.current?.stop();
      bgmRef.current?.unload();
      bgmRef.current = null;
    };
  }, [bgmSrc]);

  // ========== 2) BGM 볼륨/뮤트 연동 ==========
  useEffect(() => {
    if (bgmRef.current) {
      const finalVolume = (masterMuted || bgmMuted)
        ? 0
        : bgmVolume * masterVolume;
      bgmRef.current.volume(finalVolume);
    }
  }, [bgmVolume, bgmMuted, masterVolume, masterMuted]);

  // ========== 3) SFX 재생 함수 (loop 옵션 포함) ==========
  function playSfx(sfxSrc: string, options?: { loop?: boolean }) {
    // 최종 볼륨 계산
    const finalVolume = (masterMuted || sfxMuted)
      ? 0
      : sfxVolume * masterVolume;

    // 만약 loop = true라면 무한 반복
    if (options?.loop) {
      // 이미 생성된 Howl이 있는지 확인
      let existingHowl = loopSfxMapRef.current.get(sfxSrc);

      if (!existingHowl) {
        existingHowl = new Howl({
          src: [sfxSrc],
          volume: finalVolume,
          loop: true, // 무한 반복
        });
        loopSfxMapRef.current.set(sfxSrc, existingHowl);
      } else {
        // 기존 인스턴스의 볼륨 업데이트
        existingHowl.volume(finalVolume);
        existingHowl.loop(true);
      }

      // (이미 재생 중이어도) 다시 play() 호출하여 재시작
      existingHowl.stop();
      existingHowl.play();
    }
    //
    // loop = false(또는 undefined)인 경우: 매번 새로 생성 후 1회 재생
    // => 기존 로직과 동일하게 '단발성 효과음'
    else {
      const sfx = new Howl({
        src: [sfxSrc],
        volume: finalVolume,
        loop: false,
      });
      sfx.play();
    }
  }

  // ========== 4) SFX 정지 함수 (loop 사운드 정지 전용) ==========
  function stopSfx(sfxSrc: string) {
    const loopSound = loopSfxMapRef.current.get(sfxSrc);
    if (loopSound) {
      loopSound.stop();
      // 필요하다면 완전히 해제할 수도 있음 (unload)
      // loopSound.unload();
      // loopSfxMapRef.current.delete(sfxSrc);
    }
  }

  // ========== 5) (선택) 볼륨/뮤트 변화 시, 루프 사운드들도 실시간 반영 ==========
  useEffect(() => {
    const finalVolume = (masterMuted || sfxMuted)
      ? 0
      : sfxVolume * masterVolume;
    loopSfxMapRef.current.forEach((sound) => {
      sound.volume(finalVolume);
    });
  }, [sfxVolume, masterVolume, sfxMuted, masterMuted]);

  return {
    playSfx,
    stopSfx,
  };
}
