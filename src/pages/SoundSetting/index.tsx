// 소리 설정 페이지
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopTitle } from '@/shared/components/ui';
import { useSoundStore } from '@/shared/store/useSoundStore';

const SoundSetting: React.FC = () => {
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

    return (
        <div>

        </div>
    );
};

export default SoundSetting;