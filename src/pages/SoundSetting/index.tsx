// 소리 설정 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';
import { useSoundStore } from '@/shared/store/useSoundStore';

const SoundSetting: React.FC = () => {
    const navigate = useNavigate();
    const {
        // 배경음 관련
        bgmVolume,
        bgmMuted,
        setBgmVolume,
        toggleBgmMute,
        // 효과음 관련
        sfxVolume,
        sfxMuted,
        setSfxVolume,
        toggleSfxMute,
        // 마스터 볼륨 관련
        masterVolume,
        masterMuted,
        setMasterVolume,
        toggleMasterMute,
    } = useSoundStore();

    const handleSave = () => {
        // 추후에 저장 로직 추가
        navigate(-1);
      };

    return (
        <div className="flex flex-col items-center text-white px-6 min-h-screen">
            <TopTitle title="Sound Settings" back={true} />

            <div className="w-full">
            {/* 1) 마스터 볼륨 */}
            <div className="bg-gray-800 rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">Master Volume</h2>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md text-sm"
                        onClick={toggleMasterMute}
                        >
                        {masterMuted ? 'Unmute' : 'Mute'}
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
                    />
                    <div className="ml-3 w-10 text-center">
                        {/* 0~10으로 표기하여 사용자가 직관적으로 인지 */}
                        {Math.round(masterVolume * 10)}/10
                    </div>
                </div>
            </div>

            {/* 2) 배경음(BGM) */}
            <div className="bg-gray-800 rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">Background Music</h2>
                <div className="flex items-center justify-between">
                    <button
                    className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md text-sm"
                    onClick={toggleBgmMute}
                    >
                    {bgmMuted ? 'Unmute' : 'Mute'}
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
                    />
                    <div className="ml-3 w-10 text-center">
                        {/* 0~10으로 표기하여 사용자가 직관적으로 인지 */}
                        {Math.round(masterVolume * 10)}/10
                    </div>
                </div>
            </div>

            {/* 3) 효과음(SFX) */}
            <div className="bg-gray-800 rounded-md p-4">
                <h2 className="text-lg font-semibold mb-2">Sound Effects</h2>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded-md text-sm"
                        onClick={toggleSfxMute}
                        >
                        {sfxMuted ? 'Unmute' : 'Mute'}
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
                    />
                    <div className="ml-3 w-10 text-center">
                        {/* 0~10으로 표기하여 사용자가 직관적으로 인지 */}
                        {Math.round(masterVolume * 10)}/10
                    </div>
                </div>
            </div>
        </div>

        {/* 저장 버튼 */}
        <div className="w-full mt-auto mb-6">
            <button
                onClick={handleSave}
                className="bg-[#0147E5] w-full py-4 rounded-full text-base font-medium"
                >
                Save
            </button>
        </div>
    </div>
  );
};

export default SoundSetting;