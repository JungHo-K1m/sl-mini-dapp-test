// SoundSetting.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { TopTitle } from '@/shared/components/ui';
import { useSoundStore } from '@/shared/store/useSoundStore';
import saveSoundSetting from '@/entities/User/api/saveSoundSetting';
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';
import { useSound } from "@/shared/provider/SoundProvider";
import Audios from "@/shared/assets/audio";

const SoundSetting: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { playSfx } = useSound();
  const {
    // 마스터
    masterVolume,
    masterMuted,
    setMasterVolume,
    toggleMasterMute,
    // 배경음(BGM)
    bgmVolume,
    bgmMuted,
    setBgmVolume,
    toggleBgmMute,
    // 효과음(SFX)
    sfxVolume,
    sfxMuted,
    setSfxVolume,
    toggleSfxMute,
  } = useSoundStore();

  const handleSave = async() => {
    try{
      const soundData = {
        masterVolume: masterVolume*10,
        masterMute: masterMuted,
        backVolume: bgmVolume*10,
        backMute: bgmMuted,
        effectVolume: sfxVolume*10,
        effectMute: sfxMuted
      };

      const saveResponse = await saveSoundSetting(soundData);

      if (saveResponse) {
        navigate("/dice-event");
      } else {
        // 실패(false) 시 사용자에게 알림/로그 등 처리
        alert("사운드 설정 저장에 실패했습니다. 다시 시도해주세요.");
      }
    } catch (error: any) {
      // 에러 핸들링
      console.error("사운드 설정 저장 중 에러:", error);
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex flex-col items-center text-white px-6 min-h-screen">
      <TopTitle title={t("setting.sound_settings")} back={true} />

      <div className="w-full">

        {/* 1) 마스터 볼륨 */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2">{t("setting.master")}</h2>
          <div className="bg-gray-800 rounded-full w-full h-14 flex items-center justify-between py-2 px-4">
            <button
              className="bg-[#0147E5] px-4 py-1 rounded-2xl text-sm"
              onClick={()=>{
                playSfx(Audios.button_click);
                toggleMasterMute();
              }}>
                {masterMuted ? (
                    <HiVolumeOff className="text-xl" />
                ) : (
                    <HiVolumeUp className="text-xl" />
                )}
            </button>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={masterMuted ? 0 : masterVolume * 10}
              onChange={(e) => {
                setMasterVolume(Number(e.target.value) / 10);
              }}
              disabled={masterMuted}
              className="mx-2 flex-1"
            />
            <div className="ml-2 w-10 text-center">
              {Math.round(masterVolume * 10)}/10
            </div>
          </div>
        </div>

        {/* 2) 배경음(BGM) */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2">{t("setting.bgm")}</h2>
          <div className="bg-gray-800 rounded-full w-full h-14 flex items-center justify-between py-2 px-4">
            <button
              className="bg-[#0147E5] px-4 py-1 rounded-2xl text-sm"
              onClick={() => {
                playSfx(Audios.button_click);
                toggleBgmMute();
              }}
            >
                {bgmMuted ? (
                    <HiVolumeOff className="text-xl" />
                ) : (
                    <HiVolumeUp className="text-xl" />
                )}
            </button>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={bgmMuted ? 0 : bgmVolume * 10}
              onChange={(e) => {
                setBgmVolume(Number(e.target.value) / 10);
              }}
              disabled={bgmMuted}
              className="mx-2 flex-1"
            />
            <div className="ml-2 w-10 text-center">
              {Math.round(bgmVolume * 10)}/10
            </div>
          </div>
        </div>

        {/* 3) 효과음(SFX) */}
        <div className="mb-3">
          <h2 className="text-lg font-semibold mb-2">{t("setting.effect")}</h2>
          <div className="bg-gray-800 rounded-full w-full h-14 flex items-center justify-between py-2 px-4">
            <button
              className="bg-[#0147E5] px-4 py-1 rounded-2xl text-sm"
              onClick={() => {
                playSfx(Audios.button_click);
                toggleSfxMute();
              }}>
                {sfxMuted ? (
                    <HiVolumeOff className="text-xl" />
                ) : (
                    <HiVolumeUp className="text-xl" />
                )}
            </button>
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={sfxMuted ? 0 : sfxVolume * 10}
              onChange={(e) => {
                setSfxVolume(Number(e.target.value) / 10);
              }}
              disabled={sfxMuted}
              className="mx-2 flex-1"
            />
            <div className="ml-2 w-10 text-center">
              {Math.round(sfxVolume * 10)}/10
            </div>
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="w-full mt-auto mb-6">
        <button
          onClick={() => {
            playSfx(Audios.button_click);
            handleSave();
          }}
          className="bg-[#0147E5] w-full py-4 rounded-full text-base font-medium"
        >
          {t("setting.save")}
        </button>
      </div>
    </div>
  );
};

export default SoundSetting;
